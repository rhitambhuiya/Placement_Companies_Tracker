import React from 'react';
import { X, Mail, Copy, Check, ExternalLink } from 'lucide-react';
import { Company, HRContact } from '../types';

interface EmailTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCompany?: Company | null;
  selectedHR?: HRContact | null;
}

export const EmailTemplatesModal: React.FC<EmailTemplatesModalProps> = ({
  isOpen,
  onClose,
  selectedCompany,
  selectedHR,
}) => {
  const [templateType, setTemplateType] = React.useState<'invitation' | 'followup' | 'slot_confirm'>('invitation');
  const [coordinatorName, setCoordinatorName] = React.useState('Placement Coordinator');
  const [collegeName, setCollegeName] = React.useState('National Institute of Technology / College of Engineering');
  const [isCopied, setIsCopied] = React.useState(false);

  if (!isOpen) return null;

  const hrName = selectedHR?.name || 'Hiring Team / HR Manager';
  const companyName = selectedCompany?.name || 'Company Name';
  const hrEmail = selectedHR?.email || '';

  let subject = '';
  let body = '';

  if (templateType === 'invitation') {
    subject = `Campus Recruitment Invitation ${new Date().getFullYear()}-${new Date().getFullYear() + 1} | ${collegeName}`;
    body = `Dear ${hrName},

Greetings from ${collegeName}!

I am writing to you on behalf of the Training & Placement Cell. We would be honored to invite ${companyName} for our upcoming Campus Placement Drive for the graduating batch.

Our institution offers top-tier talent across Computer Science, Information Technology, Electronics, Electrical, and Mechanical branches with strong fundamentals in software engineering, system design, and problem solving.

Attached herewith is our Placement Brochure and Batch Profile Matrix for your review. We would be grateful if you could share the Job Description (JD) and proposed dates for conducting online tests / campus interviews.

Looking forward to a fruitful collaboration with ${companyName}.

Warm regards,

${coordinatorName}
Head Placement Coordinator
${collegeName}
Email: placement@college.edu.in
Phone: +91 98765 00000`;
  } else if (templateType === 'followup') {
    subject = `Follow-up: Campus Placement Drive Proposal | ${collegeName} - ${companyName}`;
    body = `Dear ${hrName},

Hope this email finds you well.

I am following up on our previous communication regarding the campus recruitment drive for ${companyName} at ${collegeName}.

We are currently finalizing the slot calendar for Phase 1 campus drives. We would love to allocate an exclusive preferred slot for ${companyName}. 

Could you please confirm if your team has had a chance to review our batch profile? We are happy to arrange a brief call at your convenience to discuss the CTC breakdown and drive timeline.

Thank you for your time and consideration.

Best regards,

${coordinatorName}
Placement Coordinator
${collegeName}`;
  } else {
    subject = `Confirmation & Slot Booking for Campus Recruitment Drive | ${companyName}`;
    body = `Dear ${hrName},

Thank you for confirming ${companyName}'s participation in our Campus Placement Drive.

We are pleased to reserve the campus drive slot for your organization. Please find below the proposed schedule details:

- Pre-Placement Talk (PPT): [Insert Time / Zoom Link]
- Online Coding / Aptitude Test: [Insert Date & Time]
- Interview Rounds: [Insert Dates]

Please let us know if you require any specific technical infrastructure, auditorium arrangements, or video conferencing setups.

Looking forward to hosting your team!

Best regards,

${coordinatorName}
Training & Placement Cell
${collegeName}`;
  }

  const handleCopyText = () => {
    const fullText = `Subject: ${subject}\n\n${body}`;
    navigator.clipboard.writeText(fullText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const mailtoUrl = `mailto:${encodeURIComponent(hrEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '650px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Mail size={20} className="text-indigo-400" />
            <span>Placement Email Template Generator</span>
          </div>
          <button className="btn btn-secondary btn-icon-only" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Template Type</label>
            <select
              className="form-select"
              value={templateType}
              onChange={(e) => setTemplateType(e.target.value as unknown as typeof templateType)}
            >
              <option value="invitation">1. Initial Invitation Mail</option>
              <option value="followup">2. Follow-Up Mail</option>
              <option value="slot_confirm">3. Drive Slot Confirmation</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Coordinator Name</label>
            <input 
              type="text" 
              className="form-input-raw"
              value={coordinatorName}
              onChange={(e) => setCoordinatorName(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">College / Institute Name</label>
          <input 
            type="text" 
            className="form-input-raw"
            value={collegeName}
            onChange={(e) => setCollegeName(e.target.value)}
          />
        </div>

        {/* Email Preview */}
        <div className="form-group">
          <label className="form-label">Generated Subject Line</label>
          <input 
            type="text" 
            className="form-input-raw"
            readOnly
            value={subject}
            style={{ fontWeight: 600, color: 'var(--text-primary)' }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email Message Body</label>
          <textarea 
            className="form-input-raw"
            rows={10}
            readOnly
            value={body}
            style={{ fontFamily: 'monospace', fontSize: '0.825rem', lineHeight: '1.4' }}
          />
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={handleCopyText}>
            {isCopied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
            <span>{isCopied ? 'Copied to Clipboard!' : 'Copy Text'}</span>
          </button>

          {hrEmail ? (
            <a href={mailtoUrl} className="btn btn-primary" style={{ textDecoration: 'none' }}>
              <ExternalLink size={16} />
              <span>Open in Email App ({selectedHR?.name || hrEmail})</span>
            </a>
          ) : (
            <button className="btn btn-secondary" disabled title="No HR email provided for recipient">
              No HR Email Attached
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
