"use client";

import { Textarea } from "@/components/ui/Textarea";
import { FormField } from "@/types/sales/sales";

interface SaleNotesProps {
  notes: string;
  onChange: (field: FormField, value: string) => void;
}

export function SaleNotes({ notes, onChange }: SaleNotesProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
      <h3 className="font-semibold text-gray-900 mb-4">توضیحات</h3>
      <Textarea
        value={notes}
        onChange={(value) => onChange("notes", value)}
        placeholder="توضیحات اضافی..."
        rows={3}
      />
    </div>
  );
}
