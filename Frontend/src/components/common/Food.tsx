import React from "react";
import SearchBar, { SearchDropdownConfig } from "../ui/Search/SearchBar";
import PageHeaderWithBreadcrumb from "./PageHeaderWithBreadcrumb";

const FOOD_DROPDOWNS: SearchDropdownConfig[] = [
  {
    id: "type",
    defaultLabel: "Select Type",
    options: ["All Foods", "Breakfast", "Lunch", "Dinner"],
  },
  {
    id: "source",
    defaultLabel: "Select Source",
    options: ["All Sources", "AI", "USDA", "WHO"],
  },
  {
    id: "status",
    defaultLabel: "Select Status",
    options: ["All Status", "Verified", "Pending"],
  },
];

type FoodProps = {
  onSearchChange?: (value: string) => void;
  onDropdownChange?: (id: string, value: string) => void;
};

function Food({ onSearchChange, onDropdownChange }: FoodProps) {
  return (
    <>
      <div className="ml-[15px]">
        <PageHeaderWithBreadcrumb
          title="Food DB"
          crumbs={[
            { label: "Dashboard", to: "/dashboard" },
            { label: "Food DB" },
          ]}
        />
        <SearchBar
          dropdowns={FOOD_DROPDOWNS}
          onSearchChange={onSearchChange}
          onDropdownChange={onDropdownChange}
          searchPlaceholder="Search food..."
        />
      </div>
    </>
  );
}

export default Food;
