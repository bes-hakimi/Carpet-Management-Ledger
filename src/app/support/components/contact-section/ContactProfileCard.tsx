import { User } from 'lucide-react';
import { IUser } from "@/types/user/user";

interface Props {
    data?: {
        details: IUser;
    };
    userRole: string | null;
}

export default function ContactProfileCard({ data, userRole }: Props) {
    const name =
        data
            ? userRole === 'branch'
                ? data.details.branch_name
                : data.details.company_name
            : null;

    return (
        <div className="bg-surface rounded-xl shadow p-4 md:p-6 border border-gray-300">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    {data?.details.company_logo ? (
                        <img
                            src={data.details.company_logo}
                            alt="Avatar"
                            className="min-w-11 max-w-11 h-11 rounded-full object-cover"
                        />
                    ) : (
                        <User className="w-6 h-6 text-primary-600" />
                    )}
                </div>

                <div>
                    <h3 className="text-sm md:text-base font-semibold truncate">
                        {name ?? 'نام شرکت یا شعبه'}
                    </h3>
                    <p className="text-sm text-text-secondary">
                        {data?.details.email}
                    </p>
                </div>
            </div>

            {/* Online Status */}
            <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
                </span>

                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                    آنلاین
                </span>
            </div>
        </div>
    );
}
