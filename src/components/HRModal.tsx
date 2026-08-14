import React from 'react';
import { X, UserPlus, UserCheck } from 'lucide-react';
import { HRContact, HRStatus } from '../types';

interface HRModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (hrData: Partial<HRContact>) => void;
  companyName: string;
  editingHR?: HRContact | null;
}

export const HRModal: React.FC<HRModalProps> = ({
  isOpen,
  onClose,
  onSave,
  companyName,
  editingHR,
}) => {
  const [name, setName] = React.useState('');
  const [designation, setDesignation] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [linkedin, setLinkedin] = React.useState('');
  const [status, setStatus] = React.useState<HRStatus>('Not Contacted');
  const [notes, setNotes] = React.useState('');

  React.useEffect(() => {
    if (editingHR) {
      setName(editingHR.name || '');
      setDesignation(editingHR.designation || '');
      setEmail(editingHR.email || '');
      setPhone(editingHR.phone || '');
      setLinkedin(editingHR.linkedin || '');
      setStatus(editingHR.status || 'Not Contacted');
      setNotes(editingHR.notes || '');
    } else {
      setName('');
      setDesignation('');
      setEmail('');
      setPhone('');
      setLinkedin('');
      setStatus('Not Contacted');
      setNotes('');
    }
  }, [editingHR, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      designation: designation.trim() || 'HR Manager',
      email: email.trim(),
      phone: phone.trim(),
      linkedin: linkedin.trim(),
      status,
      notes: notes.trim(),
      lastContactedDate: new Date().toISOString().slice(0, 10),
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            {editingHR ? <UserCheck size={20} className="text-emerald-400" /> : <UserPlus size={20} className="text-indigo-400" />}
            <span>{editingHR ? `Edit HR Contact (${companyName})` : `Add HR Contact to ${companyName}`}</span>
          </div>
          <button className="btn btn-secondary btn-icon-only" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">HR Full Name *</label>
              <input 
                type="text" 
                className="form-input-raw"
                placeholder="e.g. Ananya Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Designation / Role</label>
              <input 
                type="text" 
                className="form-input-raw"
                placeholder="e.g. Lead University Recruiter"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                className="form-input-raw"
                placeholder="hr.name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number / WhatsApp</label>
              <input 
                type="tel" 
                className="form-input-raw"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">LinkedIn Profile URL</label>
              <input 
                type="url" 
                className="form-input-raw"
                placeholder="https://linkedin.com/in/hr-name"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">HR Outreach Status</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value as HRStatus)}
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

          <div className="form-group">
            <label className="form-label">Notes regarding this HR contact</label>
            <textarea 
              className="form-input-raw"
              rows={2}
              placeholder="e.g. Contacted via email on Monday. Prefers WhatsApp calls after 4 PM."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingHR ? 'Save HR Details' : 'Add HR Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
