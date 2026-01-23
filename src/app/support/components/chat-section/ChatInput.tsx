import { Lock } from 'lucide-react';
import { Input } from '@/components/ui/Input';

export default function ChatInput({ disabled }: { disabled?: boolean }) {
    return (
        <div className="p-4 border-t border-red-100">
            <div className="relative">
                <Input
                    disabled
                    placeholder="چت آنلاین به‌زودی فعال می‌شود..."
                    className="bg-red-100 cursor-not-allowed pr-10 ring-red-300"
                />
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-red-400" />
            </div>
        </div>
    );
}
