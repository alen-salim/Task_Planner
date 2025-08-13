import React from "react";
import { Filter, Search } from "lucide-react";
import { useTaskPlanner } from "../../hooks/useTaskPlanner";
import { TaskCategory } from "../../types";

const FilterPanel: React.FC = () => {
  const { state, dispatch } = useTaskPlanner();
  const { filters } = state;

  const categories: TaskCategory[] = [
    "To Do",
    "In Progress",
    "Review",
    "Completed",
  ];
  const timeRanges = [
    { value: "1", label: "Tasks within 1 week" },
    { value: "2", label: "Tasks within 2 weeks" },
    { value: "3", label: "Tasks within 3 weeks" },
  ];

  const handleCategoryFilter = (category: TaskCategory) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];

    dispatch({ type: "SET_FILTERS", payload: { categories: newCategories } });
  };

  const handleTimeRangeFilter = (range: string) => {
    const newRange = filters.timeRange === range ? null : range;
    dispatch({ type: "SET_FILTERS", payload: { timeRange: newRange } });
  };

  const handleSearchChange = (query: string) => {
    dispatch({ type: "SET_FILTERS", payload: { searchQuery: query } });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex items-center mb-4">
        <Filter size={20} className="mr-2 text-gray-600" />
        <h3 className="text-lg font-semibold">Filters</h3>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search tasks by name..."
            value={filters.searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="mb-4">
        <h4 className="font-medium mb-2">Categories</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={() => handleCategoryFilter(category)}
                className="mr-2"
              />
              <span className="text-sm">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Time Range Filters */}
      <div>
        <h4 className="font-medium mb-2">Time Range</h4>
        <div className="space-y-2">
          {timeRanges.map((range) => (
            <label key={range.value} className="flex items-center">
              <input
                type="radio"
                name="timeRange"
                checked={filters.timeRange === range.value}
                onChange={() => handleTimeRangeFilter(range.value)}
                className="mr-2"
              />
              <span className="text-sm">{range.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
