import React, { useState, useEffect, useMemo } from 'react';
import { 
  Company, 
  HRContact, 
  Reminder, 
  FilterOptions, 
  PrioritySection, 
  CompanyStatus, 
  HRStatus 
} from './types';
import { 
  loadCompaniesFromStorage, 
  saveCompaniesToStorage, 
  loadRemindersFromStorage, 
  saveRemindersToStorage,
  calculateStats,
  exportCompaniesAsCSV,
  exportDataAsJSON
} from './utils/storage';
import { INITIAL_COMPANIES, INITIAL_REMINDERS } from './data/initialData';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { SectionTabs } from './components/SectionTabs';
import { CompanyCard } from './components/CompanyCard';
import { CompanyModal } from './components/CompanyModal';
import { HRModal } from './components/HRModal';
import { ReminderModal } from './components/ReminderModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { EmailTemplatesModal } from './components/EmailTemplatesModal';
import { Plus, Search } from 'lucide-react';

export const App: React.FC = () => {
  // State
  const [companies, setCompanies] = useState<Company[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    searchQuery: '',
    selectedPriority: 'Top Priority', // Default active section tab
    selectedStatus: 'All',
    showOnlyDone: false,
    sortBy: 'updatedAt',
  });

  // Modal States
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  const [isHRModalOpen, setIsHRModalOpen] = useState(false);
  const [activeCompanyIdForHR, setActiveCompanyIdForHR] = useState<string | null>(null);
  const [editingHR, setEditingHR] = useState<HRContact | null>(null);

  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [reminderTargetCompany, setReminderTargetCompany] = useState<Company | null>(null);
  const [reminderTargetHR, setReminderTargetHR] = useState<HRContact | null>(null);

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailTargetCompany, setEmailTargetCompany] = useState<Company | null>(null);
  const [emailTargetHR, setEmailTargetHR] = useState<HRContact | null>(null);

  // Initial Data Load
  useEffect(() => {
    const loadedCompanies = loadCompaniesFromStorage();
    const loadedReminders = loadRemindersFromStorage();
    setCompanies(loadedCompanies);
    setReminders(loadedReminders);
  }, []);

  // Save changes to localStorage on state mutations
  useEffect(() => {
    if (companies.length > 0) {
      saveCompaniesToStorage(companies);
    }
  }, [companies]);

  useEffect(() => {
    saveRemindersToStorage(reminders);
  }, [reminders]);

  // Derived placement statistics
  const stats = useMemo(() => calculateStats(companies, reminders), [companies, reminders]);

  // Counts for tabs badges
  const tabCounts = useMemo(() => {
    return {
      topPriority: companies.filter(c => c.priorityCategory === 'Top Priority' && !c.isDone).length,
      mediumPriority: companies.filter(c => c.priorityCategory === 'Medium Priority' && !c.isDone).length,
      lowCtc: companies.filter(c => c.priorityCategory === 'Low CTC / Call Later' && !c.isDone).length,
      done: companies.filter(c => c.isDone).length,
      all: companies.length,
    };
  }, [companies]);

  // Filter & Search Logic
  const filteredCompanies = useMemo(() => {
    return companies.filter(company => {
      // Search Query Matching
      if (filterOptions.searchQuery.trim()) {
        const query = filterOptions.searchQuery.toLowerCase();
        const matchName = company.name.toLowerCase().includes(query);
        const matchIndustry = company.industry.toLowerCase().includes(query);
        const matchCtc = (company.ctcPackage || '').toLowerCase().includes(query);
        const matchNotes = (company.notes || '').toLowerCase().includes(query);
        
        const matchHR = company.hrs && company.hrs.some(hr => 
          hr.name.toLowerCase().includes(query) ||
          hr.designation.toLowerCase().includes(query) ||
          hr.email.toLowerCase().includes(query) ||
          hr.phone.includes(query)
        );

        if (!matchName && !matchIndustry && !matchCtc && !matchNotes && !matchHR) {
          return false;
        }
      }

      // Priority Tab Filtering
      if (filterOptions.selectedPriority === 'Done') {
        if (!company.isDone) return false;
      } else if (filterOptions.selectedPriority !== 'All') {
        if (company.isDone) return false; // Hide done companies from active priority tabs unless 'All' or 'Done' tab selected
        if (company.priorityCategory !== filterOptions.selectedPriority) return false;
      }

      // Status Filter
      if (filterOptions.selectedStatus !== 'All') {
        if (company.status !== filterOptions.selectedStatus) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filterOptions.sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (filterOptions.sortBy === 'priority') {
        const order = { 'Top Priority': 1, 'Medium Priority': 2, 'Low CTC / Call Later': 3 };
        return (order[a.priorityCategory] || 4) - (order[b.priorityCategory] || 4);
      } else {
        // default by updatedAt
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });
  }, [companies, filterOptions]);

  // --- Handlers: Company Operations ---
  const handleSaveCompany = (companyData: Partial<Company>) => {
    const nowISO = new Date().toISOString();

    if (editingCompany) {
      // Update existing
      setCompanies(prev => prev.map(c => {
        if (c.id === editingCompany.id) {
          return {
            ...c,
            ...companyData,
            updatedAt: nowISO
          };
        }
        return c;
      }));
    } else {
      // Add new
      const newCompany: Company = {
        id: `comp-${Date.now()}`,
        name: companyData.name || 'New Company',
        industry: companyData.industry || 'Corporate',
        website: companyData.website || '',
        priorityCategory: companyData.priorityCategory || 'Top Priority',
        status: companyData.status || 'Uncontacted',
        isDone: false,
        ctcPackage: companyData.ctcPackage || '',
        location: companyData.location || '',
        hrs: [],
        notes: companyData.notes || '',
        createdAt: nowISO,
        updatedAt: nowISO,
      };
      setCompanies(prev => [newCompany, ...prev]);
    }
  };

  const handleToggleDone = (companyId: string, currentDone: boolean) => {
    setCompanies(prev => prev.map(c => {
      if (c.id === companyId) {
        const newDone = !currentDone;
        return {
          ...c,
          isDone: newDone,
          status: newDone ? 'Completed' : (c.status === 'Completed' ? 'In Discussion' : c.status),
          updatedAt: new Date().toISOString()
        };
      }
      return c;
    }));
  };

  const handleUpdateCompanyStatus = (companyId: string, status: CompanyStatus) => {
    setCompanies(prev => prev.map(c => {
      if (c.id === companyId) {
        return {
          ...c,
          status,
          isDone: status === 'Completed' ? true : c.isDone,
          updatedAt: new Date().toISOString()
        };
      }
      return c;
    }));
  };

  const handleUpdateCompanyPriority = (companyId: string, priorityCategory: PrioritySection) => {
    setCompanies(prev => prev.map(c => {
      if (c.id === companyId) {
        return {
          ...c,
          priorityCategory,
          updatedAt: new Date().toISOString()
        };
      }
      return c;
    }));
  };

  const handleDeleteCompany = (companyId: string) => {
    if (window.confirm('Are you sure you want to remove this company and all associated HR contacts?')) {
      setCompanies(prev => prev.filter(c => c.id !== companyId));
      setReminders(prev => prev.filter(r => r.companyId !== companyId));
    }
  };

  // --- Handlers: HR Operations ---
  const handleOpenAddHR = (companyId: string) => {
    setActiveCompanyIdForHR(companyId);
    setEditingHR(null);
    setIsHRModalOpen(true);
  };

  const handleOpenEditHR = (companyId: string, hr: HRContact) => {
    setActiveCompanyIdForHR(companyId);
    setEditingHR(hr);
    setIsHRModalOpen(true);
  };

  const handleSaveHR = (hrData: Partial<HRContact>) => {
    if (!activeCompanyIdForHR) return;

    setCompanies(prev => prev.map(c => {
      if (c.id === activeCompanyIdForHR) {
        const existingHrs = c.hrs || [];
        let updatedHrs: HRContact[];

        if (editingHR) {
          // Update HR
          updatedHrs = existingHrs.map(h => {
            if (h.id === editingHR.id) {
              return { ...h, ...hrData } as HRContact;
            }
            return h;
          });
        } else {
          // Add new HR
          const newHR: HRContact = {
            id: `hr-${Date.now()}`,
            name: hrData.name || 'HR Recruiter',
            designation: hrData.designation || 'HR Manager',
            email: hrData.email || '',
            phone: hrData.phone || '',
            linkedin: hrData.linkedin || '',
            status: hrData.status || 'Not Contacted',
            notes: hrData.notes || '',
            lastContactedDate: new Date().toISOString().slice(0, 10)
          };
          updatedHrs = [...existingHrs, newHR];
        }

        return {
          ...c,
          hrs: updatedHrs,
          updatedAt: new Date().toISOString()
        };
      }
      return c;
    }));
  };

  const handleDeleteHR = (companyId: string, hrId: string) => {
    if (window.confirm('Remove this HR contact?')) {
      setCompanies(prev => prev.map(c => {
        if (c.id === companyId) {
          return {
            ...c,
            hrs: c.hrs.filter(h => h.id !== hrId),
            updatedAt: new Date().toISOString()
          };
        }
        return c;
      }));
    }
  };

  const handleUpdateHRStatus = (companyId: string, hrId: string, status: HRStatus) => {
    setCompanies(prev => prev.map(c => {
      if (c.id === companyId) {
        return {
          ...c,
          hrs: c.hrs.map(h => h.id === hrId ? { ...h, status } : h),
          updatedAt: new Date().toISOString()
        };
      }
      return c;
    }));
  };

  // --- Handlers: Reminders Operations ---
  const handleScheduleReminder = (company: Company, hr?: HRContact) => {
    setReminderTargetCompany(company);
    setReminderTargetHR(hr || null);
    setIsReminderModalOpen(true);
  };

  const handleSaveReminder = (reminderData: Partial<Reminder>) => {
    const newReminder: Reminder = {
      id: `rem-${Date.now()}`,
      companyId: reminderData.companyId || '',
      companyName: reminderData.companyName || '',
      hrId: reminderData.hrId,
      hrName: reminderData.hrName,
      title: reminderData.title || 'Follow-up',
      dueDateTime: reminderData.dueDateTime || new Date().toISOString(),
      notes: reminderData.notes || '',
      priority: reminderData.priority || 'High',
      isCompleted: false,
      createdAt: new Date().toISOString()
    };

    setReminders(prev => [newReminder, ...prev]);
  };

  const handleToggleCompleteReminder = (reminderId: string) => {
    setReminders(prev => prev.map(r => {
      if (r.id === reminderId) {
        return { ...r, isCompleted: !r.isCompleted };
      }
      return r;
    }));
  };

  const handleDeleteReminder = (reminderId: string) => {
    setReminders(prev => prev.filter(r => r.id !== reminderId));
  };

  const handleSnoozeReminder = (reminderId: string) => {
    setReminders(prev => prev.map(r => {
      if (r.id === reminderId) {
        const d = new Date(r.dueDateTime);
        d.setDate(d.getDate() + 1); // add 1 day
        return { ...r, dueDateTime: d.toISOString() };
      }
      return r;
    }));
  };

  // --- Handlers: Quick Mail Generator ---
  const handleQuickEmail = (company: Company, hr: HRContact) => {
    setEmailTargetCompany(company);
    setEmailTargetHR(hr);
    setIsEmailModalOpen(true);
  };

  // Reset to default sample data
  const handleResetData = () => {
    if (window.confirm('Reset all data to default initial placement dataset? Any custom additions will be overwritten.')) {
      setCompanies(INITIAL_COMPANIES);
      setReminders(INITIAL_REMINDERS);
      saveCompaniesToStorage(INITIAL_COMPANIES);
      saveRemindersToStorage(INITIAL_REMINDERS);
    }
  };

  // Import JSON backup
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.companies && Array.isArray(json.companies)) {
          setCompanies(json.companies);
          if (json.reminders && Array.isArray(json.reminders)) {
            setReminders(json.reminders);
          }
          alert(`Successfully imported ${json.companies.length} companies!`);
        } else {
          alert('Invalid file format. File must contain a "companies" array.');
        }
      } catch (err) {
        alert('Error parsing JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  const activeCompanyNameForHRModal = companies.find(c => c.id === activeCompanyIdForHR)?.name || '';

  return (
    <div className="app-container">
      {/* App Header & Navigation */}
      <Header
        stats={stats}
        onOpenAddCompanyModal={() => {
          setEditingCompany(null);
          setIsCompanyModalOpen(true);
        }}
        onToggleNotifications={() => setIsNotificationsOpen(prev => !prev)}
        onOpenEmailTemplates={() => {
          setEmailTargetCompany(null);
          setEmailTargetHR(null);
          setIsEmailModalOpen(true);
        }}
        onExportJSON={() => exportDataAsJSON(companies, reminders)}
        onExportCSV={() => exportCompaniesAsCSV(companies)}
        onImportJSON={handleImportJSON}
        onResetData={handleResetData}
      />

      {/* KPI Overview Metrics Bar */}
      <StatsBar stats={stats} />

      {/* 3 Priority Section Tabs & Filter Controls */}
      <SectionTabs
        filterOptions={filterOptions}
        onFilterChange={(newFilters) => setFilterOptions(prev => ({ ...prev, ...newFilters }))}
        counts={tabCounts}
      />

      {/* Companies List Container */}
      {filteredCompanies.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Search size={32} />
          </div>
          <h3 className="empty-title">No Companies Found</h3>
          <p className="empty-desc">
            {filterOptions.searchQuery 
              ? `No recruiters matched "${filterOptions.searchQuery}". Try adjusting your search query or filters.` 
              : `No companies categorized under "${filterOptions.selectedPriority}". Click "+ Add Company" to add your first company.`}
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => {
              setEditingCompany(null);
              setIsCompanyModalOpen(true);
            }}
          >
            <Plus size={16} />
            <span>Add New Company</span>
          </button>
        </div>
      ) : (
        <div className="company-cards-grid">
          {filteredCompanies.map(company => (
            <CompanyCard
              key={company.id}
              company={company}
              onToggleDone={handleToggleDone}
              onUpdateCompanyStatus={handleUpdateCompanyStatus}
              onUpdateCompanyPriority={handleUpdateCompanyPriority}
              onEditCompany={(comp) => {
                setEditingCompany(comp);
                setIsCompanyModalOpen(true);
              }}
              onDeleteCompany={handleDeleteCompany}
              onAddHR={handleOpenAddHR}
              onEditHR={handleOpenEditHR}
              onDeleteHR={handleDeleteHR}
              onUpdateHRStatus={handleUpdateHRStatus}
              onScheduleReminder={handleScheduleReminder}
              onQuickEmail={handleQuickEmail}
            />
          ))}
        </div>
      )}

      {/* Modals & Slide-over panels */}
      <CompanyModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
        onSave={handleSaveCompany}
        editingCompany={editingCompany}
        initialPriority={filterOptions.selectedPriority === 'All' || filterOptions.selectedPriority === 'Done' ? 'Top Priority' : filterOptions.selectedPriority}
      />

      <HRModal
        isOpen={isHRModalOpen}
        onClose={() => setIsHRModalOpen(false)}
        onSave={handleSaveHR}
        companyName={activeCompanyNameForHRModal}
        editingHR={editingHR}
      />

      <ReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        onSave={handleSaveReminder}
        company={reminderTargetCompany}
        hr={reminderTargetHR}
      />

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        reminders={reminders}
        onToggleCompleteReminder={handleToggleCompleteReminder}
        onDeleteReminder={handleDeleteReminder}
        onSnoozeReminder={handleSnoozeReminder}
      />

      <EmailTemplatesModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        selectedCompany={emailTargetCompany}
        selectedHR={emailTargetHR}
      />
    </div>
  );
};

export default App;
