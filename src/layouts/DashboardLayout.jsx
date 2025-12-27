import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { authStore } from '../utils/auth';
import Logo from '../assets/Logo.png';

export default function DashboardLayout() {
  const user = authStore.getUser();
  
  const getUserName = () => {
    return user?.name || 'User';
  };

  const getUserRole = () => {
    if (!user?.role) return 'User';
    
    // Format role: MANAGER -> Manager, TECHNICIAN -> Technician, USER -> User
    const role = user.role.toLowerCase();
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const getAvatarInitial = () => {
    const name = getUserName();
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white/90 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl  text-white shadow-soft">
                  <img src={Logo} alt="GearGuard" className="h-7 w-7 object-contain" />
                </span>
                GearGuard
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Ultimate Maintenance Tracker</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Welcome back</p>
                <p className="font-semibold text-sm text-slate-700 dark:text-slate-200 mt-0.5">{getUserName()}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{getUserRole()}</p>
              </div>
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                {getAvatarInitial()}
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

