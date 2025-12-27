import { LayoutGrid, Calendar, Package, Users, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ activeView, setActiveView }) => {
  const { isManager, isTechnician, isEmployee } = useAuth();
  
  const menuItems = [
    { id: 'kanban', label: 'Kanban Board', icon: LayoutGrid, roles: ['Employee', 'Manager', 'Technician'] },
    { id: 'calendar', label: 'Calendar', icon: Calendar, roles: ['Employee', 'Manager', 'Technician'] },
    { id: 'equipment', label: 'Equipment', icon: Package, roles: ['Employee', 'Manager', 'Technician'] },
    { id: 'teams', label: 'Teams', icon: Users, roles: ['Manager'] },
    { id: 'reports', label: 'Reports', icon: BarChart3, roles: ['Manager'] }
  ].filter(item => {
    if (isManager) return true;
    if (isTechnician) return item.roles.includes('Technician');
    if (isEmployee) return item.roles.includes('Employee');
    return false;
  });

  return (
    <div className="w-64 bg-white shadow-lg border-r border-slate-200">
      <div className="p-6">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
