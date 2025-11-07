"use client";
import { DataTable } from "@/components/ui/DataTable";

export function BranchesTab() {
  const data = [
    { id: 1, name: "شعبه 1", manager: "مدیر 1", phone: "123456789" },
    { id: 2, name: "شعبه 2", manager: "مدیر 2", phone: "987654321" },
  ];

  const columns: Array<{ key: "name" | "manager" | "phone"; label: string }> = [
    { key: "name", label: "نام شعبه" },
    { key: "manager", label: "مدیر" },
    { key: "phone", label: "شماره تماس" },
  ];

  return <DataTable data={data} columns={columns} title="لیست شعبات" />;
}
