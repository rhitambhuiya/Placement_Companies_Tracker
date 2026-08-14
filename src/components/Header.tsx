import React from 'react';
import { 
  Building2, 
  Plus, 
  Bell, 
  Download, 
  Upload, 
  Mail, 
  RotateCcw,
  FileSpreadsheet,
  Cloud,
  CloudOff
} from 'lucide-react';
import { PlacementStats } from '../types';
import { isSupabaseConfigured } from '../utils/supabaseClient';

interface HeaderProps {
  stats: PlacementStats;
  onOpenAddCompanyModal: () => void;
  onToggleNotifications: () => void;
  onOpenEmailTemplates: () => void;
  onExportJSON: () => void;
  onExportCSV: () => void;
  onImportJSON: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  onOpenAddCompanyModal,
  onToggleNotifications,
  onOpenEmailTemplates,
  onExportJSON,
  onExportCSV,
  onImportJSON,
  onResetData,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const totalNotifications = stats.overdueRemindersCount + stats.activeRemindersCount;

  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand-icon">
          <Building2 size={24} />
        </div>
        <div>
          <h1 className="brand-title">Placement Pulse</h1>
          <p className="brand-subtitle">College Placement Coordinator & HR Outreach Tracker</p>
        </div>
      </div>

      <div className="controls-bar">
        {/* Cloud Sync Status Indicator */}
        <div 
          className="status-pill"
          style={{ 
            background: isSupabaseConfigured() ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
            color: isSupabaseConfigured() ? '#34d399' : '#fbbf24',
            padding: '0.4rem 0.75rem',
            borderRadius: 'var(--radius-md)'
          }}
          title={isSupabaseConfigured() ? 'Supabase Realtime Cloud Sync Active' : 'Offline / LocalStorage Mode. Add Supabase keys to .env for real-time collaboration.'}
        >
          {isSupabaseConfigured() ? <Cloud size={15} /> : <CloudOff size={15} />}
          <span>{isSupabaseConfigured() ? 'Cloud Sync' : 'Local Mode'}</span>
        </div>
        {/* Email templates helper */}
        <button 
          className="btn btn-secondary btn-sm"
          onClick={onOpenEmailTemplates}
          title="Open Outreach Email Generator"
        >
          <Mail size={16} />
          <span>Mail Generator</span>
        </button>

        {/* CSV Export */}
        <button 
          className="btn btn-secondary btn-sm"
          onClick={onExportCSV}
          title="Export HR & Companies to CSV Excel"
        >
          <FileSpreadsheet size={16} />
          <span>Export CSV</span>
        </button>

        {/* Backup / Restore JSON */}
        <button 
          className="btn btn-secondary btn-sm"
          onClick={onExportJSON}
          title="Backup Data as JSON"
        >
          <Download size={16} />
          <span>Backup JSON</span>
        </button>

        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept=".json"
          onChange={onImportJSON}
        />

        <button 
          className="btn btn-secondary btn-sm"
          onClick={() => fileInputRef.current?.click()}
          title="Import Backup JSON file"
        >
          <Upload size={16} />
          <span>Import</span>
        </button>

        {/* Reset Demo Data */}
        <button 
          className="btn btn-secondary btn-sm"
          onClick={onResetData}
          title="Reset to default sample placement dataset"
        >
          <RotateCcw size={15} />
        </button>

        {/* Notification Bell */}
        <button 
          className="btn btn-secondary btn-icon-only"
          onClick={onToggleNotifications}
          title="Open Follow-up Reminders Center"
        >
          <Bell size={20} />
          {totalNotifications > 0 && (
            <span className="badge-count">
              {stats.overdueRemindersCount > 0 ? `!` : totalNotifications}
            </span>
          )}
        </button>

        {/* Add Company Main Action */}
        <button 
          className="btn btn-primary"
          onClick={onOpenAddCompanyModal}
        >
          <Plus size={18} />
          <span>Add Company</span>
        </button>
      </div>
    </header>
  );
};
