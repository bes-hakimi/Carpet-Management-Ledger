import React from "react";

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

export default function InfoCard({ icon, label, value }: InfoCardProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      {icon}
      <div>
        <div className="text-sm text-gray-600">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
}
