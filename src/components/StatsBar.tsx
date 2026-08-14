import React from 'react';
import { Building2, Users, Bell, CheckCircle2, Flame, CalendarClock } from 'lucide-react';
import { PlacementStats } from '../types';

interface StatsBarProps {
  stats: PlacementStats;
}

export const StatsBar: React.FC<StatsBarProps> = ({ stats }) => {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
          <Building2 size={22} />
        </div>
        <div className="stat-info">
          <div className="stat-value">{stats.totalCompanies}</div>
          <div className="stat-label">Total Companies</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon" style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e' }}>
          <Flame size={22} />
        </div>
        <div className="stat-info">
          <div className="stat-value">{stats.topPriorityCount}</div>
          <div className="stat-label">Top Priority Pipeline</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>
          <Users size={22} />
        </div>
        <div className="stat-info">
          <div className="stat-value">{stats.totalHrs}</div>
          <div className="stat-label">HR Contacts</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon" style={{ background: stats.overdueRemindersCount > 0 ? 'rgba(244, 63, 94, 0.2)' : 'rgba(245, 158, 11, 0.15)', color: stats.overdueRemindersCount > 0 ? '#f43f5e' : '#fbbf24' }}>
          {stats.overdueRemindersCount > 0 ? <Bell size={22} /> : <CalendarClock size={22} />}
        </div>
        <div className="stat-info">
          <div className="stat-value" style={{ color: stats.overdueRemindersCount > 0 ? '#f43f5e' : 'inherit' }}>
            {stats.activeRemindersCount} {stats.overdueRemindersCount > 0 && <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>(! {stats.overdueRemindersCount} Overdue)</span>}
          </div>
          <div className="stat-label">Follow-ups Due</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
          <CheckCircle2 size={22} />
        </div>
        <div className="stat-info">
          <div className="stat-value">{stats.completedCompaniesCount}</div>
          <div className="stat-label">Drives Completed / Done</div>
        </div>
      </div>
    </div>
  );
};
