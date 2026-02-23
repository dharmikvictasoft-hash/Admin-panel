import { ReactNode } from "react";

export type TableColumn<T> = {
  id: string;
  header: string;
  render: (row: T, index: number) => ReactNode;
  className?: string;
  headerClassName?: string;
};

type TableProps<T> = {
  columns: TableColumn<T>[];
  data: T[];
  rowKey: (row: T, index: number) => string;
  onRowClick?: (row: T, index: number) => void;
  emptyMessage?: string;
  containerClassName?: string;
  tableClassName?: string;
};

function Table<T>({
  columns,
  data,
  rowKey,
  onRowClick,
  emptyMessage = "No records found",
  containerClassName = "",
  tableClassName = "min-w-[720px] w-full",
}: TableProps<T>) {
  return (
    <div
      className={`relative z-0 mt-[20px] rounded-2xl border-2 border-gray-200 bg-white hover:shadow-xl ${containerClassName}`}
    >
      <div className="overflow-x-auto overflow-y-visible">
        <table className={tableClassName}>
          <thead>
            <tr className="text-left text-md text-gray-900 dark:text-gray-400">
              {columns.map((column) => (
                <th
                  key={column.id}
                  className={`px-5 py-3 sm:px-6 ${column.headerClassName ?? ""}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr className="border-t border-gray-100 text-theme-sm text-gray-600">
                <td
                  className="px-5 py-6 text-center sm:px-6"
                  colSpan={columns.length}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={rowKey(row, index)}
                  className={`border-t border-gray-100 text-theme-sm text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                  onClick={() => onRowClick?.(row, index)}
                  onKeyDown={(event) => {
                    if (!onRowClick) return;
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onRowClick(row, index);
                    }
                  }}
                  role={onRowClick ? "button" : undefined}
                  tabIndex={onRowClick ? 0 : undefined}
                >
                  {columns.map((column) => (
                    <td
                      key={column.id}
                      className={`px-5 py-4 sm:px-6 ${column.className ?? ""}`}
                    >
                      {column.render(row, index)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
