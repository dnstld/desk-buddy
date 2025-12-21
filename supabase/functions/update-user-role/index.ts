// Supabase Edge Function: update-user-role
// Allows owners to update user roles (member <-> manager)
// Only owners can change roles, and they cannot change their own role or another owner's role

/// <reference path="../handle-user-signin/deno.d.ts" />

import { corsHeaders } from '../_shared/cors.ts';
import type { User } from '../_shared/types.ts';

// Environment variables
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing required environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
}

interface UpdateRoleRequest {
  userId: string;
  newRole: 'member' | 'manager';
}

interface UpdateRoleResponse {
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
function jsonResponse(data: UpdateRoleResponse, status = 200): Response {
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
    const body: UpdateRoleRequest = await req.json();
    const { userId, newRole } = body;

    if (!userId || !newRole) {
      return jsonResponse(
        { success: false, error: 'Missing userId or newRole' },
        400,
      );
    }

    // Validate newRole
    if (newRole !== 'member' && newRole !== 'manager') {
      return jsonResponse(
        { success: false, error: 'Invalid role. Must be "member" or "manager"' },
        400,
      );
    }

    console.log('Processing role update for user:', userId, 'to role:', newRole);

    // Get the requesting user (must be owner)
    const requestingUsers = await restSelect<Partial<User>[]>(
      'user',
      `?auth_id=eq.${encodeURIComponent(authUser.id)}&select=id,role,company_id&limit=1`,
    );

    if (!Array.isArray(requestingUsers) || requestingUsers.length === 0) {
      return jsonResponse(
        { success: false, error: 'Requesting user not found' },
        404,
      );
    }

    const requestingUser = requestingUsers[0];

    // Verify requesting user is an owner
    if (requestingUser.role !== 'owner') {
      return jsonResponse(
        { success: false, error: 'Unauthorized: Only owners can change user roles' },
        403,
      );
    }

    // Get the target user
    const targetUsers = await restSelect<Partial<User>[]>(
      'user',
      `?id=eq.${encodeURIComponent(userId)}&select=id,role,company_id&limit=1`,
    );

    if (!Array.isArray(targetUsers) || targetUsers.length === 0) {
      return jsonResponse(
        { success: false, error: 'Target user not found' },
        404,
      );
    }

    const targetUser = targetUsers[0];

    // Verify both users are in the same company
    if (targetUser.company_id !== requestingUser.company_id) {
      return jsonResponse(
        { success: false, error: 'Unauthorized: Cannot change role of users from different companies' },
        403,
      );
    }

    // Prevent changing owner roles
    if (targetUser.role === 'owner') {
      return jsonResponse(
        { success: false, error: 'Cannot change the role of an owner' },
        403,
      );
    }

    // Prevent changing own role
    if (targetUser.id === requestingUser.id) {
      return jsonResponse(
        { success: false, error: 'Cannot change your own role' },
        403,
      );
    }

    // Update the user's role
    console.log('Updating user role...');
    try {
      await restUpdate('user', userId, { role: newRole });
      console.log('User role updated successfully');
    } catch (err) {
      console.error('Failed to update user role:', err);
      return jsonResponse(
        { success: false, error: 'Failed to update user role' },
        500,
      );
    }

    console.log('Role update completed successfully');
    return jsonResponse({ success: true });

  } catch (err) {
    console.error('Unexpected error:', err);
    return jsonResponse(
      { success: false, error: 'Internal server error' },
      500,
    );
  }
});
