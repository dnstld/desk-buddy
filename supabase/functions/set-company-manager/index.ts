// Supabase Edge Function: set-company-manager
// Handles atomic update of user role to manager and company manager_id
// Uses rollback pattern to ensure both updates succeed or both fail

/// <reference path="../handle-user-signin/deno.d.ts" />

import { corsHeaders } from '../_shared/cors.ts';
import type { Company, User } from '../_shared/types.ts';

// Environment variables
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing required environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
}

interface SetManagerRequest {
  userId: string;
  companyId: string;
}

interface SetManagerResponse {
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
function jsonResponse(data: SetManagerResponse, status = 200): Response {
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
    const body: SetManagerRequest = await req.json();
    const { userId, companyId } = body;

    if (!userId || !companyId) {
      return jsonResponse(
        { success: false, error: 'Missing userId or companyId' },
        400,
      );
    }

    console.log('Processing manager assignment for user:', userId, 'company:', companyId);

    // Verify that the requester is the owner
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

    if (requester.role !== 'owner') {
      return jsonResponse(
        { success: false, error: 'Only owners can set managers' },
        403,
      );
    }

    if (requester.company_id !== companyId) {
      return jsonResponse(
        { success: false, error: 'Requester does not belong to this company' },
        403,
      );
    }

    // Verify that the target user exists and belongs to this company
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

    // Verify user belongs to this company
    if (targetUser.company_id !== companyId) {
      return jsonResponse(
        { success: false, error: 'Target user does not belong to this company' },
        403,
      );
    }

    // Cannot set owner as manager
    if (targetUser.role === 'owner') {
      return jsonResponse(
        { success: false, error: 'Cannot change the owner to manager' },
        400,
      );
    }

    // Get company and check current manager
    const companies = await restSelect<Partial<Company>[]>(
      'company',
      `?id=eq.${encodeURIComponent(companyId)}&select=id,manager_id&limit=1`,
    );

    if (!Array.isArray(companies) || companies.length === 0) {
      return jsonResponse(
        { success: false, error: 'Company not found' },
        404,
      );
    }

    const company = companies[0];
    const previousManagerId = company.manager_id;

    // Store original values for potential rollback
    const originalUserRole = targetUser.role;

    // Step 1: If there's a previous manager, demote them to member
    if (previousManagerId && previousManagerId !== userId) {
      console.log('Demoting previous manager to member...');
      try {
        await restUpdate('user', previousManagerId, { role: 'member' });
        console.log('Previous manager demoted successfully');
      } catch (err) {
        console.error('Failed to demote previous manager:', err);
        return jsonResponse(
          { success: false, error: 'Failed to demote previous manager' },
          500,
        );
      }
    }

    // Step 2: Update target user role to manager
    console.log('Updating user role to manager...');
    try {
      await restUpdate('user', userId, { role: 'manager' });
      console.log('User role updated successfully');
    } catch (err) {
      console.error('Failed to update user role:', err);
      
      // Rollback: Restore previous manager if we demoted them
      if (previousManagerId && previousManagerId !== userId) {
        console.log('Rolling back previous manager role...');
        try {
          await restUpdate('user', previousManagerId, { role: 'manager' });
        } catch (rollbackErr) {
          console.error('Rollback of previous manager failed:', rollbackErr);
        }
      }

      return jsonResponse(
        { success: false, error: 'Failed to update user role' },
        500,
      );
    }

    // Step 3: Update company manager_id
    console.log('Updating company manager_id...');
    try {
      await restUpdate('company', companyId, { 
        manager_id: userId,
        updated_at: new Date().toISOString(),
      });
      console.log('Company manager_id updated successfully');
    } catch (err) {
      console.error('Failed to update company manager_id:', err);
      
      // Rollback: Revert user role and restore previous manager
      console.log('Rolling back changes...');
      try {
        await restUpdate('user', userId, { role: originalUserRole });
        if (previousManagerId && previousManagerId !== userId) {
          await restUpdate('user', previousManagerId, { role: 'manager' });
        }
        console.log('Rollback successful');
      } catch (rollbackErr) {
        console.error('Rollback failed:', rollbackErr);
        // Log this critical error - manual intervention may be needed
      }

      return jsonResponse(
        { success: false, error: 'Failed to update company manager. Changes have been rolled back.' },
        500,
      );
    }

    console.log('Manager assignment completed successfully');
    return jsonResponse({ success: true });

  } catch (err) {
    console.error('Unexpected error:', err);
    return jsonResponse(
      { success: false, error: 'Internal server error' },
      500,
    );
  }
});
