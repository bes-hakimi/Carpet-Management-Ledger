// src/types/support.ts

export interface SupportUser {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    company_name: string | null;
    company_logo?: string | null;
    branch_name: string | null;
    category: string | null;
    phone: string | null;
    role: string;
    status: boolean;
    date_joined: string;
}

export interface SupportMessage {
    id: number;
    subject: string;
    message: string;
    created_at: string;
    user: SupportUser;
}

export interface SupportListResponse {
    success: boolean;
    count: number;
    data: SupportMessage[];
}
