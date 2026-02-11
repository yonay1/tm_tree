import { useState, useRef, useEffect } from 'react';
import { useStore } from '../../store';

export function NotificationCenter() {
  const { notifications, unreadCount, markNotificationRead, markAllRead } = useStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = unreadCount();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const typeIcon = (type: string) => {
    switch (type) {
      case 'threshold': return '!';
      case 'allocation': return '+';
      case 'transfer': return '~';
      default: return '?';
    }
  };

  const typeClass = (type: string) => {
    switch (type) {
      case 'threshold': return 'notif-threshold';
      case 'allocation': return 'notif-allocation';
      case 'transfer': return 'notif-transfer';
      default: return '';
    }
  };

  return (
    <div className="notification-center" ref={ref}>
      <button className="notif-bell" onClick={() => setOpen(!open)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {count > 0 && <span className="notif-badge">{count}</span>}
      </button>
      {open && (
        <div className="notif-dropdown">
          <div className="notif-header">
            <span>Notifications</span>
            {count > 0 && (
              <button className="notif-mark-all" onClick={markAllRead}>
                Mark all read
              </button>
            )}
          </div>
          <div className="notif-list">
            {notifications.length === 0 && (
              <div className="notif-empty">No notifications</div>
            )}
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`notif-item ${!n.read ? 'unread' : ''} ${typeClass(n.type)}`}
                onClick={() => markNotificationRead(n.id)}
              >
                <div className={`notif-type-icon ${typeClass(n.type)}`}>
                  {typeIcon(n.type)}
                </div>
                <div className="notif-content">
                  <div className="notif-message">{n.message}</div>
                  <div className="notif-time">
                    {new Date(n.timestamp).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
                {!n.read && <div className="notif-dot" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
