// Supabase Edge Function: delete-user
// Handles deletion of users with proper authorization checks
// Clears company manager_id if deleting a manager

/// <reference path="../handle-user-signin/deno.d.ts" />

import { corsHeaders } from '../_shared/cors.ts';
import type { User } from '../_shared/types.ts';

// Environment variables
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing required environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
}

interface DeleteUserRequest {
  userId: string;
}

interface DeleteUserResponse {
  success: boolean;
  error?: string;
}

/**
 * Update record in database via REST API
 */
async function restUpdate<T = unknown>(
  table: string,
  id: string,
  payload: Record<string, unknown>,
): Promise<T> {
  const url = `${SUPABASE_URL}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`;
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      apiKey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`REST update failed (${response.status}): ${text}`);
  }

  return response.json();
}

/**
 * Delete record from database via REST API
 */
async function restDelete(table: string, id: string): Promise<void> {
  const url = `${SUPABASE_URL}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`;
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      apiKey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`REST delete failed (${response.status}): ${text}`);
  }
}

/**
 * Get record from database via REST API
 */
async function restSelect<T = unknown>(table: string, query = ''): Promise<T> {
  const url = `${SUPABASE_URL}/rest/v1/${table}${query}`;
  const response = await fetch(url, {
    headers: {
      apiKey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`REST select failed (${response.status}): ${text}`);
  }

  return response.json();
}

/**
 * Verify user authentication token
 */
async function verifyAuth(authHeader: string): Promise<{ id: string; email: string | null }> {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    method: 'GET',
    headers: {
      Authorization: authHeader,
      apiKey: SERVICE_ROLE_KEY,
    },
  });

  if (response.status === 401) {
    throw new Error('Unauthorized: Invalid or expired token');
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to verify token: ${response.status} ${text}`);
  }

  const data = await response.json();
  return { id: data.id, email: data.email ?? null };
}

/**
 * Create JSON response with CORS headers
 */
function jsonResponse(data: DeleteUserResponse, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}

// Main handler
Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Validate Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return jsonResponse(
        { success: false, error: 'Missing Authorization header' },
        401,
      );
    }

    // Verify authentication
    let authUser;
    try {
      authUser = await verifyAuth(authHeader);
    } catch (err) {
      console.error('Auth verification failed:', err);
      return jsonResponse(
        { success: false, error: 'Invalid or expired authentication token' },
        401,
      );
    }

    // Parse request body
    const body: DeleteUserRequest = await req.json();
    const { userId } = body;

    if (!userId) {
      return jsonResponse(
        { success: false, error: 'Missing userId' },
        400,
      );
    }

    console.log('Processing user deletion for user:', userId);

    // Get the requester's user record
    const requesterUsers = await restSelect<Partial<User>[]>(
      'user',
      `?auth_id=eq.${encodeURIComponent(authUser.id)}&select=id,company_id,role&limit=1`,
    );

    if (!Array.isArray(requesterUsers) || requesterUsers.length === 0) {
      return jsonResponse(
        { success: false, error: 'Requester user not found' },
        404,
      );
    }

    const requester = requesterUsers[0];
    const requesterRole = requester.role;

    // Get the target user to delete
    const targetUsers = await restSelect<Partial<User>[]>(
      'user',
      `?id=eq.${encodeURIComponent(userId)}&select=id,company_id,role&limit=1`,
    );

    if (!Array.isArray(targetUsers) || targetUsers.length === 0) {
      return jsonResponse(
        { success: false, error: 'Target user not found' },
        404,
      );
    }

    const targetUser = targetUsers[0];

    // Verify both users belong to the same company
    if (requester.company_id !== targetUser.company_id) {
      return jsonResponse(
        { success: false, error: 'Users must belong to the same company' },
        403,
      );
    }

    // Cannot delete yourself
    if (requester.id === targetUser.id) {
      return jsonResponse(
        { success: false, error: 'Cannot delete yourself' },
        400,
      );
    }

    // Cannot delete the owner
    if (targetUser.role === 'owner') {
      return jsonResponse(
        { success: false, error: 'Cannot delete the company owner' },
        403,
      );
    }

    // Authorization checks:
    // - Owner can delete manager and member
    // - Manager can delete member only
    // - Member cannot delete anyone
    if (requesterRole === 'member') {
      return jsonResponse(
        { success: false, error: 'Members cannot delete users' },
        403,
      );
    }

    if (requesterRole === 'manager' && targetUser.role === 'manager') {
      return jsonResponse(
        { success: false, error: 'Managers cannot delete other managers' },
        403,
      );
    }

    // If deleting a manager, clear the company's manager_id
    if (targetUser.role === 'manager' && targetUser.company_id) {
      console.log('Clearing company manager_id...');
      try {
        await restUpdate('company', targetUser.company_id, {
          manager_id: null,
          updated_at: new Date().toISOString(),
        });
        console.log('Company manager_id cleared successfully');
      } catch (err) {
        console.error('Failed to clear company manager_id:', err);
        return jsonResponse(
          { success: false, error: 'Failed to clear company manager reference' },
          500,
        );
      }
    }

    // Delete the user
    console.log('Deleting user...');
    try {
      await restDelete('user', userId);
      console.log('User deleted successfully');
    } catch (err) {
      console.error('Failed to delete user:', err);
      
      // Rollback: Restore manager_id if we cleared it
      if (targetUser.role === 'manager' && targetUser.company_id) {
        console.log('Rolling back company manager_id...');
        try {
          await restUpdate('company', targetUser.company_id, {
            manager_id: userId,
            updated_at: new Date().toISOString(),
          });
        } catch (rollbackErr) {
          console.error('Rollback failed:', rollbackErr);
        }
      }

      return jsonResponse(
        { success: false, error: 'Failed to delete user' },
        500,
      );
    }

    console.log('User deletion completed successfully');
    return jsonResponse({ success: true });

  } catch (err) {
    console.error('Unexpected error:', err);
    return jsonResponse(
      { success: false, error: 'Internal server error' },
      500,
    );
  }
});
