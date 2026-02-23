import React from 'react'
import SearchBar from '../ui/Search/SearchBar'
import PageHeaderWithBreadcrumb from './PageHeaderWithBreadcrumb'

type UserTableProps = {
  onSearchChange?: (value: string) => void;
  onDropdownChange?: (id: string, value: string) => void;
};

function UserTable({ onSearchChange, onDropdownChange }: UserTableProps) {
  return (
    <>
    <div className='ml-[15px]'>
        <PageHeaderWithBreadcrumb
          title="Users"
          crumbs={[
            { label: "Dashboard", to: "/dashboard" },
            { label: "Users" },
          ]}
        />
        <SearchBar
          onSearchChange={onSearchChange}
          onDropdownChange={onDropdownChange}
          searchPlaceholder="Search user..."
        />
    </div>
    </>
  )
}

export default UserTable
