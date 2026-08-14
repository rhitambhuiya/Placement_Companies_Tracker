import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';
import { Company, HRContact, Reminder } from '../types';

// DB mapping helpers
const mapCompanyFromDB = (dbComp: Record<string, unknown>, dbHrs: Record<string, unknown>[] = []): Company => ({
  id: dbComp.id as string,
  name: dbComp.name as string,
  industry: (dbComp.industry as string) || '',
  website: (dbComp.website as string) || '',
  priorityCategory: dbComp.priority_category as Company['priorityCategory'],
  status: dbComp.status as Company['status'],
  isDone: Boolean(dbComp.is_done),
  ctcPackage: (dbComp.ctc_package as string) || '',
  location: (dbComp.location as string) || '',
  hrs: dbHrs.map(mapHRFromDB),
  notes: (dbComp.notes as string) || '',
  createdAt: (dbComp.created_at as string) || new Date().toISOString(),
  updatedAt: (dbComp.updated_at as string) || new Date().toISOString(),
});

const mapHRFromDB = (dbHr: Record<string, unknown>): HRContact => ({
  id: dbHr.id as string,
  name: dbHr.name as string,
  designation: (dbHr.designation as string) || '',
  email: (dbHr.email as string) || '',
  phone: (dbHr.phone as string) || '',
  linkedin: (dbHr.linkedin as string) || '',
  status: dbHr.status as HRContact['status'],
  notes: (dbHr.notes as string) || '',
  lastContactedDate: (dbHr.last_contacted_date as string) || '',
});

const mapReminderFromDB = (dbRem: Record<string, unknown>): Reminder => ({
  id: dbRem.id as string,
  companyId: dbRem.company_id as string,
  companyName: dbRem.company_name as string,
  hrId: dbRem.hr_id as string | undefined,
  hrName: dbRem.hr_name as string | undefined,
  title: dbRem.title as string,
  dueDateTime: dbRem.due_date_time as string,
  notes: (dbRem.notes as string) || '',
  isCompleted: Boolean(dbRem.is_completed),
  priority: dbRem.priority as Reminder['priority'],
  createdAt: (dbRem.created_at as string) || new Date().toISOString(),
});

// Fetch all companies with HR contacts from Supabase
export const fetchCompaniesFromSupabase = async (): Promise<Company[] | null> => {
  if (!isSupabaseConfigured() || !supabase) return null;

  try {
    const { data: companiesData, error: compErr } = await supabase
      .from('companies')
      .select('*')
      .order('updated_at', { ascending: false });

    if (compErr) {
      console.error('Supabase companies fetch error:', compErr);
      return null;
    }

    const { data: hrsData, error: hrErr } = await supabase
      .from('hr_contacts')
      .select('*');

    if (hrErr) {
      console.error('Supabase hr_contacts fetch error:', hrErr);
    }

    const allHrs = hrsData || [];

    return companiesData.map(c => {
      const companyHrs = allHrs.filter(h => h.company_id === c.id);
      return mapCompanyFromDB(c, companyHrs);
    });
  } catch (err) {
    console.error('Supabase connection error:', err);
    return null;
  }
};

// Fetch all reminders from Supabase
export const fetchRemindersFromSupabase = async (): Promise<Reminder[] | null> => {
  if (!isSupabaseConfigured() || !supabase) return null;

  try {
    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .order('due_date_time', { ascending: true });

    if (error) {
      console.error('Supabase reminders fetch error:', error);
      return null;
    }

    return data.map(mapReminderFromDB);
  } catch (err) {
    console.error('Supabase error:', err);
    return null;
  }
};

// Save or Update Company in Supabase
export const upsertCompanyToSupabase = async (company: Company) => {
  if (!isSupabaseConfigured() || !supabase) return;

  const payload = {
    id: company.id,
    name: company.name,
    industry: company.industry,
    website: company.website,
    priority_category: company.priorityCategory,
    status: company.status,
    is_done: company.isDone,
    ctc_package: company.ctcPackage,
    location: company.location,
    notes: company.notes,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from('companies').upsert(payload);
  if (error) console.error('Error upserting company to Supabase:', error);
};

// Delete Company from Supabase
export const deleteCompanyFromSupabase = async (companyId: string) => {
  if (!isSupabaseConfigured() || !supabase) return;

  const { error } = await supabase.from('companies').delete().eq('id', companyId);
  if (error) console.error('Error deleting company from Supabase:', error);
};

// Save or Update HR Contact in Supabase
export const upsertHRContactToSupabase = async (companyId: string, hr: HRContact) => {
  if (!isSupabaseConfigured() || !supabase) return;

  const payload = {
    id: hr.id,
    company_id: companyId,
    name: hr.name,
    designation: hr.designation,
    email: hr.email,
    phone: hr.phone,
    linkedin: hr.linkedin,
    status: hr.status,
    notes: hr.notes,
    last_contacted_date: hr.lastContactedDate,
  };

  const { error } = await supabase.from('hr_contacts').upsert(payload);
  if (error) console.error('Error upserting HR contact to Supabase:', error);
};

// Delete HR Contact from Supabase
export const deleteHRContactFromSupabase = async (hrId: string) => {
  if (!isSupabaseConfigured() || !supabase) return;

  const { error } = await supabase.from('hr_contacts').delete().eq('id', hrId);
  if (error) console.error('Error deleting HR contact from Supabase:', error);
};

// Save or Update Reminder in Supabase
export const upsertReminderToSupabase = async (reminder: Reminder) => {
  if (!isSupabaseConfigured() || !supabase) return;

  const payload = {
    id: reminder.id,
    company_id: reminder.companyId,
    company_name: reminder.companyName,
    hr_id: reminder.hrId,
    hr_name: reminder.hrName,
    title: reminder.title,
    due_date_time: reminder.dueDateTime,
    notes: reminder.notes,
    is_completed: reminder.isCompleted,
    priority: reminder.priority,
  };

  const { error } = await supabase.from('reminders').upsert(payload);
  if (error) console.error('Error upserting reminder to Supabase:', error);
};

// Delete Reminder from Supabase
export const deleteReminderFromSupabase = async (reminderId: string) => {
  if (!isSupabaseConfigured() || !supabase) return;

  const { error } = await supabase.from('reminders').delete().eq('id', reminderId);
  if (error) console.error('Error deleting reminder from Supabase:', error);
};

// Subscribe to Supabase Realtime changes across connected devices
export const subscribeToRealtimeSync = (onSyncCallback: () => void) => {
  if (!isSupabaseConfigured() || !supabase) return () => {};

  const channel = supabase
    .channel('placement-sync-channel')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'companies' }, () => {
      onSyncCallback();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'hr_contacts' }, () => {
      onSyncCallback();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'reminders' }, () => {
      onSyncCallback();
    })
    .subscribe();

  return () => {
    if (supabase) supabase.removeChannel(channel);
  };
};
