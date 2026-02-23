import React from "react";
import { Link } from "react-router-dom";

type BreadCrumbItem = {
  label: string;
  to?: string;
};

type PageHeaderWithBreadcrumbProps = {
  title: string;
  crumbs?: BreadCrumbItem[];
};

function PageHeaderWithBreadcrumb({
  title,
  crumbs,
}: PageHeaderWithBreadcrumbProps) {
  const items: BreadCrumbItem[] =
    crumbs ?? [{ label: "Dashboard", to: "/dashboard" }, { label: title }];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h1 className="font-semibold text-[25px]">{title}</h1>
      <nav aria-label={`${title} breadcrumb`}>
        <ol className="flex items-center gap-1.5">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
                {item.to && !isLast ? (
                  <Link
                    className="text-sm text-gray-500 hover:text-gray-700"
                    to={item.to}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className={`text-sm ${isLast ? "text-gray-900" : "text-gray-500"}`}>
                    {item.label}
                  </span>
                )}
                {!isLast ? (
                  <svg
                    className="stroke-current text-gray-400"
                    width="17"
                    height="16"
                    viewBox="0 0 17 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : null}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}

export default PageHeaderWithBreadcrumb;
