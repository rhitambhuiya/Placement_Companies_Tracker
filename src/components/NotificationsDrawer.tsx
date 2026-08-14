import React from 'react';
import { 
  X, 
  Bell, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Trash2, 
  Building2, 
  User,
  CalendarCheck
} from 'lucide-react';
import { Reminder } from '../types';
import { formatDateTime, getDueDateBadgeStatus } from '../utils/audioAndNotifications';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  reminders: Reminder[];
  onToggleCompleteReminder: (reminderId: string) => void;
  onDeleteReminder: (reminderId: string) => void;
  onSnoozeReminder: (reminderId: string) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  reminders,
  onToggleCompleteReminder,
  onDeleteReminder,
  onSnoozeReminder,
}) => {
  if (!isOpen) return null;

  const activeReminders = reminders.filter(r => !r.isCompleted);
  const completedReminders = reminders.filter(r => r.isCompleted);

  // Sort active reminders so overdue items come first
  const sortedActive = [...activeReminders].sort((a, b) => {
    return new Date(a.dueDateTime).getTime() - new Date(b.dueDateTime).getTime();
  });

  return (
    <div className="notifications-panel">
      <div className="notifications-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Bell size={20} className="text-indigo-400" />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Follow-Up Notifications</h2>
        </div>

        <button className="btn btn-secondary btn-icon-only" onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <div className="notifications-body">
        {activeReminders.length === 0 && completedReminders.length === 0 ? (
          <div className="empty-state" style={{ padding: '2rem 1rem' }}>
            <div className="empty-icon">
              <CalendarCheck size={32} />
            </div>
            <div className="empty-title">All Caught Up!</div>
            <div className="empty-desc">
              You have no active follow-up reminders right now. Set reminders on any company card to never miss an HR follow-up.
            </div>
          </div>
        ) : (
          <div>
            {/* Active / Overdue / Due Today Section */}
            {sortedActive.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  Pending Follow-Ups ({sortedActive.length})
                </div>

                {sortedActive.map(rem => {
                  const status = getDueDateBadgeStatus(rem.dueDateTime, rem.isCompleted);
                  const isOverdue = status.label === 'Overdue';
                  const isToday = status.label === 'Due Today';

                  return (
                    <div 
                      key={rem.id} 
                      className={`reminder-card ${isOverdue ? 'overdue' : ''} ${isToday ? 'today' : ''}`}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                        <span className={`status-pill ${status.colorClass}`}>
                          {isOverdue && <AlertTriangle size={12} />}
                          {status.label}
                        </span>

                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {formatDateTime(rem.dueDateTime)}
                        </span>
                      </div>

                      <div style={{ fontWeight: 700, fontSize: '0.925rem', marginBottom: '0.35rem' }}>
                        {rem.title}
                      </div>

                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                        <Building2 size={13} />
                        <strong>{rem.companyName}</strong>
                        {rem.hrName && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                            • <User size={12} /> {rem.hrName}
                          </span>
                        )}
                      </div>

                      {rem.notes && (
                        <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.2)', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.65rem' }}>
                          "{rem.notes}"
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button 
                          className="btn btn-secondary btn-xs"
                          onClick={() => onSnoozeReminder(rem.id)}
                          title="Snooze 1 day ahead"
                        >
                          <Clock size={12} />
                          <span>+1 Day</span>
                        </button>

                        <button 
                          className="btn btn-primary btn-xs"
                          onClick={() => onToggleCompleteReminder(rem.id)}
                        >
                          <CheckCircle2 size={12} />
                          <span>Mark Done</span>
                        </button>

                        <button 
                          className="btn btn-danger-outline btn-xs"
                          onClick={() => onDeleteReminder(rem.id)}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Completed Reminders Section */}
            {completedReminders.length > 0 && (
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  Completed Reminders ({completedReminders.length})
                </div>

                {completedReminders.map(rem => (
                  <div key={rem.id} className="reminder-card" style={{ opacity: 0.6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ textDecoration: 'line-through', fontWeight: 600, fontSize: '0.85rem' }}>
                        {rem.title}
                      </div>

                      <button 
                        className="btn btn-danger-outline btn-xs"
                        onClick={() => onDeleteReminder(rem.id)}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      {rem.companyName}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
