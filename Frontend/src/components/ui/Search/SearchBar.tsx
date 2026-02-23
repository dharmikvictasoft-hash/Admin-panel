import { useEffect, useRef, useState } from "react";
import { IoSearch, IoChevronDown } from "react-icons/io5";

export type SearchDropdownConfig = {
  id: string;
  defaultLabel: string;
  options: string[];
};

type SearchBarProps = {
  dropdowns?: SearchDropdownConfig[];
  onSearchChange?: (value: string) => void;
  onDropdownChange?: (id: string, value: string) => void;
  searchPlaceholder?: string;
};

const DEFAULT_DROPDOWNS: SearchDropdownConfig[] = [
  {
    id: "user",
    defaultLabel: "Select User",
    options: ["All Users", "Active Users", "Inactive Users"],
  },
  {
    id: "goal",
    defaultLabel: "Select Goal",
    options: ["All Users", "Lose", "Gain"],
  },
  {
    id: "status",
    defaultLabel: "Select Plan",
    options: ["All Users", "Free", "Pro"],
  },
];

function SearchBar({
  dropdowns = DEFAULT_DROPDOWNS,
  onSearchChange,
  onDropdownChange,
  searchPlaceholder = "Search...",
}: SearchBarProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const [selectedValues, setSelectedValues] = useState<Record<string, string>>(
    () =>
      Object.fromEntries(
        dropdowns.map((dropdown) => [dropdown.id, dropdown.defaultLabel])
      )
  );

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSelectedValues((previous) => {
      const nextValues: Record<string, string> = {};

      dropdowns.forEach((dropdown) => {
        nextValues[dropdown.id] = previous[dropdown.id] ?? dropdown.defaultLabel;
      });

      return nextValues;
    });

    if (openDropdown && !dropdowns.some((dropdown) => dropdown.id === openDropdown)) {
      setOpenDropdown(null);
    }
  }, [dropdowns, openDropdown]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        e.target instanceof Node &&
        !containerRef.current.contains(e.target)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative z-50 flex items-center gap-4">
      <div className="relative mt-[25px]">
        <IoSearch
          size={20}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder={searchPlaceholder}
          className="h-11 w-[400px] rounded-lg border border-gray-200 bg-transparent py-2.5 pl-10 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10"
          onChange={(event) => onSearchChange?.(event.target.value)}
        />
      </div>

      {dropdowns.map((dropdown) => (
        <Dropdown
          key={dropdown.id}
          label={selectedValues[dropdown.id] ?? dropdown.defaultLabel}
          open={openDropdown === dropdown.id}
          onToggle={() =>
            setOpenDropdown(openDropdown === dropdown.id ? null : dropdown.id)
          }
          options={dropdown.options}
          onSelect={(value) => {
            setSelectedValues((previous) => ({
              ...previous,
              [dropdown.id]: value,
            }));
            onDropdownChange?.(dropdown.id, value);
            setOpenDropdown(null);
          }}
        />
      ))}
    </div>
  );
}

export default SearchBar;

interface DropdownProps {
  label: string;
  open: boolean;
  options: string[];
  onToggle: () => void;
  onSelect: (value: string) => void;
}

function Dropdown({ label, open, options, onToggle, onSelect }: DropdownProps) {
  return (
    <div className="relative mt-[25px] w-64">
      <button
        onClick={onToggle}
        className="flex h-11 w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-700 shadow-theme-xs hover:border-brand-300 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10"
      >
        {label}
        <IoChevronDown
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-[9999] mt-2 w-60 rounded-lg border border-gray-200 bg-white shadow-lg">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => onSelect(option)}
              className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
