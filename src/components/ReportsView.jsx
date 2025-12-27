import { useMemo, useState, useEffect } from 'react';
import { BarChart3, PieChart, TrendingUp, Layers, LineChart } from 'lucide-react';
import { api } from '../utils/api';
import { authStore } from '../utils/auth';

const ReportsView = () => {
  const [requests, setRequests] = useState([]);
  const [teams, setTeams] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState('team'); // 'team' | 'category' | 'trend'

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const user = authStore.getUser();
      const role = user?.role?.toUpperCase() || 'USER';

      const requestsPromise = role === 'MANAGER'
        ? api.requests.getManager()
        : role === 'TECHNICIAN'
          ? api.requests.getTechnician()
          : api.requests.getAll();

      const [requestsData, teamsData, equipmentData] = await Promise.all([
        requestsPromise,
        api.teams.getAll(),
        api.equipment.getAll(),
      ]);

      const normalized = Array.isArray(requestsData) ? requestsData : [];
      if (role === 'USER') {
        const email = (user?.email || '').toLowerCase();
        const name = (user?.name || '').toLowerCase();
        const mine = normalized.filter(r => {
          const createdBy = (r.createdBy || '').toLowerCase();
          return (email && createdBy.includes(email)) || (name && createdBy.includes(name));
        });
        setRequests(mine);
      } else {
        setRequests(normalized);
      }

      setTeams(Array.isArray(teamsData) ? teamsData : []);
      setEquipment(Array.isArray(equipmentData) ? equipmentData : []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const baseCounts = useMemo(() => {
    const total = requests.length;
    const open = requests.filter(r => r.stage === 'New' || r.stage === 'In Progress').length;
    const repaired = requests.filter(r => r.stage === 'Repaired').length;
    const scrapped = requests.filter(r => r.stage === 'Scrap').length;
    const corrective = requests.filter(r => r.requestType === 'Corrective').length;
    const preventive = requests.filter(r => r.requestType === 'Preventive').length;
    return { total, open, repaired, scrapped, corrective, preventive };
  }, [requests]);

  const pivotByTeam = useMemo(() => {
    const map = new Map();
    teams.forEach(t => {
      map.set(t._id, {
        teamId: t._id,
        teamName: t.name,
        total: 0,
        open: 0,
        repaired: 0,
        scrapped: 0,
        corrective: 0,
        preventive: 0,
        avgRepairTimeHours: 0,
        totalHoursLogged: 0,
        backlog: 0,
      });
    });

    const repairedTimes = new Map();
    const totalHours = new Map();

    requests.forEach(r => {
      const teamId = r.maintenanceTeam?._id || r.maintenanceTeam;
      if (!teamId) return;

      if (!map.has(teamId)) {
        map.set(teamId, {
          teamId,
          teamName: r.maintenanceTeam?.name || 'Unknown',
          total: 0,
          open: 0,
          repaired: 0,
          scrapped: 0,
          corrective: 0,
          preventive: 0,
          avgRepairTimeHours: 0,
          totalHoursLogged: 0,
          backlog: 0,
        });
      }

      const row = map.get(teamId);
      row.total += 1;
      if (r.stage === 'New' || r.stage === 'In Progress') row.open += 1;
      if (r.stage === 'Repaired') row.repaired += 1;
      if (r.stage === 'Scrap') row.scrapped += 1;
      if (r.requestType === 'Corrective') row.corrective += 1;
      if (r.requestType === 'Preventive') row.preventive += 1;

      const hs = Number(r.hoursSpent) || 0;
      totalHours.set(teamId, (totalHours.get(teamId) || 0) + hs);

      if (r.stage === 'Repaired' && r.startedAt && r.completedAt) {
        const ms = new Date(r.completedAt) - new Date(r.startedAt);
        if (ms > 0) {
          repairedTimes.set(teamId, (repairedTimes.get(teamId) || []).concat(ms));
        }
      }
    });

    for (const [teamId, row] of map.entries()) {
      row.backlog = row.open;
      row.totalHoursLogged = Math.round((totalHours.get(teamId) || 0) * 10) / 10;
      const times = repairedTimes.get(teamId) || [];
      if (times.length > 0) {
        const avgMs = times.reduce((a, b) => a + b, 0) / times.length;
        row.avgRepairTimeHours = Math.round((avgMs / (1000 * 60 * 60)) * 10) / 10;
      }
    }

    return Array.from(map.values())
      .filter(r => r.total > 0)
      .sort((a, b) => b.total - a.total);
  }, [requests, teams]);

  const pivotByCategory = useMemo(() => {
    const map = new Map();
    const repairedTimes = new Map();

    requests.forEach(r => {
      const category = r.equipmentCategory || r.equipment?.category || 'Unknown';
      if (!map.has(category)) {
        map.set(category, {
          category,
          total: 0,
          open: 0,
          repaired: 0,
          scrapped: 0,
          preventive: 0,
          corrective: 0,
          avgRepairTimeHours: 0,
          scrapRate: 0,
        });
      }
      const row = map.get(category);
      row.total += 1;
      if (r.stage === 'New' || r.stage === 'In Progress') row.open += 1;
      if (r.stage === 'Repaired') row.repaired += 1;
      if (r.stage === 'Scrap') row.scrapped += 1;
      if (r.requestType === 'Preventive') row.preventive += 1;
      if (r.requestType === 'Corrective') row.corrective += 1;

      if (r.stage === 'Repaired' && r.startedAt && r.completedAt) {
        const ms = new Date(r.completedAt) - new Date(r.startedAt);
        if (ms > 0) {
          repairedTimes.set(category, (repairedTimes.get(category) || []).concat(ms));
        }
      }
    });

    for (const [category, row] of map.entries()) {
      const times = repairedTimes.get(category) || [];
      if (times.length > 0) {
        const avgMs = times.reduce((a, b) => a + b, 0) / times.length;
        row.avgRepairTimeHours = Math.round((avgMs / (1000 * 60 * 60)) * 10) / 10;
      }
      row.scrapRate = row.total > 0 ? Math.round((row.scrapped / row.total) * 1000) / 10 : 0;
    }

    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [requests]);

  const monthlyTrend = useMemo(() => {
    const map = new Map();
    requests.forEach(r => {
      const d = r.createdAt ? new Date(r.createdAt) : new Date(r.scheduledDate);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!map.has(key)) {
        map.set(key, { month: key, total: 0, preventive: 0, corrective: 0 });
      }
      const row = map.get(key);
      row.total += 1;
      if (r.requestType === 'Preventive') row.preventive += 1;
      if (r.requestType === 'Corrective') row.corrective += 1;
    });
    return Array.from(map.values()).sort((a, b) => a.month.localeCompare(b.month));
  }, [requests]);

  const topBacklogTeams = useMemo(() => {
    return [...pivotByTeam].sort((a, b) => b.backlog - a.backlog).slice(0, 5);
  }, [pivotByTeam]);

  const highScrapCategories = useMemo(() => {
    return [...pivotByCategory].sort((a, b) => b.scrapRate - a.scrapRate).slice(0, 5);
  }, [pivotByCategory]);

  const getMax = (arr, key) => Math.max(...arr.map(i => Number(i[key]) || 0), 1);

  const Donut = ({ value, total, label }) => {
    const pct = total > 0 ? value / total : 0;
    const size = 120;
    const stroke = 14;
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const dash = c * pct;
    const gap = c - dash;
    return (
      <div className="flex items-center gap-4">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size / 2} cy={size / 2} r={r} stroke="#e2e8f0" strokeWidth={stroke} fill="none" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="#2563eb"
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={`${dash} ${gap}`}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
          <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="18" fill="#0f172a" fontWeight="700">
            {Math.round(pct * 100)}%
          </text>
        </svg>
        <div>
          <div className="text-sm font-semibold text-slate-800">{label}</div>
          <div className="text-xs text-slate-600">{value} of {total}</div>
        </div>
      </div>
    );
  };

  const SimpleLine = ({ data }) => {
    const w = 520;
    const h = 160;
    const pad = 24;
    const max = Math.max(...data.map(d => d.total), 1);
    const points = data.map((d, idx) => {
      const x = pad + (idx * (w - pad * 2)) / Math.max(data.length - 1, 1);
      const y = h - pad - (d.total * (h - pad * 2)) / max;
      return { x, y, ...d };
    });
    const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    return (
      <div className="w-full overflow-x-auto">
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
          <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="#cbd5e1" />
          <line x1={pad} y1={pad} x2={pad} y2={h - pad} stroke="#cbd5e1" />
          <path d={path} fill="none" stroke="#2563eb" strokeWidth="3" />
          {points.map((p) => (
            <circle key={p.month} cx={p.x} cy={p.y} r="4" fill="#2563eb" />
          ))}
        </svg>
        <div className="flex gap-3 text-xs text-slate-500 px-1">
          {data.map(d => (
            <div key={d.month} className="min-w-[56px]">{d.month}</div>
          ))}
        </div>
      </div>
    );
  };

  const StackedBar = ({ open, repaired, scrapped }) => {
    const total = open + repaired + scrapped;
    const pct = (n) => (total > 0 ? (n / total) * 100 : 0);
    return (
      <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden flex">
        <div className="bg-amber-500" style={{ width: `${pct(open)}%` }} />
        <div className="bg-green-500" style={{ width: `${pct(repaired)}%` }} />
        <div className="bg-red-500" style={{ width: `${pct(scrapped)}%` }} />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const displayData = viewType === 'team' ? pivotByTeam : viewType === 'category' ? pivotByCategory : monthlyTrend;
  const maxCount = viewType === 'team'
    ? getMax(pivotByTeam, 'total')
    : viewType === 'category'
      ? getMax(pivotByCategory, 'total')
      : 1;

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
        <button
          onClick={() => setViewType('trend')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            viewType === 'trend'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-2">
            <LineChart size={20} />
            Trends
          </div>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 flex-1 overflow-auto">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            {viewType === 'team'
              ? 'Requests per Team (Pivot)'
              : viewType === 'category'
                ? 'Requests per Equipment Category (Pivot)'
                : 'Preventive vs Corrective Trend (Monthly)'}
          </h3>
          <p className="text-sm text-slate-600">
            Total Requests: {baseCounts.total} |
            Open: {baseCounts.open} |
            Repaired: {baseCounts.repaired} |
            Scrapped: {baseCounts.scrapped}
          </p>
        </div>

        {displayData.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <BarChart3 size={48} className="mx-auto mb-4 opacity-50" />
            <p>No data available</p>
          </div>
        ) : (
          <>
            {viewType === 'trend' ? (
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="flex items-center gap-2 mb-3 text-slate-700 font-semibold">
                  <LineChart size={18} />
                  Monthly Total Requests
                </div>
                <SimpleLine data={monthlyTrend} />
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="flex items-center gap-2 mb-3 text-slate-700 font-semibold">
                    <BarChart3 size={18} />
                    Bar Chart (Total)
                  </div>
                  <div className="space-y-3">
                    {(viewType === 'team' ? pivotByTeam : pivotByCategory).slice(0, 10).map((row, idx) => {
                      const label = viewType === 'team' ? row.teamName : row.category;
                      const val = row.total;
                      const percentage = (val / maxCount) * 100;
                      return (
                        <div key={`${label}-${idx}`}>
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-semibold text-slate-800 truncate max-w-[75%]">{label}</span>
                            <span className="font-bold text-blue-600">{val}</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                            <div className="h-full bg-blue-500" style={{ width: `${percentage}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="flex items-center gap-2 mb-3 text-slate-700 font-semibold">
                    <Layers size={18} />
                    Stacked (Open vs Repaired vs Scrap)
                  </div>
                  <div className="space-y-3">
                    {(viewType === 'team' ? pivotByTeam : pivotByCategory).slice(0, 10).map((row, idx) => {
                      const label = viewType === 'team' ? row.teamName : row.category;
                      return (
                        <div key={`${label}-${idx}`} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-semibold text-slate-800 truncate max-w-[75%]">{label}</span>
                            <span className="text-xs text-slate-600">{row.open} open • {row.repaired} repaired • {row.scrapped} scrap</span>
                          </div>
                          <StackedBar open={row.open} repaired={row.repaired} scrapped={row.scrapped} />
                        </div>
                      );
                    })}
                    <div className="flex gap-4 text-xs text-slate-600 mt-2">
                      <div className="flex items-center gap-2"><span className="w-3 h-3 bg-amber-500 inline-block rounded" /> Open</div>
                      <div className="flex items-center gap-2"><span className="w-3 h-3 bg-green-500 inline-block rounded" /> Repaired</div>
                      <div className="flex items-center gap-2"><span className="w-3 h-3 bg-red-500 inline-block rounded" /> Scrap</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <h4 className="font-semibold text-slate-700 mb-3">Summary Statistics</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-600">Total Requests:</span><span className="font-semibold">{baseCounts.total}</span></div>
              <div className="flex justify-between"><span className="text-slate-600">Open Requests:</span><span className="font-semibold text-amber-600">{baseCounts.open}</span></div>
              <div className="flex justify-between"><span className="text-slate-600">Repaired:</span><span className="font-semibold text-green-600">{baseCounts.repaired}</span></div>
              <div className="flex justify-between"><span className="text-slate-600">Scrapped:</span><span className="font-semibold text-red-600">{baseCounts.scrapped}</span></div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <h4 className="font-semibold text-slate-700 mb-3">Corrective vs Preventive</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Donut value={baseCounts.corrective} total={baseCounts.total} label="Corrective" />
              <Donut value={baseCounts.preventive} total={baseCounts.total} label="Preventive" />
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <h4 className="font-semibold text-slate-700 mb-3">Risk Indicators</h4>
            <div className="space-y-4 text-sm">
              <div>
                <div className="font-semibold text-slate-800 mb-2">Teams with Highest Backlog</div>
                {topBacklogTeams.length === 0 ? (
                  <div className="text-slate-600">No data</div>
                ) : (
                  <div className="space-y-2">
                    {topBacklogTeams.map(t => (
                      <div key={t.teamId} className="flex items-center justify-between">
                        <span className="text-slate-700">{t.teamName}</span>
                        <span className="font-semibold text-amber-700">{t.backlog}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <div className="font-semibold text-slate-800 mb-2">Highest Scrap Rate Categories</div>
                {highScrapCategories.length === 0 ? (
                  <div className="text-slate-600">No data</div>
                ) : (
                  <div className="space-y-2">
                    {highScrapCategories.map(c => (
                      <div key={c.category} className="flex items-center justify-between">
                        <span className="text-slate-700">{c.category}</span>
                        <span className="font-semibold text-red-700">{c.scrapRate}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {viewType !== 'trend' && (
          <div className="mt-8 bg-white rounded-xl border border-slate-200 overflow-auto">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="font-semibold text-slate-800">Pivot Table</div>
              <div className="text-xs text-slate-500">Real data from DB</div>
            </div>
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left">
                  <th className="p-3 font-semibold text-slate-700">{viewType === 'team' ? 'Team Name' : 'Equipment Category'}</th>
                  <th className="p-3 font-semibold text-slate-700">Total</th>
                  <th className="p-3 font-semibold text-slate-700">Open</th>
                  <th className="p-3 font-semibold text-slate-700">Repaired</th>
                  <th className="p-3 font-semibold text-slate-700">Scrapped</th>
                  <th className="p-3 font-semibold text-slate-700">Corrective</th>
                  <th className="p-3 font-semibold text-slate-700">Preventive</th>
                  <th className="p-3 font-semibold text-slate-700">Avg Repair (h)</th>
                  {viewType === 'team' ? (
                    <th className="p-3 font-semibold text-slate-700">Hours Logged</th>
                  ) : (
                    <th className="p-3 font-semibold text-slate-700">Scrap Rate</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {(viewType === 'team' ? pivotByTeam : pivotByCategory).map((row) => (
                  <tr key={viewType === 'team' ? row.teamId : row.category} className="border-t border-slate-200">
                    <td className="p-3 font-semibold text-slate-800">{viewType === 'team' ? row.teamName : row.category}</td>
                    <td className="p-3">{row.total}</td>
                    <td className="p-3 text-amber-700 font-semibold">{row.open}</td>
                    <td className="p-3 text-green-700 font-semibold">{row.repaired}</td>
                    <td className="p-3 text-red-700 font-semibold">{row.scrapped}</td>
                    <td className="p-3">{row.corrective}</td>
                    <td className="p-3">{row.preventive}</td>
                    <td className="p-3">{row.avgRepairTimeHours || 0}</td>
                    {viewType === 'team' ? (
                      <td className="p-3">{row.totalHoursLogged || 0}</td>
                    ) : (
                      <td className="p-3">{row.scrapRate || 0}%</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsView;

