import { useStore } from '../../store';
import { DOMAIN_CONFIGS, type Domain } from '../../types';
import { NotificationCenter } from './NotificationCenter';

const domains: Domain[] = ['scholarships', 'ranks', 'incentives', 'separation'];

export function TopBar() {
  const { activeDomain, setActiveDomain, isAdmin, toggleRole } = useStore();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-brand">
          <div className="brand-icon">V</div>
          <div>
            <div className="brand-title">Vanguard</div>
            <div className="brand-subtitle">Budget & Standards Manager</div>
          </div>
        </div>
        <nav className="domain-toggle">
          {domains.map((d) => (
            <button
              key={d}
              className={`domain-btn ${activeDomain === d ? 'active' : ''}`}
              onClick={() => setActiveDomain(d)}
            >
              {DOMAIN_CONFIGS[d].label}
            </button>
          ))}
        </nav>
      </div>
      <div className="topbar-right">
        <button className="role-toggle" onClick={toggleRole} title="Toggle view">
          {isAdmin ? 'Admin View' : 'My Baskets'}
        </button>
        <NotificationCenter />
        <div className="user-avatar" title="Col. Sarah Mitchell">SM</div>
      </div>
    </header>
  );
}
