import { useStore } from '../../store';
import { DOMAIN_CONFIGS } from '../../types';
import type { OrgNode, BudgetBasket } from '../../types';
import { BasketCard } from './BasketCard';
import { GlobalCommandBar } from './GlobalCommandBar';

function collectNodeIds(nodes: OrgNode[]): string[] {
  return nodes.reduce<string[]>((acc, n) => {
    acc.push(n.id);
    if (n.children) acc.push(...collectNodeIds(n.children));
    return acc;
  }, []);
}

function findNode(nodes: OrgNode[], id: string): OrgNode | null {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children) {
      const found = findNode(n.children, id);
      if (found) return found;
    }
  }
  return null;
}

export function Dashboard() {
  const { activeDomain, isAdmin, selectedOrgNodeId, orgTree, baskets, currentUserId } = useStore();
  const config = DOMAIN_CONFIGS[activeDomain];

  // Determine which baskets to show
  let visibleBaskets: BudgetBasket[];

  if (!isAdmin) {
    // My Baskets view: show only baskets where current user is responsible
    visibleBaskets = baskets.filter((b) =>
      b.responsiblePeople.some((p) => p.id === currentUserId),
    );
  } else if (selectedOrgNodeId) {
    // Selected node: show baskets for that node and its descendants
    const node = findNode(orgTree, selectedOrgNodeId);
    if (node) {
      const nodeIds = collectNodeIds([node]);
      visibleBaskets = baskets.filter((b) => nodeIds.includes(b.orgNodeId));
    } else {
      visibleBaskets = [];
    }
  } else {
    visibleBaskets = baskets;
  }

  const selectedNode = selectedOrgNodeId ? findNode(orgTree, selectedOrgNodeId) : null;

  // Calculate totals
  const totalAllocated = visibleBaskets.reduce((s, b) => s + b.allocated, 0);
  const totalRegular = visibleBaskets.reduce((s, b) => s + b.regularUsage, 0);
  const totalRetro = visibleBaskets.reduce((s, b) => s + b.retroactiveUsage, 0);
  const totalDistributed = visibleBaskets.reduce((s, b) => s + b.distributedToChildren, 0);
  const totalRemaining = totalAllocated - totalRegular - totalRetro - totalDistributed;

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

  return (
    <main className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2 className="dashboard-title">
            {!isAdmin
              ? 'My Baskets'
              : selectedNode
                ? selectedNode.name
                : `${config.label} — All Commands`}
          </h2>
          <p className="dashboard-subtitle">
            {!isAdmin
              ? 'Budget categories you are responsible for'
              : selectedNode
                ? `${config.hierarchy[orgTree.some((c) => c.id === selectedOrgNodeId) ? 0 : 1]} level view`
                : 'Global overview across all organizational units'}
          </p>
        </div>
        <div className="dashboard-summary">
          <div className="summary-stat">
            <span className="stat-label">Total Allocated</span>
            <span className="stat-value">{fmt(totalAllocated)}</span>
          </div>
          <div className="summary-stat">
            <span className="stat-label">Regular Usage</span>
            <span className="stat-value stat-regular">{fmt(totalRegular)}</span>
          </div>
          <div className="summary-stat">
            <span className="stat-label">Retroactive</span>
            <span className="stat-value stat-retro">{fmt(totalRetro)}</span>
          </div>
          <div className="summary-stat">
            <span className="stat-label">Remaining</span>
            <span className="stat-value stat-remaining">{fmt(totalRemaining)}</span>
          </div>
        </div>
      </div>

      {/* Global stacked bars for admin at top level */}
      {isAdmin && !selectedOrgNodeId && (
        <div className="global-bars-section">
          {orgTree.map((cmd) => (
            <GlobalCommandBar key={cmd.id} command={cmd} baskets={baskets} />
          ))}
        </div>
      )}

      {/* Basket cards */}
      {visibleBaskets.length > 0 ? (
        <div className="basket-grid">
          {visibleBaskets.map((b) => (
            <BasketCard key={b.id} basket={b} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">$</div>
          <p>No budget baskets found for the selected view.</p>
        </div>
      )}
    </main>
  );
}
