import { useStore } from '../../store';
import type { SegmentType } from '../../types';

const segmentLabels: Record<SegmentType, string> = {
  regular: 'Regular Internal Usage',
  retroactive: 'Retroactive Internal Usage',
  distributed: 'Distributed to Children',
  remaining: 'Remaining Buffer',
};

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

export function AuditDrawer() {
  const { drawerOpen, drawerBasketId, drawerSegmentType, closeDrawer, baskets } = useStore();

  if (!drawerOpen || !drawerBasketId || !drawerSegmentType) return null;

  const basket = baskets.find((b) => b.id === drawerBasketId);
  if (!basket) return null;

  // Filter transactions by segment type
  const transactions = basket.transactions.filter((t) => {
    if (drawerSegmentType === 'remaining') return false; // no transactions for remaining
    return t.segmentType === drawerSegmentType;
  });

  const segmentValue = (() => {
    switch (drawerSegmentType) {
      case 'regular': return basket.regularUsage;
      case 'retroactive': return basket.retroactiveUsage;
      case 'distributed': return basket.distributedToChildren;
      case 'remaining': return basket.allocated - basket.regularUsage - basket.retroactiveUsage - basket.distributedToChildren;
    }
  })();

  return (
    <>
      <div className="drawer-overlay" onClick={closeDrawer} />
      <div className="audit-drawer">
        <div className="drawer-header">
          <div>
            <h3>{basket.name}</h3>
            <div className={`drawer-segment-label segment-color-${drawerSegmentType}`}>
              {segmentLabels[drawerSegmentType]}
            </div>
          </div>
          <button className="drawer-close" onClick={closeDrawer}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <div className="drawer-summary">
          <div className="drawer-stat">
            <span>Segment Total</span>
            <strong>{formatCurrency(segmentValue)}</strong>
          </div>
          <div className="drawer-stat">
            <span>% of Allocated</span>
            <strong>{((segmentValue / basket.allocated) * 100).toFixed(1)}%</strong>
          </div>
          <div className="drawer-stat">
            <span>Transactions</span>
            <strong>{transactions.length}</strong>
          </div>
        </div>

        <div className="drawer-transactions">
          <h4>Transaction Detail</h4>
          {transactions.length === 0 ? (
            <div className="drawer-empty">No individual transactions for this segment.</div>
          ) : (
            <div className="tx-list">
              {transactions.map((tx) => (
                <div key={tx.id} className="tx-item">
                  <div className="tx-avatar">{tx.performedBy.avatar}</div>
                  <div className="tx-detail">
                    <div className="tx-name">{tx.performedBy.name}</div>
                    <div className="tx-reason">{tx.reason}</div>
                    <div className="tx-date">
                      {new Date(tx.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                  <div className="tx-amount">
                    <span className={`tx-type tx-type-${tx.type}`}>
                      {tx.type === 'in' ? '+' : tx.type === 'out' ? '-' : '~'}
                    </span>
                    {formatCurrency(tx.amount)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
