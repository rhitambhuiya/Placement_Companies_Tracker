import { Company, Reminder } from '../types';

export const INITIAL_COMPANIES: Company[] = [
  {
    id: 'comp-1',
    name: 'Google India',
    industry: 'Technology & Cloud',
    website: 'https://careers.google.com',
    priorityCategory: 'Top Priority',
    status: 'In Discussion',
    isDone: false,
    ctcPackage: '32 - 45 LPA',
    location: 'Bengaluru / Hyderabad',
    eligibleBranches: ['CSE', 'IT', 'ECE'],
    notes: 'Targeting Software Engineering and Cloud Consultant roles. Drive expected in September.',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-14T11:30:00.000Z',
    hrs: [
      {
        id: 'hr-101',
        name: 'Ananya Sharma',
        designation: 'Lead University Recruiter',
        email: 'ananya.sharma@google.com',
        phone: '+91 98765 43210',
        linkedin: 'https://linkedin.com/in/ananya-sharma-recruiter',
        status: 'In Discussion',
        notes: 'Requested updated student matrix CSV and placement brochure.',
        lastContactedDate: '2026-08-12'
      },
      {
        id: 'hr-102',
        name: 'Rohan Verma',
        designation: 'Technical Talent Acquisition Lead',
        email: 'rverma@google.com',
        phone: '+91 98765 43211',
        linkedin: 'https://linkedin.com/in/rohan-verma-google',
        status: 'Email Sent',
        notes: 'Coordinating slot availability for online coding test.',
        lastContactedDate: '2026-08-10'
      }
    ]
  },
  {
    id: 'comp-2',
    name: 'Microsoft',
    industry: 'Software & Enterprise Systems',
    website: 'https://careers.microsoft.com',
    priorityCategory: 'Top Priority',
    status: 'Drive Scheduled',
    isDone: false,
    ctcPackage: '28 - 40 LPA',
    location: 'Noida / Hyderabad',
    eligibleBranches: ['CSE', 'IT', 'ECE', 'EE'],
    notes: 'Placement drive slot confirmed for Oct 5th. Coding round platform link received.',
    createdAt: '2026-08-02T09:00:00.000Z',
    updatedAt: '2026-08-14T12:00:00.000Z',
    hrs: [
      {
        id: 'hr-201',
        name: 'Priya Sundaram',
        designation: 'Campus Hiring Specialist',
        email: 'psundaram@microsoft.com',
        phone: '+91 91234 56789',
        linkedin: 'https://linkedin.com/in/priya-sundaram-ms',
        status: 'Slot Offered',
        notes: 'Finalized test dates and PPT venue details.',
        lastContactedDate: '2026-08-13'
      }
    ]
  },
  {
    id: 'comp-3',
    name: 'Goldman Sachs',
    industry: 'Investment Banking & Fintech',
    website: 'https://goldmansachs.com/careers',
    priorityCategory: 'Top Priority',
    status: 'Initial Outreach',
    isDone: false,
    ctcPackage: '24 - 32 LPA',
    location: 'Bengaluru',
    eligibleBranches: ['CSE', 'IT', 'ECE', 'ME'],
    notes: 'Contacted for Quantitative Analyst and Engineering Analyst profiles.',
    createdAt: '2026-08-03T11:00:00.000Z',
    updatedAt: '2026-08-10T14:20:00.000Z',
    hrs: [
      {
        id: 'hr-301',
        name: 'Vikramaditya Roy',
        designation: 'Vice President - Campus Recruiting',
        email: 'v.roy@gs.com',
        phone: '+91 99887 76655',
        linkedin: 'https://linkedin.com/in/v-roy-gs',
        status: 'Call Scheduled',
        notes: 'Introductory call scheduled to discuss JD and CTC breakdown.',
        lastContactedDate: '2026-08-11'
      }
    ]
  },
  {
    id: 'comp-4',
    name: 'Deloitte USI',
    industry: 'Management & Technology Consulting',
    website: 'https://www2.deloitte.com/us/en/careers',
    priorityCategory: 'Medium Priority',
    status: 'In Discussion',
    isDone: false,
    ctcPackage: '9 - 13 LPA',
    location: 'Pan India',
    eligibleBranches: ['All Engineering Branches'],
    notes: 'Mass recruiter with high student intake (60+ offers expected).',
    createdAt: '2026-08-04T10:00:00.000Z',
    updatedAt: '2026-08-12T16:00:00.000Z',
    hrs: [
      {
        id: 'hr-401',
        name: 'Neha Kapoor',
        designation: 'Senior HR Manager',
        email: 'nkapoor@deloitte.com',
        phone: '+91 97112 23344',
        linkedin: 'https://linkedin.com/in/neha-kapoor-deloitte',
        status: 'In Discussion',
        notes: 'Awaiting registration portal link for shortlisted candidates.',
        lastContactedDate: '2026-08-12'
      },
      {
        id: 'hr-402',
        name: 'Siddharth Nair',
        designation: 'Campus Relations Associate',
        email: 'snair@deloitte.com',
        phone: '+91 97112 23345',
        status: 'Email Sent',
        notes: 'Sent list of interested students across CSE & ECE.',
        lastContactedDate: '2026-08-09'
      }
    ]
  },
  {
    id: 'comp-5',
    name: 'Razorpay',
    industry: 'Fintech & Payments',
    website: 'https://razorpay.com/careers',
    priorityCategory: 'Medium Priority',
    status: 'PPT Scheduled',
    isDone: false,
    ctcPackage: '18 - 22 LPA',
    location: 'Bengaluru / Remote',
    eligibleBranches: ['CSE', 'IT'],
    notes: 'Pre-Placement Talk scheduled for next Tuesday at 4:00 PM.',
    createdAt: '2026-08-05T12:00:00.000Z',
    updatedAt: '2026-08-13T09:30:00.000Z',
    hrs: [
      {
        id: 'hr-501',
        name: 'Kavita Menon',
        designation: 'TA Manager - Tech',
        email: 'kavita.m@razorpay.com',
        phone: '+91 98450 12345',
        status: 'Slot Offered',
        notes: 'Pre-Placement Talk zoom link generated and shared.',
        lastContactedDate: '2026-08-13'
      }
    ]
  },
  {
    id: 'comp-6',
    name: 'Cognizant Technology Solutions',
    industry: 'IT Services & Consulting',
    website: 'https://cognizant.com',
    priorityCategory: 'Low CTC / Call Later',
    status: 'Uncontacted',
    isDone: false,
    ctcPackage: '4.5 - 6.7 LPA',
    location: 'Chennai / Hyderabad / Pune',
    eligibleBranches: ['All Branches'],
    notes: 'Mass hiring drive scheduled for phase 2 (Late November/December).',
    createdAt: '2026-08-06T14:00:00.000Z',
    updatedAt: '2026-08-06T14:00:00.000Z',
    hrs: [
      {
        id: 'hr-601',
        name: 'Rajesh Kulkarni',
        designation: 'Regional Campus Lead',
        email: 'rajesh.k@cognizant.com',
        phone: '+91 93411 98765',
        status: 'Not Contacted',
        notes: 'Hold until phase 1 tier-1 drives complete.',
        lastContactedDate: undefined
      }
    ]
  },
  {
    id: 'comp-7',
    name: 'Wipro Technologies',
    industry: 'IT Services',
    website: 'https://wipro.com',
    priorityCategory: 'Low CTC / Call Later',
    status: 'Uncontacted',
    isDone: false,
    ctcPackage: '3.5 - 5.5 LPA',
    location: 'Pan India',
    eligibleBranches: ['All Branches'],
    notes: 'Call later in November after mid-term exams.',
    createdAt: '2026-08-07T08:00:00.000Z',
    updatedAt: '2026-08-07T08:00:00.000Z',
    hrs: [
      {
        id: 'hr-701',
        name: 'Sunita Deshmukh',
        designation: 'University Hiring Lead',
        email: 'sunita.deshmukh@wipro.com',
        phone: '+91 98220 54321',
        status: 'Not Contacted',
        notes: 'Planned follow-up mid-season.',
        lastContactedDate: undefined
      }
    ]
  },
  {
    id: 'comp-8',
    name: 'Atlassian India',
    industry: 'Enterprise Developer Tools',
    website: 'https://atlassian.com/careers',
    priorityCategory: 'Top Priority',
    status: 'Completed',
    isDone: true,
    ctcPackage: '52 LPA (Package + Stocks)',
    location: 'Bengaluru / Remote',
    eligibleBranches: ['CSE', 'IT'],
    notes: 'Drive completed successfully! 8 students bagged full-time FTE offers.',
    createdAt: '2026-07-15T10:00:00.000Z',
    updatedAt: '2026-08-10T18:00:00.000Z',
    hrs: [
      {
        id: 'hr-801',
        name: 'Tarun Saxena',
        designation: 'Director of University Recruiting',
        email: 'tsaxena@atlassian.com',
        phone: '+91 99001 12233',
        status: 'Slot Offered',
        notes: 'Drive wrapped up. Offer letters released via email.',
        lastContactedDate: '2026-08-10'
      }
    ]
  }
];

