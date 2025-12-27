import { useEffect, useMemo, useState } from 'react';
import { api } from '../utils/api';
import { authStore } from '../utils/auth';

export default function Profile() {
  const localUser = authStore.getUser();
  const role = localUser?.role?.toUpperCase() || 'USER';

  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    employeeId: '',
    phoneNumber: '',
    department: '',
    jobTitle: '',
    profilePhotoUrl: '',
    notificationPreferences: 'BOTH',
    language: '',
    theme: 'system',
    availabilityStatus: 'AVAILABLE',
    skills: '',
    specialization: '',
    certification: '',
    yearsOfExperience: '',
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const [meRes, teamsRes, equipmentRes] = await Promise.all([
          api.users.me(),
          api.teams.getAll(),
          api.equipment.getAll(),
        ]);

        setProfile(meRes.user);
        setTeams(teamsRes);
        setEquipment(equipmentRes);

        let reqs = [];
        if (role === 'TECHNICIAN') {
          reqs = await api.requests.getTechnician();
        } else if (role === 'MANAGER') {
          reqs = await api.requests.getManager();
        } else {
          reqs = await api.requests.getAll();
        }
        setRequests(reqs);

        setForm({
          employeeId: meRes.user.employeeId || '',
          phoneNumber: meRes.user.phoneNumber || '',
          department: meRes.user.department || '',
          jobTitle: meRes.user.jobTitle || '',
          profilePhotoUrl: meRes.user.profilePhotoUrl || '',
          notificationPreferences: meRes.user.notificationPreferences || 'BOTH',
          language: meRes.user.language || '',
          theme: meRes.user.theme || 'system',
          availabilityStatus: meRes.user.availabilityStatus || 'AVAILABLE',
          skills: Array.isArray(meRes.user.skills) ? meRes.user.skills.join(', ') : '',
          specialization: meRes.user.specialization || '',
          certification: meRes.user.certification || '',
          yearsOfExperience: meRes.user.yearsOfExperience !== undefined && meRes.user.yearsOfExperience !== null ? String(meRes.user.yearsOfExperience) : '',
        });
      } catch (e) {
        setError(e?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [role]);

  const myTeam = useMemo(() => {
    if (!profile?.teamId) return null;
    return teams.find(t => t._id === profile.teamId) || null;
  }, [profile?.teamId, teams]);

  const assignedEquipment = useMemo(() => {
    const key = (profile?.name || localUser?.name || '').toLowerCase();
    if (!key) return [];
    return equipment.filter(eq => (eq.assignedTo || '').toLowerCase() === key);
  }, [equipment, profile?.name, localUser?.name]);

  const requestStats = useMemo(() => {
    const email = (profile?.email || localUser?.email || '').toLowerCase();

    const myRaised = requests.filter(r => {
      if (role !== 'USER') return false;
      const createdBy = (r.createdBy || '').toLowerCase();
      return createdBy.includes(email) || createdBy.includes((profile?.name || '').toLowerCase());
    });

    const myAssigned = requests.filter(r => {
      if (role !== 'TECHNICIAN') return false;
      return (r.assignedTo?.email || '').toLowerCase() === email;
    });

    const src = role === 'USER' ? myRaised : role === 'TECHNICIAN' ? myAssigned : requests;

    const open = src.filter(r => r.stage !== 'Repaired' && r.stage !== 'Scrap');
    const completed = src.filter(r => r.stage === 'Repaired');
    const scrap = src.filter(r => r.stage === 'Scrap');
    const overdue = src.filter(r => new Date(r.scheduledDate) < new Date() && r.stage !== 'Repaired' && r.stage !== 'Scrap');

    const avgRepairTimeHours = (() => {
      const repaired = src.filter(r => r.stage === 'Repaired' && r.startedAt && r.completedAt);
      if (repaired.length === 0) return 0;
      const totalMs = repaired.reduce((acc, r) => acc + (new Date(r.completedAt) - new Date(r.startedAt)), 0);
      return Math.round((totalMs / repaired.length) / (1000 * 60 * 60));
    })();

    const totalHoursLogged = src.reduce((acc, r) => acc + (Number(r.hoursSpent) || 0), 0);

    return {
      total: src.length,
      open: open.length,
      completed: completed.length,
      scrap: scrap.length,
      overdue: overdue.length,
      avgRepairTimeHours,
      totalHoursLogged,
      recent: src.slice(0, 5),
    };
  }, [requests, profile?.email, profile?.name, localUser?.email, role]);

  const schedule = useMemo(() => {
    const email = (profile?.email || localUser?.email || '').toLowerCase();
    const today = new Date();
    const start = new Date(today);
    start.setHours(0, 0, 0, 0);
    const end = new Date(today);
    end.setHours(23, 59, 59, 999);

    const assigned = role === 'TECHNICIAN'
      ? requests.filter(r => (r.assignedTo?.email || '').toLowerCase() === email)
      : [];

    const todays = assigned.filter(r => {
      const d = new Date(r.scheduledDate);
      return d >= start && d <= end;
    });

    const upcoming = assigned
      .filter(r => new Date(r.scheduledDate) > end)
      .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
      .slice(0, 10);

    return { todays, upcoming };
  }, [requests, profile?.email, localUser?.email, role]);

  const onSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const payload = {
        employeeId: form.employeeId,
        phoneNumber: form.phoneNumber,
        department: form.department,
        jobTitle: form.jobTitle,
        profilePhotoUrl: form.profilePhotoUrl,
        notificationPreferences: form.notificationPreferences,
        language: form.language,
        theme: form.theme,
        availabilityStatus: form.availabilityStatus,
        skills: form.skills
          ? form.skills.split(',').map(s => s.trim()).filter(Boolean)
          : [],
        specialization: form.specialization,
        certification: form.certification,
        yearsOfExperience: form.yearsOfExperience === '' ? undefined : Number(form.yearsOfExperience),
      };

      const res = await api.users.updateMe(payload);
      setProfile(res.user);
      authStore.setUser({ ...authStore.getUser(), ...res.user });
      setSuccess('Profile saved');
    } catch (e) {
      setError(e?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return <div className="text-slate-700">No profile data.</div>;
  }

  const avatarLetter = (profile.name || 'U').charAt(0).toUpperCase();

  return (
    <div className="h-full flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Profile</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Role-wise account details and summaries</p>
      </div>

      {error && <div className="mb-4 p-3 rounded border border-red-200 bg-red-50 text-red-700">{error}</div>}
      {success && <div className="mb-4 p-3 rounded border border-emerald-200 bg-emerald-50 text-emerald-800">{success}</div>}

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            {profile.profilePhotoUrl ? (
              <img src={profile.profilePhotoUrl} alt="Profile" className="w-16 h-16 rounded-full object-cover border border-slate-200" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-xl font-bold">
                {avatarLetter}
              </div>
            )}
            <div>
              <div className="text-xl font-bold text-slate-800 dark:text-slate-100">{profile.name}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">{profile.email}</div>
              <div className="mt-1 text-xs px-2 py-1 inline-flex rounded bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-200">
                Role: {profile.role}
              </div>
              <div className="mt-1 text-xs px-2 py-1 inline-flex rounded bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-200 ml-2">
                Status: {profile.active ? 'Active' : 'Disabled'}
              </div>
            </div>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            <div>Created: {new Date(profile.createdAt).toLocaleString()}</div>
            <div>Updated: {new Date(profile.updatedAt).toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 p-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Employee ID</label>
              <input value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Phone Number</label>
              <input value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Department</label>
              <input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Job Title</label>
              <input value={form.jobTitle} onChange={(e) => setForm({ ...form, jobTitle: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Profile Photo URL</label>
              <input value={form.profilePhotoUrl} onChange={(e) => setForm({ ...form, profilePhotoUrl: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
            </div>
          </div>

          {role === 'TECHNICIAN' && (
            <div className="mt-6">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">Professional Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Maintenance Team</label>
                  <input value={myTeam?.name || ''} disabled className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-100" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Specialization</label>
                  <input value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Skills (comma-separated)</label>
                  <input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Years of Experience</label>
                  <input type="number" min="0" value={form.yearsOfExperience} onChange={(e) => setForm({ ...form, yearsOfExperience: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Certification</label>
                  <input value={form.certification} onChange={(e) => setForm({ ...form, certification: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Availability</label>
                  <select value={form.availabilityStatus} onChange={(e) => setForm({ ...form, availabilityStatus: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg">
                    <option value="AVAILABLE">Available</option>
                    <option value="ON_LEAVE">On Leave</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              disabled={saving}
              onClick={onSave}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {role === 'USER' && (
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 p-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Asset Ownership</h3>
              {assignedEquipment.length === 0 ? (
                <div className="text-sm text-slate-600 dark:text-slate-400">No equipment mapped to you.</div>
              ) : (
                <div className="space-y-2">
                  {assignedEquipment.map(eq => (
                    <div key={eq._id} className="flex items-center justify-between text-sm border border-slate-200 dark:border-slate-800 rounded-lg p-3">
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-100">{eq.name}</div>
                        <div className="text-xs text-slate-500">{eq.serialNumber}</div>
                      </div>
                      <span className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-200">{eq.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Workload / Requests Overview</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500">Total</div>
                <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{requestStats.total}</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500">Open</div>
                <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{requestStats.open}</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500">Completed</div>
                <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{requestStats.completed}</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500">Overdue</div>
                <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{requestStats.overdue}</div>
              </div>
            </div>

            {role === 'TECHNICIAN' && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="text-xs text-slate-500">Avg Repair Time (h)</div>
                  <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{requestStats.avgRepairTimeHours}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="text-xs text-slate-500">Total Hours Logged</div>
                  <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{Math.round(requestStats.totalHoursLogged)}</div>
                </div>
              </div>
            )}

            <div className="mt-4">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-2">Recent Requests</h4>
              {requestStats.recent.length === 0 ? (
                <div className="text-sm text-slate-600 dark:text-slate-400">No requests.</div>
              ) : (
                <div className="space-y-2">
                  {requestStats.recent.map(r => (
                    <div key={r._id} className="text-sm border border-slate-200 dark:border-slate-800 rounded-lg p-3">
                      <div className="font-semibold text-slate-800 dark:text-slate-100">{r.subject}</div>
                      <div className="text-xs text-slate-500">{new Date(r.scheduledDate).toLocaleDateString()} • {r.stage}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {role === 'TECHNICIAN' && (
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 p-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Schedule</h3>
              <div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">Today’s Jobs</div>
                {schedule.todays.length === 0 ? (
                  <div className="text-sm text-slate-600 dark:text-slate-400">No jobs today.</div>
                ) : (
                  <div className="space-y-2">
                    {schedule.todays.map(r => (
                      <div key={r._id} className="text-sm border border-slate-200 dark:border-slate-800 rounded-lg p-3">
                        <div className="font-semibold text-slate-800 dark:text-slate-100">{r.subject}</div>
                        <div className="text-xs text-slate-500">{r.equipment?.name || ''}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-4">
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">Upcoming</div>
                {schedule.upcoming.length === 0 ? (
                  <div className="text-sm text-slate-600 dark:text-slate-400">No upcoming jobs.</div>
                ) : (
                  <div className="space-y-2">
                    {schedule.upcoming.map(r => (
                      <div key={r._id} className="text-sm border border-slate-200 dark:border-slate-800 rounded-lg p-3">
                        <div className="font-semibold text-slate-800 dark:text-slate-100">{r.subject}</div>
                        <div className="text-xs text-slate-500">{new Date(r.scheduledDate).toLocaleDateString()}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {role === 'MANAGER' && (
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 p-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Operational Overview</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="text-xs text-slate-500">Total Open Requests</div>
                  <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{requestStats.open}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="text-xs text-slate-500">Equipment Scrap Count</div>
                  <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{requestStats.scrap}</div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Notifications</label>
                <select value={form.notificationPreferences} onChange={(e) => setForm({ ...form, notificationPreferences: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg">
                  <option value="EMAIL">Email</option>
                  <option value="IN_APP">In-App</option>
                  <option value="BOTH">Both</option>
                  <option value="NONE">None</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Theme</label>
                <select value={form.theme} onChange={(e) => setForm({ ...form, theme: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg">
                  <option value="system">System</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Language</label>
                <input value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Security</h3>
            <div className="text-sm text-slate-600 dark:text-slate-400">Password reset and sessions are placeholders (requires auth/session infrastructure).</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">Last Login: Not tracked yet</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Active Sessions: Not tracked yet</div>
          </div>
        </div>
      </div>
    </div>
  );
}
