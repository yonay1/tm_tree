import { useStore } from '../../store';
import type { BudgetBasket, SegmentType } from '../../types';

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function SegmentBar({
  basket,
  onSegmentClick,
}: {
  basket: BudgetBasket;
  onSegmentClick: (segment: SegmentType) => void;
}) {
  const { allocated, regularUsage, retroactiveUsage, distributedToChildren } = basket;
  const remaining = allocated - regularUsage - retroactiveUsage - distributedToChildren;
  const retroPct = (retroactiveUsage / allocated) * 100;
  const isRetroWarning = retroPct > 30;

  const segments: { type: SegmentType; value: number; pct: number; label: string }[] = [
    { type: 'regular', value: regularUsage, pct: (regularUsage / allocated) * 100, label: 'Regular' },
    { type: 'retroactive', value: retroactiveUsage, pct: retroPct, label: 'Retroactive' },
    { type: 'distributed', value: distributedToChildren, pct: (distributedToChildren / allocated) * 100, label: 'Distributed' },
    { type: 'remaining', value: remaining, pct: (remaining / allocated) * 100, label: 'Remaining' },
  ];

  return (
    <div className="segment-bar-container">
      <div className="segment-bar">
        {/* 30% threshold line */}
        <div className="threshold-line" style={{ left: '30%' }} />
        {segments.map((seg) =>
          seg.pct > 0 ? (
            <div
              key={seg.type}
              className={`segment segment-${seg.type} ${seg.type === 'retroactive' && isRetroWarning ? 'segment-retro-warning' : ''}`}
              style={{ width: `${seg.pct}%` }}
              onClick={() => onSegmentClick(seg.type)}
              title={`${seg.label}: ${formatCurrency(seg.value)} (${seg.pct.toFixed(1)}%)`}
            />
          ) : null,
        )}
      </div>
      <div className="segment-legend">
        {segments.map((seg) => (
          <div key={seg.type} className="legend-item">
            <span className={`legend-dot legend-${seg.type} ${seg.type === 'retroactive' && isRetroWarning ? 'legend-retro-warning' : ''}`} />
            <span className="legend-label">{seg.label}</span>
            <span className="legend-value">{formatCurrency(seg.value)}</span>
            <span className="legend-pct">{seg.pct.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BasketCard({ basket }: { basket: BudgetBasket }) {
  const { openDrawer } = useStore();
  const retroPct = (basket.retroactiveUsage / basket.allocated) * 100;

  return (
    <div className={`basket-card ${retroPct > 30 ? 'basket-warning' : ''}`}>
      <div className="basket-header">
        <div className="basket-title-row">
          {basket.isProject && <span className="project-icon" title="Project">P</span>}
          <h4 className="basket-name">{basket.name}</h4>
          {retroPct > 30 && <span className="warning-badge">RETRO &gt;30%</span>}
        </div>
        <div className="basket-meta">
          <span className="basket-allocated">
            Allocated: <strong>{formatCurrency(basket.allocated)}</strong>
          </span>
          {basket.reason && <span className="basket-reason">{basket.reason}</span>}
        </div>
      </div>

      <SegmentBar basket={basket} onSegmentClick={(seg) => openDrawer(basket.id, seg)} />

      {basket.responsiblePeople.length > 0 && (
        <div className="basket-people">
          {basket.responsiblePeople.map((p) => (
            <div key={p.id} className="person-chip" title={`${p.name} — ${p.role}`}>
              <span className="person-avatar">{p.avatar}</span>
              <span className="person-name">{p.name.split(' ').pop()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
