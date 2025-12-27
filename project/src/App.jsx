import { useState, useEffect } from 'react';
import { Settings, Wrench, Calendar, LayoutGrid, LogOut } from 'lucide-react';
import Sidebar from './components/Sidebar';
import EquipmentManager from './components/EquipmentManager';
import TeamManager from './components/TeamManager';
import KanbanBoard from './components/KanbanBoard';
import CalendarView from './components/CalendarView';
import ReportsView from './components/ReportsView';
import Login from './components/Login';
import Register from './components/Register';
import { useAuth } from './context/AuthContext';
import { api } from './utils/api';

function App() {
  const { user, loading: authLoading, logout, isAuthenticated } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [activeView, setActiveView] = useState('kanban');
  const [teams, setTeams] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [teamsData, equipmentData, requestsData] = await Promise.all([
        api.teams.getAll(),
        api.equipment.getAll(),
        api.requests.getAll()
      ]);
      setTeams(teamsData);
      setEquipment(equipmentData);
      setRequests(requestsData);
    } catch (error) {
      console.error('Error loading data:', error);
      if (error.message.includes('token') || error.message.includes('authorization')) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  // Show login/register if not authenticated
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return showRegister ? (
      <Register onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <Login onSwitchToRegister={() => setShowRegister(true)} />
    );
  }

  const renderView = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    switch (activeView) {
      case 'kanban':
        return <KanbanBoard requests={requests} equipment={equipment} teams={teams} onUpdate={loadData} />;
      case 'calendar':
        return <CalendarView requests={requests} equipment={equipment} teams={teams} onUpdate={loadData} />;
      case 'equipment':
        return <EquipmentManager equipment={equipment} teams={teams} onUpdate={loadData} />;
      case 'teams':
        return <TeamManager teams={teams} onUpdate={loadData} />;
      case 'reports':
        return <ReportsView requests={requests} equipment={equipment} teams={teams} />;
      default:
        return <KanbanBoard requests={requests} equipment={equipment} teams={teams} onUpdate={loadData} />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-slate-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                <Wrench className="text-blue-600" size={32} />
                GearGuard
              </h1>
              <p className="text-slate-600 mt-1">Ultimate Maintenance Tracker</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-slate-500">Welcome back</p>
                <p className="font-semibold text-slate-700">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.role}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-md">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-8">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

export default App;
