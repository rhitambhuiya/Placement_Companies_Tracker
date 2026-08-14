import React from 'react';
import { X, Bell, Clock } from 'lucide-react';
import { Company, HRContact, Reminder } from '../types';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reminder: Partial<Reminder>) => void;
  company: Company | null;
  hr?: HRContact | null;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({
  isOpen,
  onClose,
  onSave,
  company,
  hr,
}) => {
  const [title, setTitle] = React.useState('');
  const [date, setDate] = React.useState('');
  const [time, setTime] = React.useState('10:00');
  const [priority, setPriority] = React.useState<'High' | 'Medium' | 'Low'>('High');
  const [notes, setNotes] = React.useState('');

  React.useEffect(() => {
    if (isOpen) {
      // Default to today in IST
      const now = new Date();
      
      // Get YYYY-MM-DD in IST
      const istDateStr = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }); // YYYY-MM-DD
      setDate(istDateStr);

      // Default time: next hour in IST
      const istHours = Number(now.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', hour12: false }));
      const nextHour = (istHours + 1) % 24;
      const formattedTime = `${String(nextHour).padStart(2, '0')}:00`;
      setTime(formattedTime);

      const hrText = hr ? ` with ${hr.name}` : '';
      setTitle(`Follow up with ${company?.name || 'Recruiter'}${hrText}`);
      setNotes('');
      setPriority('High');
    }
  }, [isOpen, company, hr]);

  if (!isOpen || !company) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    // Parse date and time in IST timezone
    // Construct local ISO-like string and convert to UTC ISO string
    const localDateTimeStr = `${date}T${time}:00`;
    const localDate = new Date(localDateTimeStr);
    
    // Fallback check
    const dueDateTime = isNaN(localDate.getTime()) 
      ? new Date().toISOString() 
      : localDate.toISOString();

    onSave({
      companyId: company.id,
      companyName: company.name,
      hrId: hr ? hr.id : undefined,
      hrName: hr ? hr.name : undefined,
      title: title.trim(),
      dueDateTime,
      notes: notes.trim(),
      priority,
      isCompleted: false,
      createdAt: new Date().toISOString(),
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Bell size={20} className="text-amber-400" />
            <span>Set Follow-Up Reminder (IST)</span>
          </div>
          <button className="btn btn-secondary btn-icon-only" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Target Company & HR</label>
            <div style={{ padding: '0.6rem 0.85rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
              <strong>{company.name}</strong> {hr && <span>({hr.name} - {hr.designation})</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Reminder Action Title *</label>
            <input 
              type="text" 
              className="form-input-raw"
              placeholder="e.g. Call HR to confirm PPT slot and student matrix"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required 
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Follow-Up Date (IST) *</label>
              <input 
                type="date" 
                className="form-input-raw"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Clock size={13} className="text-amber-400" />
                <span>Reminder Time (IST - UTC+5:30) *</span>
              </label>
              <input 
                type="time" 
                className="form-input-raw"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Urgency Priority</label>
            <select
              className="form-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'High' | 'Medium' | 'Low')}
            >
              <option value="High">High Urgency (Overdue Alert)</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low / Informational</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Follow-up Checklist / Additional Notes</label>
            <textarea 
              className="form-input-raw"
              rows={2}
              placeholder="e.g. Remember to attach updated placement brochure PDF before calling."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Schedule Notification (IST)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
