import React from 'react'
import SearchBar, { SearchDropdownConfig } from '../ui/Search/SearchBar'
import PageHeaderWithBreadcrumb from './PageHeaderWithBreadcrumb'

const MEAL_DROPDOWNS: SearchDropdownConfig[] = [
  
  {
    id: "Goal",
    defaultLabel: "Select Goal",
    options: ["All Goals", "Weight Loss", "Muscle Gain", "Maintenance"],
  },
];

type MealProps = {
  onSearchChange?: (value: string) => void;
  onDropdownChange?: (id: string, value: string) => void;
};

function Meal({ onSearchChange, onDropdownChange }: MealProps) {
  return (
    <>
        <div className="ml-[15px]">
            <PageHeaderWithBreadcrumb
              title="Meal"
              crumbs={[
                { label: "Dashboard", to: "/dashboard" },
                { label: "Meal" },
              ]}
            />
            <SearchBar
              dropdowns={MEAL_DROPDOWNS}
              onSearchChange={onSearchChange}
              onDropdownChange={onDropdownChange}
              searchPlaceholder="Search meal plan..."
            />
        </div>
    </>
  )
}

export default Meal
