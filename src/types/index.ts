export type PrioritySection = 'Top Priority' | 'Medium Priority' | 'Low CTC / Call Later' | 'Extra';

export type CompanyStatus = 
  | 'Uncontacted' 
  | 'Initial Outreach' 
  | 'In Discussion' 
  | 'PPT Scheduled'
  | 'Test Scheduled'
  | 'Drive Scheduled' 
  | 'Completed' 
  | 'Deferred' 
  | 'Declined';

export type HRStatus = 
  | 'Not Contacted' 
  | 'Email Sent' 
  | 'Call Scheduled' 
  | 'Followed Up' 
  | 'In Discussion' 
  | 'Slot Offered' 
  | 'Declined';

export interface HRContact {
  id: string;
  name: string;
  designation: string;
  email: string;
  phone: string;
  linkedin?: string;
  status: HRStatus;
  notes?: string;
  lastContactedDate?: string;
}

export interface Reminder {
  id: string;
  companyId: string;
  companyName: string;
  hrId?: string;
  hrName?: string;
  title: string;
  dueDateTime: string; // ISO string format YYYY-MM-DDTHH:mm
  notes?: string;
  isCompleted: boolean;
  priority: 'High' | 'Medium' | 'Low';
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  website?: string;
  priorityCategory: PrioritySection;
  status: CompanyStatus;
  isDone: boolean; // Done with company checkbox
  ctcPackage?: string; // e.g. "24-30 LPA"
  location?: string;
  eligibleBranches?: string[];
  hrs: HRContact[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlacementStats {
  totalCompanies: number;
  topPriorityCount: number;
  mediumPriorityCount: number;
  lowCtcCount: number;
  extraCount: number;
  completedCompaniesCount: number;
  totalHrs: number;
  activeRemindersCount: number;
  overdueRemindersCount: number;
}

export interface FilterOptions {
  searchQuery: string;
  selectedPriority: PrioritySection | 'All' | 'Done';
  selectedStatus: CompanyStatus | 'All';
  showOnlyDone: boolean;
  sortBy: 'name' | 'ctc' | 'updatedAt' | 'priority';
}
