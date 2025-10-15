// Import generated types from Supabase
import type { Database } from '../../types.ts';

// Database table types
export type User = Database['public']['Tables']['user']['Row'];
export type UserInsert = Database['public']['Tables']['user']['Insert'];
export type UserUpdate = Database['public']['Tables']['user']['Update'];

export type Company = Database['public']['Tables']['company']['Row'];
export type CompanyInsert = Database['public']['Tables']['company']['Insert'];
export type CompanyUpdate = Database['public']['Tables']['company']['Update'];

// Enum types
export type UserRole = Database['public']['Enums']['roles'];

// Custom types for edge functions
export interface EmailDomainInfo {
  domain: string;
  companyName: string;
}

export interface AuthUser {
  id: string;
  email: string | null;
}

export interface ApiResponse {
  success: boolean;
  user?: {
    id: string;
    company_id: string | null;
  };
  error?: string;
}
