"use client";
import { DataTable } from "@/components/ui/DataTable";

export function StaffTab() {
  const data = [
    { id: 1, name: "کارمند 1", role: "Staff", phone: "111111" },
    { id: 2, name: "کارمند 2", role: "Manager", phone: "222222" },
  ];

  const columns: Array<{ key: "name" | "role" | "phone"; label: string }> = [
    { key: "name", label: "نام کارمند" },
    { key: "role", label: "نقش" },
    { key: "phone", label: "شماره تماس" },
  ];

  return <DataTable data={data} columns={columns} title="لیست کارمندان" />;
}
