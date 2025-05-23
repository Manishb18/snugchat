import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { HiFolderDownload } from "react-icons/hi";
import { LuListFilter } from "react-icons/lu";
import { IoClose } from "react-icons/io5";

interface HeaderProps {
  filters: {
    search: string;
    date: string;
  };
  onFilterChange: (filters: { search: string; date: string }) => void;
}

export const ChatsHeader = ({ filters, onFilterChange }: HeaderProps) => {
  const [customFilterOpen, setCustomFilterOpen] = useState(false);
  const [dateInput, setDateInput] = useState(filters.date);
  const [searchInput, setSearchInput] = useState(filters.search);

  const handleSave = () => {
    onFilterChange({ search: searchInput, date: dateInput });
    setCustomFilterOpen(false);
  };

  const handleRemoveFilters = () => {
    onFilterChange({ search: "", date: "" });
    setSearchInput("");
    setDateInput("");
  };

  return (
    <div className=" p-1 py-3">
      <div className="flex items-center justify-between gap-2 flex-wrap relative">
        {/* Left buttons */}
        <div className="flex items-center gap-1">
          <div className="relative">
            <button
              onClick={() => setCustomFilterOpen(!customFilterOpen)}
              className="flex items-center gap-1 text-green-base px-2.5 py-1.5 rounded text-xs font-medium hover:bg-gray-300"
            >
              <HiFolderDownload size={20} className="text-green-base" />
              <span>Custom filter</span>
            </button>
            {customFilterOpen && (
              <div className="absolute z-10 mt-1 bg-white border border-gray-300 rounded shadow p-2">
                <h1 className="inline-block whitespace-nowrap text-sm my-2 font-medium">
                  Filter based on date
                </h1>
                <input
                  type="date"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  className="text-xs border border-gray-300 rounded p-2 px-4"
                />
              </div>
            )}
          </div>

          <button
            onClick={handleSave}
            className="text-gray-600 px-2.5 py-1.5 text-xs font-medium border border-gray-300 rounded cursor-pointer"
          >
            Save
          </button>
        </div>

        {/* Search input */}
        <div className="flex items-center bg-white border border-gray-300 rounded px-2.5 py-1.5 flex-1 max-w-[120px]">
          <FiSearch className="text-gray-500 mr-2" size={14} />
          <input
            type="text"
            placeholder="Search"
            value={searchInput}
            onChange={(e) => {
              const value = e.target.value;
              setSearchInput(value);
              onFilterChange({ search: value, date: dateInput });
            }}
            className="bg-transparent outline-none w-full text-xs"
          />
        </div>

        {/* Filtered indicator */}
        {(filters.date || filters.search) && (
          <div className="flex items-center gap-1.5 text-green-base border border-gray-300 rounded px-2.5 py-1.5 shadow-sm relative">
            <div className="bg-green-base p-0.5 rounded-full absolute -top-2 right-0 flex items-center justify-center">
              <IoClose
                size={10}
                className="text-white"
                onClick={handleRemoveFilters}
              />
            </div>
            <LuListFilter size={14} className="text-green-base" />
            <span className="text-xs font-medium">Filtered</span>
          </div>
        )}
      </div>
    </div>
  );
};
