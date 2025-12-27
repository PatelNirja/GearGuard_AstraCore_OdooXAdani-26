import { useState, useEffect } from 'react';
import { BarChart3, PieChart, TrendingUp } from 'lucide-react';
import { api } from '../utils/api';

const ReportsView = () => {
  const [requests, setRequests] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState('team'); // 'team' or 'category'

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [requestsData, teamsData] = await Promise.all([
        api.requests.getAll(),
        api.teams.getAll()
      ]);
      setRequests(requestsData);
      setTeams(teamsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRequestsByTeam = () => {
    const teamCounts = {};
    teams.forEach(team => {
      teamCounts[team._id] = {
        name: team.name,
        count: 0
      };
    });
    
    requests.forEach(req => {
      if (req.maintenanceTeam && req.maintenanceTeam._id) {
        const teamId = req.maintenanceTeam._id;
        if (teamCounts[teamId]) {
          teamCounts[teamId].count++;
        } else {
          teamCounts[teamId] = {
            name: req.maintenanceTeam.name || 'Unknown',
            count: 1
          };
        }
      }
    });

    return Object.values(teamCounts).filter(t => t.count > 0).sort((a, b) => b.count - a.count);
  };

  const getRequestsByCategory = () => {
    const categoryCounts = {};
    
    requests.forEach(req => {
      const category = req.equipmentCategory || req.equipment?.category || 'Unknown';
      if (categoryCounts[category]) {
        categoryCounts[category]++;
      } else {
        categoryCounts[category] = 1;
      }
    });

    return Object.entries(categoryCounts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
  };

  const getMaxCount = (data) => {
    return Math.max(...data.map(item => item.count), 1);
  };

  const getColorForIndex = (index) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-red-500',
      'bg-teal-500'
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const teamData = getRequestsByTeam();
  const categoryData = getRequestsByCategory();
  const displayData = viewType === 'team' ? teamData : categoryData;
  const maxCount = getMaxCount(displayData);

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Maintenance Reports</h2>
        <p className="text-slate-600 mt-1">Analyze requests by team or equipment category</p>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setViewType('team')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            viewType === 'team'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-2">
            <TrendingUp size={20} />
            By Team
          </div>
        </button>
        <button
          onClick={() => setViewType('category')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            viewType === 'category'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-2">
            <PieChart size={20} />
            By Category
          </div>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 flex-1 overflow-auto">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            {viewType === 'team' ? 'Requests per Team' : 'Requests per Equipment Category'}
          </h3>
          <p className="text-sm text-slate-600">
            Total Requests: {requests.length} | 
            Showing: {displayData.length} {viewType === 'team' ? 'teams' : 'categories'}
          </p>
        </div>

        {displayData.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <BarChart3 size={48} className="mx-auto mb-4 opacity-50" />
            <p>No data available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayData.map((item, index) => {
              const percentage = (item.count / maxCount) * 100;
              const label = viewType === 'team' ? item.name : item.category;
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">{label}</span>
                    <span className="text-lg font-bold text-blue-600">{item.count}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-6 overflow-hidden">
                    <div
                      className={`h-full ${getColorForIndex(index)} transition-all duration-500 flex items-center justify-end pr-2`}
                      style={{ width: `${percentage}%` }}
                    >
                      <span className="text-xs font-semibold text-white">
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <h4 className="font-semibold text-slate-700 mb-3">Summary Statistics</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Total Requests:</span>
                <span className="font-semibold">{requests.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Active Requests:</span>
                <span className="font-semibold text-amber-600">
                  {requests.filter(r => r.stage !== 'Repaired' && r.stage !== 'Scrap').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Completed:</span>
                <span className="font-semibold text-green-600">
                  {requests.filter(r => r.stage === 'Repaired').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Scrapped:</span>
                <span className="font-semibold text-red-600">
                  {requests.filter(r => r.stage === 'Scrap').length}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <h4 className="font-semibold text-slate-700 mb-3">Request Types</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Corrective:</span>
                <span className="font-semibold text-red-600">
                  {requests.filter(r => r.requestType === 'Corrective').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Preventive:</span>
                <span className="font-semibold text-green-600">
                  {requests.filter(r => r.requestType === 'Preventive').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;

