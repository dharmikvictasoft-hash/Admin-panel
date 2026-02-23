import { useEffect, useRef } from "react";
import Button from "../ui/button/Button";

const orders = [
  {
    product: "TailGrids",
    category: "UI Kits",
    countryCode: "US",
    countryName: "United States",
    cr: "Dashboard",
    value: "12,499",
  },
  {
    product: "GrayGrids",
    category: "Templates",
    countryCode: "FR",
    countryName: "France",
    cr: "Dashboard",
    value: "5,498",
  },
  {
    product: "Uideck",
    category: "Templates",
    countryCode: "SG",
    countryName: "Singapore",
    cr: "Dashboard",
    value: "4,621",
  },
  {
    product: "FormBold",
    category: "SaaS",
    countryCode: "UK",
    countryName: "United Kingdom",
    cr: "Dashboard",
    value: "13,843",
  },
  {
    product: "NextAdmin",
    category: "Templates",
    countryCode: "EG",
    countryName: "Egypt",
    cr: "Dashboard",
    value: "7,523",
  },
  {
    product: "Form Builder",
    category: "Templates",
    countryCode: "FI",
    countryName: "Finland",
    cr: "Dashboard",
    value: "1,377",
  },
  {
    product: "AyroUI",
    category: "Templates",
    countryCode: "BE",
    countryName: "Belgium",
    cr: "Dashboard",
    value: "599.00",
  },
];

function CountryBadge({ code, name }: { code: string; name: string }) {
  useEffect(() => {
  const t = setTimeout(() => {
    window.dispatchEvent(new Event("resize"));
  }, 80);

  return () => clearTimeout(t);
}, []);

  return (
    <div className="flex items-center gap-2 lg:w-full ">
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
        {code}
      </span>
      <span className="text-theme-sm text-gray-500 dark:text-gray-400">
        {name}
      </span>
    </div>
  );
}

function FilterIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4 5.5H16M7 10H13M9 14.5H11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="6" cy="5.5" r="1.5" fill="currentColor" />
      <circle cx="12" cy="10" r="1.5" fill="currentColor" />
      <circle cx="10" cy="14.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

export default function RecentOrders() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-5 py-4 dark:border-gray-800 sm:px-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Activity
          </h3>
          <p className="text-theme-sm text-gray-500 dark:text-gray-400">
            Latest Activity across peoples
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" startIcon={<FilterIcon />}>
            Filter
          </Button>
          <Button variant="outline" size="sm">See all</Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[720px] w-full">
          <thead>
            <tr className="text-left text-theme-xs font-semibold text-gray-500 dark:text-gray-400">
              <th className="px-5 py-3 sm:px-6">Users</th>
              <th className="px-5 py-3 sm:px-6">Category</th>
              <th className="px-5 py-3 sm:px-6">Country</th>
              <th className="px-5 py-3 sm:px-6">CR</th>
              <th className="px-5 py-3 text-right sm:px-6">Total Steps</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.product}
                className="border-t border-gray-100 text-theme-sm text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
              >
                <td className="px-5 py-4 font-semibold text-gray-800 dark:text-white/90 sm:px-6">
                  {order.product}
                </td>
                <td className="px-5 py-4 sm:px-6">{order.category}</td>
                <td className="px-5 py-4 sm:px-6">
                  <CountryBadge
                    code={order.countryCode}
                    name={order.countryName}
                  />
                </td>
                <td className="px-5 py-4 sm:px-6">{order.cr}</td>
                <td className="px-5 py-4 text-right font-semibold text-success-600 dark:text-success-400 sm:px-6">
                  {order.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
