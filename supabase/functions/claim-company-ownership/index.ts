// Supabase Edge Function: claim-company-ownership
// Handles atomic update of user role to owner and company owner_id
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

interface ClaimOwnershipRequest {
  userId: string;
  companyId: string;
}

interface ClaimOwnershipResponse {
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
function jsonResponse(data: ClaimOwnershipResponse, status = 200): Response {
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
    const body: ClaimOwnershipRequest = await req.json();
    const { userId, companyId } = body;

    if (!userId || !companyId) {
      return jsonResponse(
        { success: false, error: 'Missing userId or companyId' },
        400,
      );
    }

    console.log('Processing ownership claim for user:', userId, 'company:', companyId);

    // Verify that the user exists and belongs to this company
    const users = await restSelect<Partial<User>[]>(
      'user',
      `?id=eq.${encodeURIComponent(userId)}&select=id,company_id,role,auth_id&limit=1`,
    );

    if (!Array.isArray(users) || users.length === 0) {
      return jsonResponse(
        { success: false, error: 'User not found' },
        404,
      );
    }

    const user = users[0];

    // Verify the authenticated user matches the userId
    if (user.auth_id !== authUser.id) {
      return jsonResponse(
        { success: false, error: 'Unauthorized: User mismatch' },
        403,
      );
    }

    // Verify user belongs to this company
    if (user.company_id !== companyId) {
      return jsonResponse(
        { success: false, error: 'User does not belong to this company' },
        403,
      );
    }

    // Check if company already has an owner
    const companies = await restSelect<Partial<Company>[]>(
      'company',
      `?id=eq.${encodeURIComponent(companyId)}&select=id,owner_id&limit=1`,
    );

    if (!Array.isArray(companies) || companies.length === 0) {
      return jsonResponse(
        { success: false, error: 'Company not found' },
        404,
      );
    }

    const company = companies[0];

    if (company.owner_id) {
      return jsonResponse(
        { success: false, error: 'Company already has an owner' },
        409,
      );
    }

    // Store original values for potential rollback
    const originalUserRole = user.role;

    // Step 1: Update user role to owner
    console.log('Updating user role to owner...');
    try {
      await restUpdate('user', userId, { role: 'owner' });
      console.log('User role updated successfully');
    } catch (err) {
      console.error('Failed to update user role:', err);
      return jsonResponse(
        { success: false, error: 'Failed to update user role' },
        500,
      );
    }

    // Step 2: Update company owner_id
    console.log('Updating company owner_id...');
    try {
      await restUpdate('company', companyId, { 
        owner_id: userId,
        updated_at: new Date().toISOString(),
      });
      console.log('Company owner_id updated successfully');
    } catch (err) {
      console.error('Failed to update company owner_id:', err);
      
      // Rollback: Revert user role to original
      console.log('Rolling back user role...');
      try {
        await restUpdate('user', userId, { role: originalUserRole });
        console.log('Rollback successful');
      } catch (rollbackErr) {
        console.error('Rollback failed:', rollbackErr);
        // Log this critical error - manual intervention may be needed
      }

      return jsonResponse(
        { success: false, error: 'Failed to update company owner. Changes have been rolled back.' },
        500,
      );
    }

    console.log('Ownership claim completed successfully');
    return jsonResponse({ success: true });

  } catch (err) {
    console.error('Unexpected error:', err);
    return jsonResponse(
      { success: false, error: 'Internal server error' },
      500,
    );
  }
});
