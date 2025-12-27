import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { LayoutGrid, Calendar, Package, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState({
    teams: 0,
    equipment: 0,
    requests: 0,
    activeRequests: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [teams, equipment, requests] = await Promise.all([
        api.teams.getAll(),
        api.equipment.getAll(),
        api.requests.getAll()
      ]);
      
      setStats({
        teams: teams.length,
        equipment: equipment.length,
        requests: requests.length,
        activeRequests: requests.filter(r => r.stage !== 'Repaired' && r.stage !== 'Scrap').length
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statCards = [
    { label: 'Teams', value: stats.teams, icon: Users, color: 'from-green-500 to-green-600', link: '/teams' },
    { label: 'Equipment', value: stats.equipment, icon: Package, color: 'from-blue-500 to-blue-600', link: '/equipment' },
    { label: 'Total Requests', value: stats.requests, icon: LayoutGrid, color: 'from-purple-500 to-purple-600', link: '/requests' },
    { label: 'Active Requests', value: stats.activeRequests, icon: Calendar, color: 'from-amber-500 to-amber-600', link: '/requests' }
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Dashboard</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Overview of your maintenance operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              to={stat.link}
              className="bg-white dark:bg-slate-900 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-2">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

