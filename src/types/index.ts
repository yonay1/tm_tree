export type Domain = 'scholarships' | 'ranks' | 'incentives' | 'separation';

export interface DomainConfig {
  label: string;
  singular: string;
  hierarchy: string[];
}

export const DOMAIN_CONFIGS: Record<Domain, DomainConfig> = {
  scholarships: {
    label: 'Scholarships',
    singular: 'Scholarship',
    hierarchy: ['Program', 'Track', 'Cohort'],
  },
  ranks: {
    label: 'Ranks',
    singular: 'Rank',
    hierarchy: ['Grade', 'Step', 'Level'],
  },
  incentives: {
    label: 'Incentives',
    singular: 'Incentive',
    hierarchy: ['Category', 'Tier', 'Package'],
  },
  separation: {
    label: 'Separation',
    singular: 'Separation',
    hierarchy: ['Type', 'Phase', 'Stage'],
  },
};

export type HealthStatus = 'green' | 'amber' | 'red';

export interface OrgNode {
  id: string;
  name: string;
  type: 'command' | 'unit' | 'subunit';
  health: HealthStatus;
  children?: OrgNode[];
  parentId?: string;
}

export interface Person {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

export interface Transaction {
  id: string;
  date: string;
  type: 'in' | 'out' | 'transfer';
  amount: number;
  reason: string;
  performedBy: Person;
  resultingBalance: number;
  basketId: string;
  segmentType?: SegmentType;
}

export type SegmentType = 'regular' | 'retroactive' | 'distributed' | 'remaining';

export interface BudgetBasket {
  id: string;
  name: string;
  orgNodeId: string;
  allocated: number;
  regularUsage: number;
  retroactiveUsage: number;
  distributedToChildren: number;
  reason?: string;
  isProject?: boolean;
  responsiblePeople: Person[];
  transactions: Transaction[];
}

export interface Notification {
  id: string;
  type: 'threshold' | 'allocation' | 'transfer';
  message: string;
  timestamp: string;
  read: boolean;
  basketId?: string;
}
