import { TopBar } from './components/navigation/TopBar';
import { Sidebar } from './components/navigation/Sidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { AuditDrawer } from './components/drawer/AuditDrawer';
import { TransactionHistory } from './components/history/TransactionHistory';
import './App.css';

function App() {
  return (
    <div className="app">
      <TopBar />
      <div className="app-body">
        <Sidebar />
        <div className="main-content">
          <Dashboard />
          <TransactionHistory />
        </div>
      </div>
      <AuditDrawer />
    </div>
  );
}

export default App;
