import React from 'react';
import { X, Building2 } from 'lucide-react';
import { Company, PrioritySection, CompanyStatus } from '../types';

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (companyData: Partial<Company>) => void;
  editingCompany?: Company | null;
  initialPriority?: PrioritySection;
}

export const CompanyModal: React.FC<CompanyModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingCompany,
  initialPriority = 'Top Priority',
}) => {
  const [name, setName] = React.useState('');
  const [industry, setIndustry] = React.useState('');
  const [website, setWebsite] = React.useState('');
  const [priorityCategory, setPriorityCategory] = React.useState<PrioritySection>(initialPriority);
  const [status, setStatus] = React.useState<CompanyStatus>('Uncontacted');
  const [ctcPackage, setCtcPackage] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [notes, setNotes] = React.useState('');

  React.useEffect(() => {
    if (editingCompany) {
      setName(editingCompany.name || '');
      setIndustry(editingCompany.industry || '');
      setWebsite(editingCompany.website || '');
      setPriorityCategory(editingCompany.priorityCategory || 'Top Priority');
      setStatus(editingCompany.status || 'Uncontacted');
      setCtcPackage(editingCompany.ctcPackage || '');
      setLocation(editingCompany.location || '');
      setNotes(editingCompany.notes || '');
    } else {
      setName('');
      setIndustry('');
      setWebsite('');
      setPriorityCategory(initialPriority);
      setStatus('Uncontacted');
      setCtcPackage('');
      setLocation('');
      setNotes('');
    }
  }, [editingCompany, initialPriority, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      industry: industry.trim() || 'Technology / Corporate',
      website: website.trim(),
      priorityCategory,
      status,
      ctcPackage: ctcPackage.trim(),
      location: location.trim(),
      notes: notes.trim(),
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Building2 size={20} className="text-indigo-400" />
            <span>{editingCompany ? 'Edit Company' : 'Add New Recruiter Company'}</span>
          </div>
          <button className="btn btn-secondary btn-icon-only" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Company Name *</label>
            <input 
              type="text" 
              className="form-input-raw"
              placeholder="e.g. Google India, Microsoft, Deloitte"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Priority Section Bucket *</label>
              <select
                className="form-select"
                value={priorityCategory}
                onChange={(e) => setPriorityCategory(e.target.value as PrioritySection)}
              >
                <option value="Top Priority">Top Priority (Tier 1 / High CTC)</option>
                <option value="Medium Priority">Medium Priority (Standard Recruiters)</option>
                <option value="Low CTC / Call Later">Low CTC / Call Later in Season</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Drive / Contact Status</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value as CompanyStatus)}
              >
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
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">CTC / Salary Package (LPA)</label>
              <input 
                type="text" 
                className="form-input-raw"
                placeholder="e.g. 18-24 LPA"
                value={ctcPackage}
                onChange={(e) => setCtcPackage(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Industry Sector</label>
              <input 
                type="text" 
                className="form-input-raw"
                placeholder="e.g. IT, Banking, Core, Consulting"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Careers / Official Website</label>
              <input 
                type="url" 
                className="form-input-raw"
                placeholder="https://company.com/careers"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Location / Work Mode</label>
              <input 
                type="text" 
                className="form-input-raw"
                placeholder="e.g. Bengaluru, Remote, Hybrid"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Coordinator Notes / Specific Drive Info</label>
            <textarea 
              className="form-input-raw"
              rows={3}
              placeholder="e.g. Eligible branches CSE & ECE. Pre-placement talk required before online test."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingCompany ? 'Save Changes' : 'Create Company'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
