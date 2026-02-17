'use client';

import { useState } from 'react';
import { IUser } from "@/types/user/user";
import { useApiGet } from "@/hooks/useApi";
import { USERS } from "@/endpoints/users";
import { useAuth } from "@/hooks/useAuth";

import ContactProfileCard from './ContactProfileCard';
import ContactMethods from './ContactMethods';
import NewProblemForm from './NewProblemForm';

interface IUserResponse {
    details: IUser;
    branches: IUser[];
    staffs: IUser[];
}

export default function ContactSection() {
    const { userData } = useAuth();
    const userId = userData?.user?.id ?? null;
    const userRole = userData?.user?.role ?? null;

    const { data } = useApiGet<IUserResponse>(
        `user-profile-${userId}`,
        userId ? USERS.details(userId) : '',
        { enabled: !!userId }
    );

    

    return (
        <div className="space-y-4 md:space-y-6">
            <ContactProfileCard
                data={data}
                userRole={userRole}
            />

            <ContactMethods />

            <NewProblemForm />
        </div>
    );
}