// Helper to get ISO date strings relative to today
const getFutureISO = (daysAhead: number, hours: number = 10) => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  d.setHours(hours, 0, 0, 0);
  return d.toISOString();
};

const getPastISO = (daysAgo: number, hours: number = 11) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hours, 0, 0, 0);
  return d.toISOString();
};

export const INITIAL_REMINDERS: Reminder[] = [
  {
    id: 'rem-1',
    companyId: 'comp-1',
    companyName: 'Google India',
    hrId: 'hr-101',
    hrName: 'Ananya Sharma',
    title: 'Follow up on Placement Brochure & Batch Strength Matrix',
    dueDateTime: getFutureISO(0, 16), // Today at 4:00 PM
    notes: 'Send the updated CSV containing GPA distribution and student branch count.',
    isCompleted: false,
    priority: 'High',
    createdAt: new Date().toISOString()
  },
  {
    id: 'rem-2',
    companyId: 'comp-3',
    companyName: 'Goldman Sachs',
    hrId: 'hr-301',
    hrName: 'Vikramaditya Roy',
    title: 'Confirm Call Schedule for Quant Profile Discussion',
    dueDateTime: getPastISO(1, 11), // Yesterday (Overdue alert demonstrate!)
    notes: 'Call Vikramaditya to finalize slot for pre-screening call.',
    isCompleted: false,
    priority: 'High',
    createdAt: new Date().toISOString()
  },
  {
    id: 'rem-3',
    companyId: 'comp-5',
    companyName: 'Razorpay',
    hrId: 'hr-501',
    hrName: 'Kavita Menon',
    title: 'Send Zoom link & Auditorium setup details to Kavita',
    dueDateTime: getFutureISO(2, 11), // 2 days later
    notes: 'Check auditorium AV projector setup for PPT.',
    isCompleted: false,
    priority: 'Medium',
    createdAt: new Date().toISOString()
  }
];
