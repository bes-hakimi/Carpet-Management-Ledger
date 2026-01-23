import { Phone, Mail, Clock } from 'lucide-react';

export default function ContactMethods() {
    return (
        <div className="bg-surface rounded-xl shadow p-6 border border-gray-300">
            <h3 className="font-semibold mb-4">تماس مستقیم</h3>

            <div className="space-y-4">
                <a
                    href="tel:09123456789"
                    className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-primary-100 transition-all"
                >
                    <Phone className="w-5 h-5 text-danger" />
                    <div>
                        <p className="font-medium">تماس تلفنی</p>
                        <p className="text-sm text-text-secondary">
                            ۰۹۱۲۳۴۵۶۷۸۹
                        </p>
                    </div>
                </a>

                <a
                    href="mailto:support@gold-system.ir"
                    className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-primary-100 transition-all"
                >
                    <Mail className="w-5 h-5 text-info" />
                    <div>
                        <p className="font-medium">ایمیل</p>
                        <p className="text-sm text-text-secondary">
                            support@gold-system.ir
                        </p>
                    </div>
                </a>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-300 flex items-center gap-2 text-text-secondary">
                <Clock className="w-4 h-4" />
                <span className="text-sm">۹ صبح تا ۵ عصر</span>
            </div>
        </div>
    );
}
