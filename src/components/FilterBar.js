import React from 'react';

export const FilterBar = ({ filters, setFilters }) => {
  return (
    <div className="bg-gray-800/90 backdrop-blur-sm p-4 rounded-lg mb-6 space-y-4">
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search alerts..."
            className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white 
              focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <select
          className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white appearance-none cursor-pointer"
          value={filters.sortBy}
          onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
        >
          <option value="latest">Latest First</option>
          <option value="upvotes">Most Upvoted</option>
          <option value="severity">Highest Severity</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        {['All', 'High', 'Medium', 'Low'].map(severity => (
          <button
            key={severity}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
              ${filters.severity === severity.toLowerCase()
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            onClick={() => setFilters({ ...filters, severity: severity.toLowerCase() })}
          >
            {severity}
          </button>
        ))}
      </div>
    </div>
  );
};