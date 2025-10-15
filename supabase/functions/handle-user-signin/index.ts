// Supabase Edge Function: handle-user-signin
// Handles user sign-in with automatic company and user creation
// Tables: company (id, name, domain, owner_id), user (id, auth_id, email, role, company_id)

/// <reference path="./deno.d.ts" />

import { corsHeaders } from '../_shared/cors.ts';
import type {
  ApiResponse,
  AuthUser,
  Company,
  EmailDomainInfo,
  User,
  UserRole,
} from '../_shared/types.ts';

// Environment variables
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing required environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
}

// Utility functions
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function retry<T>(
  fn: () => Promise<T>,
  attempts = 3,
  baseDelay = 200,
): Promise<T> {
  let lastError: Error | unknown;
  
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      console.warn(`Attempt ${attempt + 1}/${attempts} failed:`, err);
      
      if (attempt < attempts - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        await sleep(delay);
      }
    }
  }
  
  throw lastError;
}

/**
 * Parse email domain and extract company name
 * @param email - User's email address
 * @returns Domain and company name
 */
function parseEmailDomain(email: string): EmailDomainInfo {
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    throw new Error('Invalid email format');
  }

  const [, domainRaw] = email.split('@');
  const domain = domainRaw.toLowerCase().replace(/^www\./, '');
  const parts = domain.split('.');

  const isShort = (str: string): boolean => str.length <= 3;
  let companyName: string;

  // Handle domains with country TLDs (e.g., example.co.uk)
  if (
    parts.length >= 3 &&
    isShort(parts[parts.length - 1] ?? '') &&
    isShort(parts[parts.length - 2] ?? '')
  ) {
    companyName = parts[parts.length - 3] ?? '';
  } else {
    companyName = parts[parts.length - 2] ?? '';
  }

  // Capitalize first letter
  companyName = companyName.charAt(0).toUpperCase() + companyName.slice(1);

  return {
    domain,
    companyName,
  };
}

/**
 * Verify user authentication token
 * @param authToken - Bearer token from Authorization header
 * @returns Authenticated user info
 */
