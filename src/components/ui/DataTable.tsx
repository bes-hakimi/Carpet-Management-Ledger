"use client";

import { useState } from "react";
import { Search } from "./Search";
import { Select } from "./Select";
import { Pagination } from "./Pagination";
import { ChevronDown, ChevronUp, Search as SearchIcon } from "lucide-react";

// ✅ نوع کلیدهای تو در تو
export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
  ? `${Key}.${NestedKeyOf<ObjectType[Key]>}` | Key
  : Key;
}[keyof ObjectType & (string | number)];

// ✅ تابع کمکی برای گرفتن مقدار تو در تو به صورت type-safe
function getNestedValue<T extends object>(
  obj: T,
  path: NestedKeyOf<T>
): unknown {
  return String(path)
    .split(".")
    .reduce<unknown>((acc, key) => {
      if (typeof acc === "object" && acc !== null && key in acc) {
        return (acc as Record<string, unknown>)[key];
      }
      return undefined;
    }, obj);
}


// ✅ تعریف ستون‌ها
export interface Column<T extends object> {
  key: NestedKeyOf<T>;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
}

// ✅ تعریف اکشن‌ها
interface Action<T> {
  label: string;
  icon: React.ReactNode;
  onClick: (row: T) => void;
}

// ✅ props جدول
interface DataTableProps<T extends object> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  searchable?: boolean;
  actions?: (row: T) => Action<T>[];
  onRowClick?: (row: T) => void;
}

export function DataTable<T extends object>({
  data,
  columns,
  title,
  searchable = true,
  actions,
  onRowClick,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: NestedKeyOf<T>;
    direction: "asc" | "desc";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // 🔍 فیلتر بر اساس جستجو
  const filteredData = data.filter((row) =>
    columns.some((column) => {
      const value = getNestedValue(row, column.key);
      return String(value ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    })
  );

  // ↕️ مرتب‌سازی
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig) return 0;

    const aValue = getNestedValue(a, sortConfig.key);
    const bValue = getNestedValue(b, sortConfig.key);

    const aStr = String(aValue ?? "").toLowerCase();
    const bStr = String(bValue ?? "").toLowerCase();

    if (aStr < bStr) return sortConfig.direction === "asc" ? -1 : 1;
    if (aStr > bStr) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // 📄 صفحه‌بندی
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key: NestedKeyOf<T>) => {
    setSortConfig((current) =>
      current?.key === key
        ? { key, direction: current.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
  };

  const handlePageChange = (page: number) => setCurrentPage(page);

  const itemsPerPageOptions = [
    { value: "5", label: "5 مورد در صفحه" },
    { value: "10", label: "10 مورد در صفحه" },
    { value: "25", label: "25 مورد در صفحه" },
    { value: "50", label: "50 مورد در صفحه" },
  ];

  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {title || "Data Table"}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {filteredData.length} مورد یافت شد
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {searchable && (
              <Search
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="جستجو..."
              />
            )}
            <div className="w-52">
              <Select
                options={itemsPerPageOptions}
                value={itemsPerPage.toString()}
                onChange={(value) => setItemsPerPage(Number(value))}
                placeholder="تعداد در صفحه"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-4 text-right text-sm font-semibold text-gray-900 text-nowrap ${column.sortable ? "cursor-pointer hover:bg-gray-100" : ""
                    }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center justify-start gap-2">
                    {column.label}
                    {column.sortable && (
                      <div className="flex flex-col">
                        <ChevronUp
                          size={14}
                          className={`${sortConfig?.key === column.key &&
                              sortConfig.direction === "asc"
                              ? "text-primary-500"
                              : "text-gray-400"
                            }`}
                        />
                        <ChevronDown
                          size={14}
                          className={`-mt-1 ${sortConfig?.key === column.key &&
                              sortConfig.direction === "desc"
                              ? "text-primary-500"
                              : "text-gray-400"
                            }`}
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
              {actions && (
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                  عملیات
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {paginatedData.map((row, index) => (
              <tr
                key={index}
                className={`hover:bg-gray-50 transition-colors ${onRowClick ? "cursor-pointer" : ""
                  }`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => {
                  const value = getNestedValue(row, column.key);
                  return (
                    <td
                      key={column.key}
                      className="px-6 py-4 text-sm text-gray-900 text-nowrap"
                    >
                      {column.render
                        ? column.render(value, row)
                        : String(value ?? "")}
                    </td>
                  );
                })}

                {actions && (
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {actions(row).map((action, i) => (
                        <button
                          key={i}
                          onClick={(e) => {
                            e.stopPropagation();
                            action.onClick(row);
                          }}
                          className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title={action.label}
                        >
                          {action.icon}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {paginatedData.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <SearchIcon size={48} className="mx-auto" />
            </div>
            <p className="text-gray-500 text-lg">موردی یافت نشد</p>
            <p className="text-gray-400 text-sm mt-1">
              {searchTerm
                ? "سعی کنید عبارت جستجو را تغییر دهید"
                : "هیچ دیتایی موجود نیست"}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-600">
              نمایش {(currentPage - 1) * itemsPerPage + 1} تا{" "}
              {Math.min(currentPage * itemsPerPage, filteredData.length)} از{" "}
              {filteredData.length} مورد
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}
