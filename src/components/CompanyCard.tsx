import React from 'react';
import { 
  ExternalLink, 
  UserPlus, 
  Bell, 
  Mail, 
  Phone, 
  Globe, 
  Edit3, 
  Trash2, 
  Check, 
  Briefcase, 
  DollarSign, 
  MapPin,
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Company, HRContact, CompanyStatus, HRStatus, PrioritySection } from '../types';
import { playCompletionChime } from '../utils/audioAndNotifications';

interface CompanyCardProps {
  company: Company;
  onToggleDone: (companyId: string, currentDone: boolean) => void;
  onUpdateCompanyStatus: (companyId: string, status: CompanyStatus) => void;
  onUpdateCompanyPriority: (companyId: string, priority: PrioritySection) => void;
  onEditCompany: (company: Company) => void;
  onDeleteCompany: (companyId: string) => void;
  onAddHR: (companyId: string) => void;
  onEditHR: (companyId: string, hr: HRContact) => void;
  onDeleteHR: (companyId: string, hrId: string) => void;
  onUpdateHRStatus: (companyId: string, hrId: string, status: HRStatus) => void;
  onScheduleReminder: (company: Company, hr?: HRContact) => void;
  onQuickEmail: (company: Company, hr: HRContact) => void;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({
  company,
  onToggleDone,
  onUpdateCompanyStatus,
  onUpdateCompanyPriority,
  onEditCompany,
  onDeleteCompany,
  onAddHR,
  onEditHR,
  onDeleteHR,
  onUpdateHRStatus,
  onScheduleReminder,
  onQuickEmail,
}) => {
  const [isHrExpanded, setIsHrExpanded] = React.useState(true);

  const handleDoneCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      playCompletionChime();
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (err) {
        // ignore fallback
      }
    }
    onToggleDone(company.id, company.isDone);
  };

  const getPriorityBadgeClass = (priority: PrioritySection) => {
    switch (priority) {
      case 'Top Priority': return 'top-priority';
      case 'Medium Priority': return 'medium-priority';
      case 'Low CTC / Call Later': return 'low-ctc';
      case 'Extra': return 'extra-priority';
      default: return '';
    }
  };

  const getCompanyStatusClass = (status: CompanyStatus) => {
    switch (status) {
      case 'Uncontacted': return 'status-uncontacted';
      case 'Initial Outreach': return 'status-outreach';
      case 'In Discussion': return 'status-discussion';
      case 'PPT Scheduled': 
      case 'Test Scheduled': 
      default: return 'status-uncontacted';
    }
  };

  return (
    <div className={`company-card ${company.isDone ? 'is-done-card' : ''}`}>
      {/* Header section with Checkbox & Actions */}
      <div className="card-top-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Priority Badge */}
          <span className={`priority-tag ${company.isDone ? 'done-tag' : getPriorityBadgeClass(company.priorityCategory)}`}>
            {company.isDone ? <Sparkles size={12} /> : null}
            {company.priorityCategory}
          </span>

          {/* Website Link */}
          {company.website && (
            <a 
              href={company.website} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hr-link-btn"
              title="Visit official portal"
            >
              <ExternalLink size={12} />
              <span>Website</span>
            </a>
          )}
        </div>

        {/* "Done with" Checkbox */}
        <label className="checkbox-done-wrapper" title="Mark company drive as done/completed">
          <input 
            type="checkbox" 
            checked={company.isDone} 
            onChange={handleDoneCheckboxChange} 
          />
          <span className="checkbox-custom">
            {company.isDone && <Check size={14} />}
          </span>
          <span className="checkbox-label" style={{ color: company.isDone ? '#10b981' : 'inherit' }}>
            {company.isDone ? 'Done ✓' : 'Done With'}
          </span>
        </label>
      </div>

      {/* Title & Industry */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
        <div>
          <h2 className="company-title">{company.name}</h2>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Briefcase size={13} />
            <span>{company.industry || 'Corporate'}</span>
          </div>
        </div>

        {/* Edit / Delete Buttons */}
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <button 
            className="btn btn-secondary btn-xs"
            onClick={() => onEditCompany(company)}
            title="Edit Company Details"
          >
            <Edit3 size={13} />
          </button>
          <button 
            className="btn btn-danger-outline btn-xs"
            onClick={() => onDeleteCompany(company.id)}
            title="Delete Company"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Meta Row: Status Selector & CTC */}
      <div className="company-meta-row">
        {/* Company Status Selector */}
        <div>
          <select
            className={`form-select ${getCompanyStatusClass(company.status)}`}
            style={{ fontSize: '0.775rem', padding: '0.25rem 0.6rem', height: '30px' }}
            value={company.status}
            onChange={(e) => onUpdateCompanyStatus(company.id, e.target.value as CompanyStatus)}
          >
            <option value="Uncontacted">Status: Uncontacted</option>
            <option value="Initial Outreach">Status: Initial Outreach</option>
            <option value="In Discussion">Status: In Discussion</option>
            <option value="PPT Scheduled">Status: PPT Scheduled</option>
            <option value="Test Scheduled">Status: Test Scheduled</option>
            <option value="Drive Scheduled">Status: Drive Scheduled</option>
            <option value="Completed">Status: Completed</option>
            <option value="Deferred">Status: Deferred</option>
            <option value="Declined">Status: Declined</option>
          </select>
        </div>

        {/* Priority category change dropdown */}
        <div>
          <select
            className="form-select"
            style={{ fontSize: '0.775rem', padding: '0.25rem 0.6rem', height: '30px', background: 'rgba(255,255,255,0.05)' }}
            value={company.priorityCategory}
            onChange={(e) => onUpdateCompanyPriority(company.id, e.target.value as PrioritySection)}
          >
            <option value="Top Priority">Category: Top Priority</option>
            <option value="Medium Priority">Category: Medium Priority</option>
            <option value="Low CTC / Call Later">Category: Low CTC / Call Later</option>
            <option value="Extra">Category: Extra</option>
          </select>
        </div>

        {/* CTC badge */}
        {company.ctcPackage && (
          <div className="ctc-badge">
            <DollarSign size={13} />
            <span>{company.ctcPackage}</span>
          </div>
        )}

        {/* Location */}
        {company.location && (
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <MapPin size={12} />
            <span>{company.location}</span>
          </div>
        )}
      </div>

      {/* Company Notes */}
      {company.notes && (
        <div className="company-notes-box">
          {company.notes}
        </div>
      )}

      {/* Multiple HR Contacts Section */}
      <div className="hr-section">
        <div className="hr-section-header">
          <div 
            className="hr-section-title" 
            style={{ cursor: 'pointer' }}
            onClick={() => setIsHrExpanded(!isHrExpanded)}
          >
            <span>HR Contacts ({company.hrs ? company.hrs.length : 0})</span>
            {isHrExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {/* Set Follow-up Reminder */}
            <button 
              className="btn btn-secondary btn-xs"
              onClick={() => onScheduleReminder(company)}
              title="Set a follow-up reminder notification"
            >
              <Bell size={13} />
              <span>Reminder</span>
            </button>

            {/* Add HR Button */}
            <button 
              className="btn btn-primary btn-xs"
              onClick={() => onAddHR(company.id)}
            >
              <UserPlus size={13} />
              <span>Add HR</span>
            </button>
          </div>
        </div>

        {/* HR Contacts List */}
        {isHrExpanded && (
          <div>
            {!company.hrs || company.hrs.length === 0 ? (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '0.5rem 0' }}>
                No HR contacts added yet. Click "+ Add HR" to attach recruiter contacts.
              </div>
            ) : (
              company.hrs.map(hr => (
                <div key={hr.id} className="hr-contact-card">
                  <div className="hr-header-line">
                    <div>
                      <div className="hr-name">{hr.name}</div>
                      <div className="hr-designation">{hr.designation || 'HR Manager / Recruiter'}</div>
                    </div>

                    {/* HR Status Dropdown */}
                    <div>
                      <select
                        className="form-select"
                        style={{ fontSize: '0.725rem', padding: '0.15rem 0.4rem', height: '26px' }}
                        value={hr.status}
                        onChange={(e) => onUpdateHRStatus(company.id, hr.id, e.target.value as HRStatus)}
                      >
                        <option value="Not Contacted">Not Contacted</option>
                        <option value="Email Sent">Email Sent</option>
                        <option value="Call Scheduled">Call Scheduled</option>
                        <option value="Followed Up">Followed Up</option>
                        <option value="In Discussion">In Discussion</option>
                        <option value="Slot Offered">Slot Offered</option>
                        <option value="Declined">Declined</option>
                      </select>
                    </div>
                  </div>

                  {/* HR Notes if available */}
                  {hr.notes && (
                    <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginTop: '0.35rem', fontStyle: 'italic' }}>
                      "{hr.notes}"
                    </div>
                  )}

                  {/* HR Actions & Contact links */}
                  <div className="hr-actions-row">
                    {hr.email && (
                      <a href={`mailto:${hr.email}`} className="hr-link-btn" title={`Email ${hr.email}`}>
                        <Mail size={12} />
                        <span>{hr.email}</span>
                      </a>
                    )}

                    {hr.phone && (
                      <a href={`tel:${hr.phone}`} className="hr-link-btn" title={`Call ${hr.phone}`}>
                        <Phone size={12} />
                        <span>{hr.phone}</span>
                      </a>
                    )}

                    {hr.linkedin && (
                      <a href={hr.linkedin} target="_blank" rel="noopener noreferrer" className="hr-link-btn" title="LinkedIn Profile">
                        <Globe size={12} />
                      </a>
                    )}

                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.3rem' }}>
                      {/* Quick Mail Generator */}
                      {hr.email && (
                        <button 
                          className="btn btn-secondary btn-xs"
                          onClick={() => onQuickEmail(company, hr)}
                          title="Generate Placement Email Template"
                        >
                          <Mail size={11} />
                          <span>Draft</span>
                        </button>
                      )}

                      {/* Reminder for specific HR */}
                      <button 
                        className="btn btn-secondary btn-xs"
                        onClick={() => onScheduleReminder(company, hr)}
                        title="Set HR Reminder"
                      >
                        <Clock size={11} />
                      </button>

                      {/* Edit HR */}
                      <button 
                        className="btn btn-secondary btn-xs"
                        onClick={() => onEditHR(company.id, hr)}
                        title="Edit HR details"
                      >
                        <Edit3 size={11} />
                      </button>

                      {/* Delete HR */}
                      <button 
                        className="btn btn-danger-outline btn-xs"
                        onClick={() => onDeleteHR(company.id, hr.id)}
                        title="Remove HR"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
