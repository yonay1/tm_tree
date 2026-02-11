import type { OrgNode, Person, BudgetBasket, Notification, Transaction } from '../types';

export const people: Person[] = [
  { id: 'p1', name: 'Col. Sarah Mitchell', avatar: 'SM', role: 'Budget Director' },
  { id: 'p2', name: 'Maj. James Chen', avatar: 'JC', role: 'Finance Officer' },
  { id: 'p3', name: 'Lt. Maria Santos', avatar: 'MS', role: 'Unit Comptroller' },
  { id: 'p4', name: 'Cpt. David Park', avatar: 'DP', role: 'Program Manager' },
  { id: 'p5', name: 'Sgt. Anna Williams', avatar: 'AW', role: 'Budget Analyst' },
  { id: 'p6', name: 'Col. Robert Hayes', avatar: 'RH', role: 'Division Chief' },
];

export const orgTree: OrgNode[] = [
  {
    id: 'cmd1',
    name: 'Northern Command',
    type: 'command',
    health: 'green',
    children: [
      {
        id: 'u1',
        name: '1st Division',
        type: 'unit',
        health: 'green',
        parentId: 'cmd1',
        children: [
          { id: 'su1', name: 'Alpha Battalion', type: 'subunit', health: 'green', parentId: 'u1' },
          { id: 'su2', name: 'Bravo Battalion', type: 'subunit', health: 'amber', parentId: 'u1' },
        ],
      },
      {
        id: 'u2',
        name: '2nd Division',
        type: 'unit',
        health: 'amber',
        parentId: 'cmd1',
        children: [
          { id: 'su3', name: 'Charlie Battalion', type: 'subunit', health: 'red', parentId: 'u2' },
          { id: 'su4', name: 'Delta Battalion', type: 'subunit', health: 'green', parentId: 'u2' },
        ],
      },
    ],
  },
  {
    id: 'cmd2',
    name: 'Southern Command',
    type: 'command',
    health: 'red',
    children: [
      {
        id: 'u3',
        name: '3rd Division',
        type: 'unit',
        health: 'red',
        parentId: 'cmd2',
        children: [
          { id: 'su5', name: 'Echo Battalion', type: 'subunit', health: 'red', parentId: 'u3' },
          { id: 'su6', name: 'Foxtrot Battalion', type: 'subunit', health: 'amber', parentId: 'u3' },
        ],
      },
      {
        id: 'u4',
        name: '4th Division',
        type: 'unit',
        health: 'green',
        parentId: 'cmd2',
        children: [
          { id: 'su7', name: 'Golf Battalion', type: 'subunit', health: 'green', parentId: 'u4' },
        ],
      },
    ],
  },
  {
    id: 'cmd3',
    name: 'Central Command',
    type: 'command',
    health: 'amber',
    children: [
      {
        id: 'u5',
        name: '5th Division',
        type: 'unit',
        health: 'amber',
        parentId: 'cmd3',
        children: [
          { id: 'su8', name: 'Hotel Battalion', type: 'subunit', health: 'amber', parentId: 'u5' },
          { id: 'su9', name: 'India Battalion', type: 'subunit', health: 'green', parentId: 'u5' },
        ],
      },
    ],
  },
];

function makeTx(
  id: string,
  basketId: string,
  type: Transaction['type'],
  amount: number,
  reason: string,
  performedBy: Person,
  date: string,
  balance: number,
  segmentType?: Transaction['segmentType'],
): Transaction {
  return { id, basketId, type, amount, reason, performedBy, date, resultingBalance: balance, segmentType };
}

