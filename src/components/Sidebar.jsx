import { Calendar, LayoutGrid, LogOut, Package, Users, Home } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { authStore } from '../utils/auth';

const Sidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/requests', label: 'Requests', icon: LayoutGrid },
    { path: '/calendar', label: 'Calendar', icon: Calendar },
    { path: '/equipment', label: 'Equipment', icon: Package },
    { path: '/teams', label: 'Teams', icon: Users }
  ];

  const onLogout = () => {
    authStore.clear();
    navigate('/auth/login', { replace: true });
  };

  return (
    <div className="w-64 bg-white dark:bg-slate-950 shadow-lg border-r border-slate-200 dark:border-slate-800 flex flex-col">
      <div className="p-6 flex-1">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`
                }
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-6 border-t border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
