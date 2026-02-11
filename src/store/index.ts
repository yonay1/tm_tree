import { create } from 'zustand';
import type { Domain, BudgetBasket, Notification, OrgNode, Transaction, SegmentType } from '../types';
import { baskets as mockBaskets, notifications as mockNotifications, orgTree as mockOrgTree } from '../data/mock';

interface AppState {
  // Navigation
  activeDomain: Domain;
  setActiveDomain: (domain: Domain) => void;

  // Sidebar
  selectedOrgNodeId: string | null;
  setSelectedOrgNodeId: (id: string | null) => void;
  sidebarSearchQuery: string;
  setSidebarSearchQuery: (query: string) => void;
  sidebarCollapsed: Record<string, boolean>;
  toggleSidebarNode: (id: string) => void;

  // Org Tree
  orgTree: OrgNode[];

  // Baskets
  baskets: BudgetBasket[];
  getBasketsForNode: (nodeId: string) => BudgetBasket[];

  // Notifications
  notifications: Notification[];
  unreadCount: () => number;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;

  // Drawer
  drawerOpen: boolean;
  drawerBasketId: string | null;
  drawerSegmentType: SegmentType | null;
  openDrawer: (basketId: string, segmentType: SegmentType) => void;
  closeDrawer: () => void;

  // Transaction History filter
  historyFilter: {
    type: 'all' | Transaction['type'];
    search: string;
  };
  setHistoryFilterType: (type: 'all' | Transaction['type']) => void;
  setHistorySearch: (search: string) => void;

  // User role
  isAdmin: boolean;
  currentUserId: string;
  toggleRole: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  // Navigation
  activeDomain: 'scholarships',
  setActiveDomain: (domain) => set({ activeDomain: domain }),

  // Sidebar
  selectedOrgNodeId: null,
  setSelectedOrgNodeId: (id) => set({ selectedOrgNodeId: id }),
  sidebarSearchQuery: '',
  setSidebarSearchQuery: (query) => set({ sidebarSearchQuery: query }),
  sidebarCollapsed: {},
  toggleSidebarNode: (id) =>
    set((state) => ({
      sidebarCollapsed: {
        ...state.sidebarCollapsed,
        [id]: !state.sidebarCollapsed[id],
      },
    })),

  // Org Tree
  orgTree: mockOrgTree,

  // Baskets
  baskets: mockBaskets,
  getBasketsForNode: (nodeId) => {
    return get().baskets.filter((b) => b.orgNodeId === nodeId);
  },

  // Notifications
  notifications: mockNotifications,
  unreadCount: () => get().notifications.filter((n) => !n.read).length,
  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      ),
    })),
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),

  // Drawer
  drawerOpen: false,
  drawerBasketId: null,
  drawerSegmentType: null,
  openDrawer: (basketId, segmentType) =>
    set({ drawerOpen: true, drawerBasketId: basketId, drawerSegmentType: segmentType }),
  closeDrawer: () =>
    set({ drawerOpen: false, drawerBasketId: null, drawerSegmentType: null }),

  // Transaction History filter
  historyFilter: { type: 'all', search: '' },
  setHistoryFilterType: (type) =>
    set((state) => ({ historyFilter: { ...state.historyFilter, type } })),
  setHistorySearch: (search) =>
    set((state) => ({ historyFilter: { ...state.historyFilter, search } })),

  // User role
  isAdmin: true,
  currentUserId: 'p1',
  toggleRole: () => set((state) => ({ isAdmin: !state.isAdmin })),
}));
