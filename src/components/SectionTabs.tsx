import React from 'react';
import { 
  Flame, 
  Layers, 
  Clock, 
  CheckCheck, 
  Search, 
  Grid
} from 'lucide-react';
import { CompanyStatus, FilterOptions } from '../types';

interface SectionTabsProps {
  filterOptions: FilterOptions;
  onFilterChange: (newFilters: Partial<FilterOptions>) => void;
  counts: {
    topPriority: number;
    mediumPriority: number;
    lowCtc: number;
    done: number;
    all: number;
  };
}

export const SectionTabs: React.FC<SectionTabsProps> = ({
  filterOptions,
  onFilterChange,
  counts,
}) => {
  const currentTab = filterOptions.selectedPriority;

  return (
    <div className="section-tabs-container">
      {/* 3 Main Priority Sections + Done / All */}
      <div className="priority-tabs">
        <button
          className={`tab-button top-priority ${currentTab === 'Top Priority' ? 'active' : ''}`}
          onClick={() => onFilterChange({ selectedPriority: 'Top Priority', showOnlyDone: false })}
        >
          <Flame size={16} />
          <span>Top Priority</span>
          <span className="tab-badge">{counts.topPriority}</span>
        </button>

        <button
          className={`tab-button medium-priority ${currentTab === 'Medium Priority' ? 'active' : ''}`}
          onClick={() => onFilterChange({ selectedPriority: 'Medium Priority', showOnlyDone: false })}
        >
          <Layers size={16} />
          <span>Medium Priority</span>
          <span className="tab-badge">{counts.mediumPriority}</span>
        </button>

        <button
          className={`tab-button low-ctc ${currentTab === 'Low CTC / Call Later' ? 'active' : ''}`}
          onClick={() => onFilterChange({ selectedPriority: 'Low CTC / Call Later', showOnlyDone: false })}
        >
          <Clock size={16} />
          <span>Low CTC / Call Later</span>
          <span className="tab-badge">{counts.lowCtc}</span>
        </button>

        <button
          className={`tab-button done-priority ${currentTab === 'Done' ? 'active' : ''}`}
          onClick={() => onFilterChange({ selectedPriority: 'Done', showOnlyDone: true })}
        >
          <CheckCheck size={16} />
          <span>Done With ({counts.done})</span>
        </button>

        <button
          className={`tab-button ${currentTab === 'All' ? 'active' : ''}`}
          onClick={() => onFilterChange({ selectedPriority: 'All', showOnlyDone: false })}
        >
          <Grid size={16} />
          <span>All Companies</span>
          <span className="tab-badge">{counts.all}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="controls-bar">
        {/* Search input */}
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="form-input"
            placeholder="Search company, HR, CTC..."
            value={filterOptions.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
          />
        </div>

        {/* Company Status Filter */}
        <select
          className="form-select"
          value={filterOptions.selectedStatus}
          onChange={(e) => onFilterChange({ selectedStatus: e.target.value as CompanyStatus | 'All' })}
        >
          <option value="All">All Statuses</option>
          <option value="Uncontacted">Uncontacted</option>
          <option value="Initial Outreach">Initial Outreach</option>
          <option value="In Discussion">In Discussion</option>
          <option value="PPT Scheduled">PPT Scheduled</option>
          <option value="Test Scheduled">Test Scheduled</option>
          <option value="Drive Scheduled">Drive Scheduled</option>
          <option value="Completed">Completed</option>
          <option value="Deferred">Deferred</option>
          <option value="Declined">Declined</option>
        </select>

        {/* Sort By */}
        <select
          className="form-select"
          value={filterOptions.sortBy}
          onChange={(e) => onFilterChange({ sortBy: e.target.value as FilterOptions['sortBy'] })}
        >
          <option value="updatedAt">Sort: Recently Updated</option>
          <option value="name">Sort: Company Name</option>
          <option value="priority">Sort: Priority</option>
        </select>
      </div>
    </div>
  );
};
