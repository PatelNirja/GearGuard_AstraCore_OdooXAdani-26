import { useState, useMemo } from 'react';
import { BarChart3, PieChart, TrendingUp, Users, Package } from 'lucide-react';

const ReportsView = ({ requests, teams, equipment }) => {
  const [reportType, setReportType] = useState('team'); // 'team' or 'category'

  const teamStats = useMemo(() => {
    const stats = {};
    requests.forEach(req => {
      const teamName = req.maintenanceTeam?.name || 'Unassigned';
      if (!stats[teamName]) {
        stats[teamName] = {
          total: 0,
          new: 0,
          inProgress: 0,
          repaired: 0,
          scrap: 0
        };
      }
      stats[teamName].total++;
      stats[teamName][req.stage.toLowerCase().replace(' ', '')] = (stats[teamName][req.stage.toLowerCase().replace(' ', '')] || 0) + 1;
    });
    return stats;
  }, [requests]);

  const categoryStats = useMemo(() => {
    const stats = {};
    requests.forEach(req => {
      const category = req.equipmentCategory || req.equipment?.category || 'Uncategorized';
      if (!stats[category]) {
        stats[category] = {
          total: 0,
          new: 0,
          inProgress: 0,
          repaired: 0,
          scrap: 0
        };
      }
      stats[category].total++;
      stats[category][req.stage.toLowerCase().replace(' ', '')] = (stats[category][req.stage.toLowerCase().replace(' ', '')] || 0) + 1;
    });
    return stats;
  }, [requests]);

  const currentStats = reportType === 'team' ? teamStats : categoryStats;
  const statsArray = Object.entries(currentStats).map(([key, value]) => ({ name: key, ...value }));

  const getMaxValue = () => {
    return Math.max(...statsArray.map(s => s.total), 1);
  };

  const maxValue = getMaxValue();

  const colors = {
    new: 'bg-blue-500',
    inProgress: 'bg-amber-500',
    repaired: 'bg-green-500',
    scrap: 'bg-red-500'
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Maintenance Reports</h2>
          <p className="text-slate-600 mt-1">Analytics and insights for maintenance requests</p>
        </div>
        <div className="flex items-center gap-3 bg-white rounded-lg border border-slate-300 px-3 py-2">
          <button
            onClick={() => setReportType('team')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              reportType === 'team'
                ? 'bg-blue-500 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users size={16} className="inline mr-2" />
            By Team
          </button>
          <button
            onClick={() => setReportType('category')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              reportType === 'category'
                ? 'bg-blue-500 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Package size={16} className="inline mr-2" />
            By Category
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-auto">
        {/* Summary Cards */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <BarChart3 size={20} className="text-blue-600" />
            Summary Statistics
          </h3>
          <div className="space-y-4">
            {statsArray.map((stat) => (
              <div key={stat.name} className="border-b border-slate-200 pb-3 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-slate-700">{stat.name}</span>
                  <span className="text-lg font-bold text-blue-600">{stat.total}</span>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-500 h-full"
                      style={{ width: `${(stat.total / maxValue) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex gap-4 mt-2 text-xs text-slate-600">
                  <span>New: {stat.new}</span>
                  <span>In Progress: {stat.inProgress}</span>
                  <span>Repaired: {stat.repaired}</span>
                  <span>Scrap: {stat.scrap}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-green-600" />
            Request Distribution
          </h3>
          <div className="space-y-4">
            {statsArray.map((stat) => (
              <div key={stat.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-700">{stat.name}</span>
                  <span className="text-sm text-slate-600">{stat.total} requests</span>
                </div>
                <div className="flex gap-1 h-8 rounded overflow-hidden">
                  <div
                    className={colors.new}
                    style={{ width: `${(stat.new / stat.total) * 100}%` }}
                    title={`New: ${stat.new}`}
                  />
                  <div
                    className={colors.inProgress}
                    style={{ width: `${(stat.inProgress / stat.total) * 100}%` }}
                    title={`In Progress: ${stat.inProgress}`}
                  />
                  <div
                    className={colors.repaired}
                    style={{ width: `${(stat.repaired / stat.total) * 100}%` }}
                    title={`Repaired: ${stat.repaired}`}
                  />
                  <div
                    className={colors.scrap}
                    style={{ width: `${(stat.scrap / stat.total) * 100}%` }}
                    title={`Scrap: ${stat.scrap}`}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-6 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-xs text-slate-600">New</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-500 rounded"></div>
              <span className="text-xs text-slate-600">In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-xs text-slate-600">Repaired</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-xs text-slate-600">Scrap</span>
            </div>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <PieChart size={20} className="text-purple-600" />
            Detailed Breakdown
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">
                    {reportType === 'team' ? 'Team Name' : 'Category'}
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Total</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">New</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">In Progress</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Repaired</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Scrap</th>
                </tr>
              </thead>
              <tbody>
                {statsArray.map((stat) => (
                  <tr key={stat.name} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-800">{stat.name}</td>
                    <td className="text-center py-3 px-4">
                      <span className="font-bold text-blue-600">{stat.total}</span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">
                        {stat.new}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-sm font-medium">
                        {stat.inProgress}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm font-medium">
                        {stat.repaired}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm font-medium">
                        {stat.scrap}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;

