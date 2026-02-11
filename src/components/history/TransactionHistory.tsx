import { useStore } from '../../store';
import type { Transaction } from '../../types';

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

const typeLabels: Record<Transaction['type'], string> = {
  in: 'Allocation In',
  out: 'Usage Out',
  transfer: 'Transfer',
};

export function TransactionHistory() {
  const { baskets, historyFilter, setHistoryFilterType, setHistorySearch } = useStore();

  // Collect all transactions
  const allTransactions = baskets
    .flatMap((b) =>
      b.transactions.map((t) => ({ ...t, basketName: b.name })),
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Apply filters
  const filtered = allTransactions.filter((tx) => {
    if (historyFilter.type !== 'all' && tx.type !== historyFilter.type) return false;
    if (historyFilter.search) {
      const q = historyFilter.search.toLowerCase();
      return (
        tx.reason.toLowerCase().includes(q) ||
        tx.performedBy.name.toLowerCase().includes(q) ||
        tx.basketName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <section className="transaction-history">
      <div className="history-header">
        <h3>Master Transaction History</h3>
        <div className="history-filters">
          <div className="filter-tabs">
            {(['all', 'in', 'out', 'transfer'] as const).map((t) => (
              <button
                key={t}
                className={`filter-tab ${historyFilter.type === t ? 'active' : ''}`}
                onClick={() => setHistoryFilterType(t)}
              >
                {t === 'all' ? 'All' : typeLabels[t]}
              </button>
            ))}
          </div>
          <div className="filter-search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Filter by reason, person, basket..."
              value={historyFilter.search}
              onChange={(e) => setHistorySearch(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="history-table-wrapper">
        <table className="history-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Action</th>
              <th>Basket</th>
              <th>Amount</th>
              <th>Reason</th>
              <th>Performed By</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((tx) => (
              <tr key={tx.id}>
                <td className="td-date">
                  {new Date(tx.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>
                <td>
                  <span className={`action-badge action-${tx.type}`}>
                    {typeLabels[tx.type]}
                  </span>
                </td>
                <td className="td-basket">{tx.basketName}</td>
                <td className={`td-amount ${tx.type === 'in' ? 'amount-in' : 'amount-out'}`}>
                  {tx.type === 'in' ? '+' : '-'}{formatCurrency(tx.amount)}
                </td>
                <td className="td-reason">
                  <span className="reason-tag">{tx.reason}</span>
                </td>
                <td className="td-person">
                  <span className="person-avatar-sm">{tx.performedBy.avatar}</span>
                  {tx.performedBy.name}
                </td>
                <td className="td-balance">{formatCurrency(tx.resultingBalance)}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="table-empty">
                  No transactions match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="history-footer">
        Showing {filtered.length} of {allTransactions.length} transactions
      </div>
    </section>
  );
}
