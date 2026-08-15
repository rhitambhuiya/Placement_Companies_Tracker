import { Company, Reminder, PlacementStats } from '../types';
import { INITIAL_COMPANIES, INITIAL_REMINDERS } from '../data/initialData';

const STORAGE_KEY_COMPANIES = 'placement_tracker_companies_v1';
const STORAGE_KEY_REMINDERS = 'placement_tracker_reminders_v1';

export const loadCompaniesFromStorage = (): Company[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COMPANIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_COMPANIES, JSON.stringify(INITIAL_COMPANIES));
      return INITIAL_COMPANIES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading companies from localStorage:', err);
    return INITIAL_COMPANIES;
  }
};

export const saveCompaniesToStorage = (companies: Company[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_COMPANIES, JSON.stringify(companies));
  } catch (err) {
    console.error('Error saving companies to localStorage:', err);
  }
};

export const loadRemindersFromStorage = (): Reminder[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REMINDERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_REMINDERS, JSON.stringify(INITIAL_REMINDERS));
      return INITIAL_REMINDERS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading reminders from localStorage:', err);
    return INITIAL_REMINDERS;
  }
};

export const saveRemindersToStorage = (reminders: Reminder[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_REMINDERS, JSON.stringify(reminders));
  } catch (err) {
    console.error('Error saving reminders to localStorage:', err);
  }
};

export const calculateStats = (companies: Company[], reminders: Reminder[]): PlacementStats => {
  const now = new Date();
  
  const totalCompanies = companies.length;
  const topPriorityCount = companies.filter(c => c.priorityCategory === 'Top Priority' && !c.isDone).length;
  const mediumPriorityCount = companies.filter(c => c.priorityCategory === 'Medium Priority' && !c.isDone).length;
  const lowCtcCount = companies.filter(c => c.priorityCategory === 'Low CTC / Call Later' && !c.isDone).length;
  const extraCount = companies.filter(c => c.priorityCategory === 'Extra' && !c.isDone).length;
  const completedCompaniesCount = companies.filter(c => c.isDone || c.status === 'Completed').length;
  
  let totalHrs = 0;
  companies.forEach(c => {
    totalHrs += c.hrs ? c.hrs.length : 0;
  });

  const activeReminders = reminders.filter(r => !r.isCompleted);
  const activeRemindersCount = activeReminders.length;
  
  const overdueRemindersCount = activeReminders.filter(r => {
    const due = new Date(r.dueDateTime);
    return due < now;
  }).length;

  return {
    totalCompanies,
    topPriorityCount,
    mediumPriorityCount,
    lowCtcCount,
    extraCount,
    completedCompaniesCount,
    totalHrs,
    activeRemindersCount,
    overdueRemindersCount
  };
};

export const exportDataAsJSON = (companies: Company[], reminders: Reminder[]) => {
  const data = {
    companies,
    reminders,
    exportDate: new Date().toISOString(),
    app: 'Placement Pulse - HR & Drive Tracker'
  };
  
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `placement_tracker_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

export const exportCompaniesAsCSV = (companies: Company[]) => {
  const headers = [
    'Company Name',
    'Priority Category',
    'Overall Status',
    'Is Done',
    'CTC Package',
    'Industry',
    'HR Name',
    'HR Designation',
    'HR Email',
    'HR Phone',
    'HR Status',
    'HR Notes'
  ];

  const rows: string[] = [headers.join(',')];

  companies.forEach(company => {
    if (company.hrs && company.hrs.length > 0) {
      company.hrs.forEach(hr => {
        const row = [
          `"${company.name.replace(/"/g, '""')}"`,
          `"${company.priorityCategory}"`,
          `"${company.status}"`,
          `"${company.isDone ? 'Yes' : 'No'}"`,
          `"${(company.ctcPackage || '').replace(/"/g, '""')}"`,
          `"${(company.industry || '').replace(/"/g, '""')}"`,
          `"${(hr.name || '').replace(/"/g, '""')}"`,
          `"${(hr.designation || '').replace(/"/g, '""')}"`,
          `"${(hr.email || '').replace(/"/g, '""')}"`,
          `"${(hr.phone || '').replace(/"/g, '""')}"`,
          `"${(hr.status || '').replace(/"/g, '""')}"`,
          `"${(hr.notes || '').replace(/"/g, '""')}"`
        ];
        rows.push(row.join(','));
      });
    } else {
      const row = [
        `"${company.name.replace(/"/g, '""')}"`,
        `"${company.priorityCategory}"`,
        `"${company.status}"`,
        `"${company.isDone ? 'Yes' : 'No'}"`,
        `"${(company.ctcPackage || '').replace(/"/g, '""')}"`,
        `"${(company.industry || '').replace(/"/g, '""')}"`,
        '""', '""', '""', '""', '""', '""'
      ];
      rows.push(row.join(','));
    }
  });

  const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(rows.join('\n'));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", csvContent);
  downloadAnchor.setAttribute("download", `placement_companies_hrs_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};
