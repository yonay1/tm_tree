import type { OrgNode, BudgetBasket } from '../../types';
import { useStore } from '../../store';

function collectNodeIds(node: OrgNode): string[] {
  const ids = [node.id];
  if (node.children) {
    for (const child of node.children) {
      ids.push(...collectNodeIds(child));
    }
  }
  return ids;
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

export function GlobalCommandBar({
  command,
  baskets,
}: {
  command: OrgNode;
  baskets: BudgetBasket[];
}) {
  const { setSelectedOrgNodeId } = useStore();
  const nodeIds = collectNodeIds(command);
  const cmdBaskets = baskets.filter((b) => nodeIds.includes(b.orgNodeId));

  if (cmdBaskets.length === 0) return null;

  const allocated = cmdBaskets.reduce((s, b) => s + b.allocated, 0);
  const regular = cmdBaskets.reduce((s, b) => s + b.regularUsage, 0);
  const retro = cmdBaskets.reduce((s, b) => s + b.retroactiveUsage, 0);
  const distributed = cmdBaskets.reduce((s, b) => s + b.distributedToChildren, 0);
  const remaining = allocated - regular - retro - distributed;

  const retroPct = (retro / allocated) * 100;
  const isWarning = retroPct > 30;

  return (
    <div
      className={`global-cmd-bar ${isWarning ? 'global-cmd-warning' : ''}`}
      onClick={() => setSelectedOrgNodeId(command.id)}
    >
      <div className="global-cmd-info">
        <span className={`health-dot health-${command.health}`} />
        <span className="global-cmd-name">{command.name}</span>
        <span className="global-cmd-total">{formatCurrency(allocated)}</span>
        {isWarning && <span className="warning-badge">RETRO {retroPct.toFixed(1)}%</span>}
      </div>
      <div className="segment-bar global-segment-bar">
        <div className="threshold-line" style={{ left: '30%' }} />
        <div className="segment segment-regular" style={{ width: `${(regular / allocated) * 100}%` }} />
        <div
          className={`segment segment-retroactive ${isWarning ? 'segment-retro-warning' : ''}`}
          style={{ width: `${retroPct}%` }}
        />
        <div className="segment segment-distributed" style={{ width: `${(distributed / allocated) * 100}%` }} />
        <div className="segment segment-remaining" style={{ width: `${(remaining / allocated) * 100}%` }} />
      </div>
    </div>
  );
}