export const baskets: BudgetBasket[] = [
  {
    id: 'b1',
    name: 'Officer Training Scholarships',
    orgNodeId: 'u1',
    allocated: 500000,
    regularUsage: 120000,
    retroactiveUsage: 45000,
    distributedToChildren: 180000,
    reason: 'FY26 Officer Development',
    isProject: true,
    responsiblePeople: [people[0], people[1]],
    transactions: [
      makeTx('t1', 'b1', 'in', 500000, 'Annual allocation', people[0], '2026-01-05', 500000),
      makeTx('t2', 'b1', 'out', 120000, 'Q1 tuition payments', people[1], '2026-01-15', 380000, 'regular'),
      makeTx('t3', 'b1', 'out', 45000, 'Retroactive stipend adjustments', people[1], '2026-01-20', 335000, 'retroactive'),
      makeTx('t4', 'b1', 'transfer', 180000, 'Distributed to Alpha & Bravo', people[0], '2026-02-01', 155000, 'distributed'),
    ],
  },
  {
    id: 'b2',
    name: 'Enlisted Advancement',
    orgNodeId: 'u1',
    allocated: 300000,
    regularUsage: 85000,
    retroactiveUsage: 110000,
    distributedToChildren: 50000,
    responsiblePeople: [people[2]],
    transactions: [
      makeTx('t5', 'b2', 'in', 300000, 'Annual allocation', people[0], '2026-01-05', 300000),
      makeTx('t6', 'b2', 'out', 85000, 'Promotion bonuses', people[2], '2026-01-18', 215000, 'regular'),
      makeTx('t7', 'b2', 'out', 110000, 'Retroactive rank adjustments', people[2], '2026-02-02', 105000, 'retroactive'),
      makeTx('t8', 'b2', 'transfer', 50000, 'Alpha Bn support', people[2], '2026-02-05', 55000, 'distributed'),
    ],
  },
  {
    id: 'b3',
    name: 'Equipment Incentive Program',
    orgNodeId: 'u2',
    allocated: 750000,
    regularUsage: 320000,
    retroactiveUsage: 80000,
    distributedToChildren: 200000,
    reason: 'Modernization Initiative',
    isProject: true,
    responsiblePeople: [people[3], people[4]],
    transactions: [
      makeTx('t9', 'b3', 'in', 750000, 'Supplemental funding', people[0], '2026-01-10', 750000),
      makeTx('t10', 'b3', 'out', 320000, 'Equipment procurement', people[3], '2026-01-25', 430000, 'regular'),
      makeTx('t11', 'b3', 'out', 80000, 'Retro maintenance contracts', people[4], '2026-02-01', 350000, 'retroactive'),
      makeTx('t12', 'b3', 'transfer', 200000, 'Charlie & Delta distribution', people[3], '2026-02-08', 150000, 'distributed'),
    ],
  },
  {
    id: 'b4',
    name: 'Separation Benefits Fund',
    orgNodeId: 'u3',
    allocated: 400000,
    regularUsage: 95000,
    retroactiveUsage: 155000,
    distributedToChildren: 60000,
    responsiblePeople: [people[5]],
    transactions: [
      makeTx('t13', 'b4', 'in', 400000, 'Annual allocation', people[0], '2026-01-05', 400000),
      makeTx('t14', 'b4', 'out', 95000, 'Standard separation pay', people[5], '2026-01-22', 305000, 'regular'),
      makeTx('t15', 'b4', 'out', 155000, 'Retroactive benefit corrections', people[5], '2026-02-03', 150000, 'retroactive'),
      makeTx('t16', 'b4', 'transfer', 60000, 'Echo Bn allocation', people[5], '2026-02-07', 90000, 'distributed'),
    ],
  },
  {
    id: 'b5',
    name: 'Training Material Grants',
    orgNodeId: 'su1',
    allocated: 100000,
    regularUsage: 35000,
    retroactiveUsage: 8000,
    distributedToChildren: 0,
    responsiblePeople: [people[1]],
    transactions: [
      makeTx('t17', 'b5', 'in', 100000, 'Parent unit transfer', people[0], '2026-02-01', 100000),
      makeTx('t18', 'b5', 'out', 35000, 'Curriculum materials', people[1], '2026-02-05', 65000, 'regular'),
      makeTx('t19', 'b5', 'out', 8000, 'Retro textbook orders', people[1], '2026-02-08', 57000, 'retroactive'),
    ],
  },
  {
    id: 'b6',
    name: 'Readiness Incentives',
    orgNodeId: 'su3',
    allocated: 200000,
    regularUsage: 60000,
    retroactiveUsage: 75000,
    distributedToChildren: 0,
    reason: 'Combat Readiness Bonus',
    isProject: true,
    responsiblePeople: [people[4], people[5]],
    transactions: [
      makeTx('t20', 'b6', 'in', 200000, 'Parent unit transfer', people[3], '2026-02-08', 200000),
      makeTx('t21', 'b6', 'out', 60000, 'Readiness bonuses Q1', people[4], '2026-02-09', 140000, 'regular'),
      makeTx('t22', 'b6', 'out', 75000, 'Retroactive readiness pay', people[5], '2026-02-10', 65000, 'retroactive'),
    ],
  },
];

export const notifications: Notification[] = [
  {
    id: 'n1',
    type: 'threshold',
    message: 'Enlisted Advancement retro usage at 36.7% — exceeds 30% threshold',
    timestamp: '2026-02-10T14:30:00Z',
    read: false,
    basketId: 'b2',
  },
  {
    id: 'n2',
    type: 'threshold',
    message: 'Separation Benefits retro usage at 38.8% — exceeds 30% threshold',
    timestamp: '2026-02-10T12:00:00Z',
    read: false,
    basketId: 'b4',
  },
  {
    id: 'n3',
    type: 'threshold',
    message: 'Readiness Incentives retro usage at 37.5% — exceeds 30% threshold',
    timestamp: '2026-02-10T10:15:00Z',
    read: false,
    basketId: 'b6',
  },
  {
    id: 'n4',
    type: 'allocation',
    message: 'New allocation: $200,000 to Readiness Incentives (Echo Bn)',
    timestamp: '2026-02-08T09:00:00Z',
    read: true,
    basketId: 'b6',
  },
  {
    id: 'n5',
    type: 'transfer',
    message: 'Transfer: $180,000 from Officer Training to Alpha & Bravo Battalions',
    timestamp: '2026-02-01T11:00:00Z',
    read: true,
    basketId: 'b1',
  },
];
