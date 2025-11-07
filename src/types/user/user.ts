export interface IUser {
  id?: number; 
  email: string;
  first_name: string;
  last_name: string;
  password?: string; 
  role: "superadmin" | "admin" | "seller" | "staff" | string; 
  phone?: number | string;
  category?: string; 
  
  // Company info
  company_name?: string;
  branch_name?: string | null;
  company_logo?: string;
  contract?: string;
  time_of_active?: string; 

  // Account status
  status?: boolean;
  reson_of_status?: string | null;
  is_active?: boolean;
  is_staff?: boolean;

  // Description & address
  address?: string;
  description?: string;
  warranty?: string;

  // Metadata
  date_joined?: string; 
  updated_at?: string;
  created_by?: {
    id: number;
    email: string;
    role: string;
  } | null;
}
