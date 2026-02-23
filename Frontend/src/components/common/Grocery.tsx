import React from "react";
import SearchBar, { SearchDropdownConfig } from "../ui/Search/SearchBar";
import PageHeaderWithBreadcrumb from "./PageHeaderWithBreadcrumb";

const GROCERY_DROPDOWNS: SearchDropdownConfig[] = [
  {
    id: "category",
    defaultLabel: "Select Category",
    options: ["All Categories", "Grains", "Vegetables", "Fruits", "Protein", "Dairy"],
  },
  {
    id: "source",
    defaultLabel: "Select Source",
    options: ["All Sources", "Vendor A", "Vendor B", "Local Market"],
  },
  {
    id: "status",
    defaultLabel: "Select Status",
    options: ["All Status", "In Stock", "Low Stock", "Out of Stock"],
  },
];

type GroceryProps = {
  onSearchChange?: (value: string) => void;
  onDropdownChange?: (id: string, value: string) => void;
};

function Grocery({ onSearchChange, onDropdownChange }: GroceryProps) {
  return (
    <div className="ml-[15px]">
      <PageHeaderWithBreadcrumb
        title="Grocery"
        crumbs={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Grocery" },
        ]}
      />
      <SearchBar
        dropdowns={GROCERY_DROPDOWNS}
        onSearchChange={onSearchChange}
        onDropdownChange={onDropdownChange}
        searchPlaceholder="Search grocery..."
      />
    </div>
  );
}

export default Grocery;