async function getAuthUser(authToken: string): Promise<AuthUser> {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    method: 'GET',
    headers: {
      Authorization: authToken,
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
 * Select records from database via REST API
 * @param table - Table name
 * @param query - Query string (including '?')
 * @returns Query results
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
 * Insert record into database via REST API
 * @param table - Table name
 * @param payload - Data to insert
 * @param returning - Fields to return (default: '*')
 * @returns Inserted record(s)
 */
async function restInsert<T = unknown>(
  table: string,
  payload: Record<string, unknown>,
  returning = '*',
): Promise<T> {
  const url = `${SUPABASE_URL}/rest/v1/${table}?select=${encodeURIComponent(returning)}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      apiKey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  
  if (!response.ok) {
    throw new Error(`REST insert failed (${response.status}): ${text}`);
  }

  return JSON.parse(text);
}

/**
 * Update record in database via REST API
 * @param table - Table name
 * @param id - Record ID
 * @param payload - Data to update
 * @returns Updated record
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
 * Create JSON response with CORS headers
 */
function jsonResponse(data: ApiResponse, status = 200): Response {
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

    // Verify authentication and get user
    let authUser: AuthUser;
    try {
      authUser = await getAuthUser(authHeader);
    } catch (err) {
      console.error('Auth verification failed:', err);
      return jsonResponse(
        { success: false, error: 'Invalid or expired authentication token' },
        401,
      );
    }

    const authId = authUser.id;
    const email = authUser.email;

    console.log('Processing user sign-in for:', email);

    // Check if email exists
    if (!email) {
      return jsonResponse(
        { success: false, error: 'Email not found in authentication token' },
        400,
      );
    }

    // 1) Check if user already exists
    const existingUsers = await restSelect<Partial<User>[]>(
      'user',
      `?auth_id=eq.${encodeURIComponent(authId)}&select=id,company_id&limit=1`,
    );

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      const user = existingUsers[0];
      console.log('User already exists:', user.id);
      return jsonResponse({
        success: true,
        user: {
          id: user.id!,
          company_id: user.company_id ?? null,
        },
      });
    }

    // User not found, create new user
    console.log('User not found, creating new user...');

    const { domain, companyName } = parseEmailDomain(email);
    console.log('Parsed email domain:', { domain, companyName });

    // 2) Check if company exists by domain
    const existingCompanies = await restSelect<Partial<Company>[]>(
      'company',
      `?domain=eq.${encodeURIComponent(domain)}&select=id,owner_id&limit=1`,
    );

    let company: Partial<Company> | null = null;
    let userRole: UserRole;
    let userRow: Partial<User> | null = null;

    if (Array.isArray(existingCompanies) && existingCompanies.length > 0) {
      // Company exists, user should be a member
      company = existingCompanies[0];
      userRole = 'member';
      console.log('Company exists, creating user as member');

      // 3) Create user with retry
      const createUser = async (): Promise<Partial<User>> => {
        const payload = {
          auth_id: authId,
          email: email,
          name: email.split('@')[0], // Use email prefix as default name
          company_id: company!.id,
          role: userRole,
        };
        const inserted = await restInsert<Partial<User>[]>('user', payload, 'id,company_id');
        if (!Array.isArray(inserted) || inserted.length === 0) {
          throw new Error('User insert returned empty array');
        }
        return inserted[0];
      };

      try {
        userRow = await retry(createUser, 3, 200);
        console.log('User created successfully:', userRow.id);
      } catch (err) {
        console.error('User creation failed:', err);
        return jsonResponse(
          { success: false, error: 'Failed to create user' },
          500,
        );
      }
    } else {
      // Company doesn't exist, need to create both user and company
      // Create user first (without company_id), then create company, then update user
      console.log('Company does not exist, creating user first...');
      userRole = 'owner';

      // Step 1: Create user WITHOUT company_id
      const createUserWithoutCompany = async (): Promise<Partial<User>> => {
        const payload = {
          auth_id: authId,
          email: email,
          name: email.split('@')[0],
          company_id: null, // Will update this after creating company
          role: userRole,
        };
        const inserted = await restInsert<Partial<User>[]>('user', payload, 'id');
        if (!Array.isArray(inserted) || inserted.length === 0) {
          throw new Error('User insert returned empty array');
        }
        return inserted[0];
      };

      try {
        userRow = await retry(createUserWithoutCompany, 3, 200);
        console.log('User created successfully (without company):', userRow.id);
      } catch (err) {
        console.error('User creation failed:', err);
        return jsonResponse(
          { success: false, error: 'Failed to create user' },
          500,
        );
      }

      // Step 2: Create company with user's id as owner_id
      console.log('Creating company...');

      const createCompany = async (): Promise<Partial<Company>> => {
        const payload = {
          name: companyName,
          domain: domain,
          owner_id: userRow!.id, // Use the user's ID, not auth_id
        };
        const inserted = await restInsert<Partial<Company>[]>(
          'company',
          payload,
          'id,name,domain,owner_id',
        );
        if (!Array.isArray(inserted) || inserted.length === 0) {
          throw new Error('Company insert returned empty array');
        }
        return inserted[0];
      };

      try {
        company = await retry(createCompany, 3, 200);
        console.log('Company created successfully:', company.id);
      } catch (err) {
        console.error('Company creation failed:', err);
        return jsonResponse(
          { success: false, error: 'Failed to create company' },
          500,
        );
      }

      // Step 3: Update user with company_id
      console.log('Updating user with company_id...');

      try {
        await restUpdate('user', userRow.id!, { company_id: company.id });
        console.log('User updated with company_id');
        userRow.company_id = company.id!;
      } catch (err) {
        console.error('Failed to update user with company_id:', err);
        return jsonResponse(
          { success: false, error: 'Failed to update user with company' },
          500,
        );
      }
    }

    return jsonResponse({
      success: true,
      user: {
        id: userRow.id!,
        company_id: userRow.company_id ?? null,
      },
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    return jsonResponse(
      { success: false, error: 'Internal server error' },
      500,
    );
  }
});
