import { Outlet } from 'react-router-dom';
import { Wrench } from 'lucide-react';
import Sidebar from '../components/Sidebar';

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white/90 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                <Wrench className="text-blue-600" size={32} />
                GearGuard
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">Ultimate Maintenance Tracker</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-slate-500 dark:text-slate-400">Welcome back</p>
                <p className="font-semibold text-slate-700 dark:text-slate-200">Admin User</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-md">
                A
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

