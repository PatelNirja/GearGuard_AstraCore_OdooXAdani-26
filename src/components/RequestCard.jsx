import { useState } from 'react';
import { Clock, AlertCircle, User, Calendar, Play, CheckCircle } from 'lucide-react';
import { authStore } from '../utils/auth';
import { api } from '../utils/api';

const priorityColors = {
  'Low': 'bg-slate-100 text-slate-700',
  'Medium': 'bg-blue-100 text-blue-700',
  'High': 'bg-orange-100 text-orange-700',
  'Critical': 'bg-red-100 text-red-700'
};

const RequestCard = ({ request, technicians = [], onDragStart, onUpdate }) => {
  const user = authStore.getUser();
  const userRole = user?.role?.toUpperCase() || 'USER';
  const isManager = userRole === 'MANAGER';
  const isAssigned = !!request.assignedTo?.email;
  const canDrag = userRole === 'TECHNICIAN' || userRole === 'MANAGER';
  const canAssign = (userRole === 'TECHNICIAN' || userRole === 'MANAGER') && request.stage === 'New';
  const canStart = (userRole === 'TECHNICIAN' || userRole === 'MANAGER') && 
                   request.stage === 'New' && 
                   request.assignedTo?.email?.toLowerCase() === user?.email?.toLowerCase();
  const canComplete = (userRole === 'TECHNICIAN' || userRole === 'MANAGER') && 
                      request.stage === 'In Progress' &&
                      request.assignedTo?.email?.toLowerCase() === user?.email?.toLowerCase();
  const isOverdue = new Date(request.scheduledDate) < new Date() && request.stage !== 'Repaired' && request.stage !== 'Scrap';
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showScrapModal, setShowScrapModal] = useState(false);
  const [hoursSpent, setHoursSpent] = useState(0);
  const [scrapHoursSpent, setScrapHoursSpent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState('');

  const handleAssignSelf = async () => {
    try {
      setLoading(true);
      await api.requests.assignSelf(request._id);
      onUpdate();
    } catch (error) {
      alert(error.message || 'Failed to assign request');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignManager = async () => {
    if (!selectedTechnicianId) {
      alert('Please select a technician');
      return;
    }
    try {
      setLoading(true);
      await api.requests.assignManager(request._id, selectedTechnicianId);
      setSelectedTechnicianId('');
      onUpdate();
    } catch (error) {
      alert(error.message || 'Failed to assign technician');
    } finally {
      setLoading(false);
    }
  };

  const handleScrap = async () => {
    try {
      setLoading(true);
      await api.requests.scrap(request._id, scrapHoursSpent);
      onUpdate();
    } catch (error) {
      alert(error.message || 'Failed to scrap request');
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async () => {
    try {
      setLoading(true);
      await api.requests.start(request._id);
      onUpdate();
    } catch (error) {
      alert(error.message || 'Failed to start work');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!hoursSpent || hoursSpent <= 0) {
      alert('Please enter hours spent');
      return;
    }
    try {
      setLoading(true);
      await api.requests.complete(request._id, hoursSpent);
      setShowCompleteModal(false);
      setHoursSpent(0);
      onUpdate();
    } catch (error) {
      alert(error.message || 'Failed to complete request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      draggable={canDrag}
      onDragStart={canDrag ? () => onDragStart(request) : undefined}
      className={`bg-white dark:bg-slate-900 rounded-lg p-3.5 shadow-sm hover:shadow-md transition-all duration-200 border-l-4 ${
        isOverdue ? 'border-l-red-500' : 'border-l-transparent'
      } border-r border-t border-b border-slate-200 dark:border-slate-800 ${
        canDrag ? 'cursor-move' : 'cursor-default'
      }`}
    >
      {isOverdue && (
        <div className="flex items-center gap-1.5 mb-2.5 text-red-600 dark:text-red-400 text-xs font-semibold">
          <AlertCircle size={12} />
          <span>OVERDUE</span>
        </div>
      )}
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm flex-1 leading-tight">{request.subject}</h4>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 line-clamp-2 leading-relaxed">{request.description}</p>

      <div className="space-y-1.5 mb-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
          <Calendar size={12} />
          <span>{new Date(request.scheduledDate).toLocaleDateString()}</span>
        </div>
        {request.equipment && (
          <div className="text-xs text-slate-600 dark:text-slate-400 font-medium truncate">
            {request.equipment.name}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-3">
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityColors[request.priority]}`}>
          {request.priority}
        </span>
        {request.assignedTo && (
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-semibold">
              {request.assignedTo.name.charAt(0)}
            </div>
          </div>
        )}
      </div>

      <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs mb-3">
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
          request.requestType === 'Corrective' ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
        }`}>
          {request.requestType}
        </span>
        {request.duration > 0 && (
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Clock size={11} />
            {request.duration}h
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 space-y-2">
        {isManager ? (
          <>
                {isAssigned ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between px-2.5 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-900 dark:text-emerald-300">
                    <CheckCircle size={14} className="text-emerald-600 dark:text-emerald-400" />
                    <span className="font-medium">Assigned</span>
                  </div>
                  <span className="text-emerald-800 dark:text-emerald-300 truncate max-w-[60%] text-xs">{request.assignedTo.name || request.assignedTo.email}</span>
                </div>
                {request.stage !== 'Scrap' && (
                  <button
                    onClick={() => {
                      setScrapHoursSpent(0);
                      setShowScrapModal(true);
                    }}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs font-medium disabled:opacity-50"
                  >
                    Scrap
                  </button>
                )}
              </div>
            ) : (
              request.stage === 'New' && (
                <div className="space-y-2">
                  <select
                    value={selectedTechnicianId}
                    onChange={(e) => setSelectedTechnicianId(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                  >
                    <option value="">Assign technician...</option>
                    {technicians.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name} ({t.email})
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleAssignManager}
                    disabled={loading || !selectedTechnicianId}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-emerald-300 text-emerald-950 rounded-lg hover:bg-emerald-400 transition-colors text-xs font-medium disabled:opacity-50"
                  >
                    Assign
                  </button>
                </div>
              )
            )}
          </>
        ) : (
          <>
            {canAssign && !request.assignedTo && (
              <button
                onClick={handleAssignSelf}
                disabled={loading}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs font-medium disabled:opacity-50"
              >
                <User size={13} />
                Accept Request
              </button>
            )}
            {canStart && (
              <button
                onClick={handleStart}
                disabled={loading}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-xs font-medium disabled:opacity-50"
              >
                <Play size={13} />
                Start Work
              </button>
            )}
            {canComplete && (
              <button
                onClick={() => setShowCompleteModal(true)}
                disabled={loading}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-xs font-medium disabled:opacity-50"
              >
                <CheckCircle size={13} />
                Mark Repaired
              </button>
            )}
            {userRole === 'TECHNICIAN' && request.assignedTo?.email?.toLowerCase() === user?.email?.toLowerCase() &&
              request.stage !== 'Scrap' && (
                <button
                  onClick={() => {
                    setScrapHoursSpent(0);
                    setShowScrapModal(true);
                  }}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs font-medium disabled:opacity-50"
                >
                  Scrap
                </button>
              )}
          </>
        )}
      </div>

      {showScrapModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6 max-w-sm w-full shadow-xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-5">Scrap Request</h3>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Hours Spent <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={scrapHoursSpent}
                onChange={(e) => setScrapHoursSpent(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2.5 text-sm border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                autoFocus
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={async () => {
                  if (!scrapHoursSpent || scrapHoursSpent <= 0) {
                    alert('hoursSpent is required');
                    return;
                  }
                  setShowScrapModal(false);
                  await handleScrap();
                }}
                disabled={loading}
                className="flex-1 bg-red-500 text-white py-2.5 rounded-lg hover:bg-red-600 transition-colors font-semibold text-sm disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Confirm'}
              </button>
              <button
                onClick={() => setShowScrapModal(false)}
                className="px-5 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-semibold text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complete Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6 max-w-sm w-full shadow-xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-5">Complete Request</h3>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Hours Spent <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={hoursSpent}
                onChange={(e) => setHoursSpent(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2.5 text-sm border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter hours spent"
                autoFocus
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleComplete}
                disabled={loading || !hoursSpent || hoursSpent <= 0}
                className="flex-1 bg-purple-500 text-white py-2.5 rounded-lg hover:bg-purple-600 transition-colors font-semibold text-sm disabled:opacity-50"
              >
                {loading ? 'Completing...' : 'Complete'}
              </button>
              <button
                onClick={() => {
                  setShowCompleteModal(false);
                  setHoursSpent(0);
                }}
                className="px-5 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-semibold text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestCard;
