export interface ProductionProject {
  id: string;
  title: string;
  description: string;
  status: ProductionStatus;
  startDate: Date;
  endDate: Date;
  budget: Budget;
  schedule: Schedule;
  team: TeamMember[];
  equipment: EquipmentItem[];
  locations: Location[];
  documents: Document[];
  milestones: Milestone[];
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ProductionStatus = 
  | 'pre-production'
  | 'production'
  | 'post-production'
  | 'completed'
  | 'on-hold'
  | 'cancelled';

export interface Budget {
  totalBudget: number;
  allocatedBudget: number;
  remainingBudget: number;
  categories: BudgetCategory[];
  expenses: Expense[];
  currency: string;
  lastUpdated: Date;
}

export interface BudgetCategory {
  id: string;
  name: string;
  allocation: number;
  spent: number;
  remaining: number;
  notes: string;
}

export interface Expense {
  id: string;
  categoryId: string;
  description: string;
  amount: number;
  date: Date;
  receipt?: string;
  status: 'pending' | 'approved' | 'rejected' | 'reimbursed';
  submittedBy: string;
  approvedBy?: string;
  notes: string;
}

export interface Schedule {
  shootDays: ShootDay[];
  preProductionTasks: Task[];
  postProductionTasks: Task[];
  distributionTasks: Task[];
}

export interface ShootDay {
  id: string;
  date: Date;
  locationId: string;
  callTime: string;
  wrapTime: string;
  scenes: Scene[];
  teamMembers: string[]; // TeamMember IDs
  equipment: string[]; // EquipmentItem IDs
  status: 'scheduled' | 'completed' | 'cancelled' | 'postponed';
  notes: string;
}

export interface Scene {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  shotList: Shot[];
  status: 'planned' | 'shot' | 'reshot-needed' | 'completed';
  notes: string;
}

export interface Shot {
  id: string;
  shotNumber: string;
  description: string;
  shotType: string;
  angle: string;
  equipment: string[];
  duration: number; // in minutes
  status: 'planned' | 'shot' | 'reshot-needed' | 'completed';
  notes: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string[]; // TeamMember IDs
  startDate: Date;
  dueDate: Date;
  status: 'not-started' | 'in-progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dependencies: string[]; // Task IDs
  progress: number; // 0-100
  notes: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  rate: {
    amount: number;
    unit: 'hourly' | 'daily' | 'weekly' | 'flat';
  };
  availability: Availability[];
  skills: string[];
  documents: string[]; // Document IDs
  notes: string;
}

export interface Availability {
  date: Date;
  startTime: string;
  endTime: string;
  status: 'available' | 'unavailable' | 'tentative';
}

export interface EquipmentItem {
  id: string;
  name: string;
  category: 'camera' | 'lens' | 'audio' | 'lighting' | 'grip' | 'other';
  description: string;
  serialNumber?: string;
  owner: 'owned' | 'rented' | 'borrowed';
  cost: number;
  rentalPeriod?: {
    startDate: Date;
    endDate: Date;
    vendor: string;
  };
  status: 'available' | 'in-use' | 'maintenance' | 'lost' | 'damaged';
  assignedTo?: string; // TeamMember ID
  notes: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  permitRequired: boolean;
  permitStatus?: 'not-applied' | 'pending' | 'approved' | 'denied';
  permitCost?: number;
  permitDocuments?: string[]; // Document IDs
  facilities: string[];
  restrictions: string[];
  notes: string;
}

export interface Document {
  id: string;
  title: string;
  type: DocumentType;
  fileUrl?: string;
  content?: string;
  createdBy: string; // TeamMember ID
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'final' | 'signed' | 'expired';
  sharedWith: string[]; // TeamMember IDs
  notes: string;
}

export type DocumentType = 
  | 'contract'
  | 'release-form'
  | 'permit'
  | 'call-sheet'
  | 'shot-list'
  | 'budget'
  | 'schedule'
  | 'script'
  | 'storyboard'
  | 'other';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  status: 'not-started' | 'in-progress' | 'completed' | 'overdue';
  dependencies: string[]; // Milestone IDs
  tasks: string[]; // Task IDs
  notes: string;
}

export interface LegalCompliance {
  id: string;
  title: string;
  description: string;
  category: 'permit' | 'release' | 'copyright' | 'insurance' | 'safety' | 'other';
  status: 'pending' | 'completed' | 'not-required' | 'issue';
  dueDate?: Date;
  assignedTo: string; // TeamMember ID
  documents: string[]; // Document IDs
  notes: string;
}

export interface DistributionPlan {
  id: string;
  title: string;
  platforms: DistributionPlatform[];
  timeline: DistributionTimeline[];
  marketingTasks: Task[];
  budget: number;
  status: 'planning' | 'in-progress' | 'completed';
  notes: string;
}

export interface DistributionPlatform {
  id: string;
  name: string;
  type: 'festival' | 'streaming' | 'broadcast' | 'theatrical' | 'educational' | 'other';
  submissionDeadline?: Date;
  submissionFee?: number;
  submissionStatus?: 'not-submitted' | 'submitted' | 'accepted' | 'rejected';
  releaseDate?: Date;
  notes: string;
}

export interface DistributionTimeline {
  id: string;
  phase: string;
  startDate: Date;
  endDate: Date;
  tasks: string[]; // Task IDs
  status: 'not-started' | 'in-progress' | 'completed';
  notes: string;
}

export interface ProductionReport {
  id: string;
  date: Date;
  shootDayId?: string;
  createdBy: string; // TeamMember ID
  scenes: {
    sceneId: string;
    completed: boolean;
    issues?: string;
  }[];
  equipment: {
    equipmentId: string;
    issues?: string;
  }[];
  hours: {
    callTime: string;
    wrapTime: string;
    mealBreaks: string[];
    totalHours: number;
  };
  notes: string;
}

export interface CallSheet {
  id: string;
  shootDayId: string;
  date: Date;
  generalCallTime: string;
  location: {
    name: string;
    address: string;
    parkingInfo?: string;
    nearestHospital?: string;
  };
  schedule: {
    time: string;
    description: string;
  }[];
  crew: {
    department: string;
    members: {
      name: string;
      role: string;
      callTime: string;
      contact: string;
    }[];
  }[];
  equipment: {
    category: string;
    items: string[];
  }[];
  notes: string;
  weather?: {
    forecast: string;
    sunrise: string;
    sunset: string;
    temperature: string;
  };
  contacts: {
    name: string;
    role: string;
    phone: string;
  }[];
  status: 'draft' | 'final' | 'distributed';
}