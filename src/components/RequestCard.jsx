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
      className={`bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 border-l-4 ${
        isOverdue ? 'border-l-red-500' : 'border-l-transparent'
      } border-r border-t border-b border-slate-200 ${
        canDrag ? 'cursor-move' : 'cursor-default'
      }`}
    >
      {isOverdue && (
        <div className="flex items-center gap-1 mb-2 text-red-600 text-xs font-semibold">
          <AlertCircle size={14} />
          <span>OVERDUE</span>
        </div>
      )}
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-slate-800 text-sm flex-1">{request.subject}</h4>
      </div>

      <p className="text-xs text-slate-600 mb-3 line-clamp-2">{request.description}</p>

      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Calendar size={14} />
          <span>{new Date(request.scheduledDate).toLocaleDateString()}</span>
        </div>
        {request.equipment && (
          <div className="text-xs text-slate-600 font-medium">
            {request.equipment.name}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[request.priority]}`}>
          {request.priority}
        </span>
        {request.assignedTo && (
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-semibold">
              {request.assignedTo.name.charAt(0)}
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className={`px-2 py-1 rounded ${
          request.requestType === 'Corrective' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
        }`}>
          {request.requestType}
        </span>
        {request.duration > 0 && (
          <span className="text-slate-500 flex items-center gap-1">
            <Clock size={12} />
            {request.duration}h
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
        {isManager ? (
          <>
            {isAssigned ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="flex items-center gap-2 text-emerald-900">
                    <CheckCircle size={16} className="text-emerald-600" />
                    <span className="font-medium">Assigned</span>
                  </div>
                  <span className="text-emerald-800 truncate max-w-[60%]">{request.assignedTo.name || request.assignedTo.email}</span>
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
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
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
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs font-medium disabled:opacity-50"
              >
                <User size={14} />
                Accept Request
              </button>
            )}
            {canStart && (
              <button
                onClick={handleStart}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-xs font-medium disabled:opacity-50"
              >
                <Play size={14} />
                Start Work
              </button>
            )}
            {canComplete && (
              <button
                onClick={() => setShowCompleteModal(true)}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-xs font-medium disabled:opacity-50"
              >
                <CheckCircle size={14} />
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
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Scrap Request</h3>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Hours Spent <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={scrapHoursSpent}
                onChange={(e) => setScrapHoursSpent(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors font-semibold disabled:opacity-50"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowScrapModal(false)}
                className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-semibold"
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
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Complete Request</h3>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Hours Spent <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={hoursSpent}
                onChange={(e) => setHoursSpent(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter hours spent"
                autoFocus
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleComplete}
                disabled={loading || !hoursSpent || hoursSpent <= 0}
                className="flex-1 bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors font-medium disabled:opacity-50"
              >
                {loading ? 'Completing...' : 'Complete'}
              </button>
              <button
                onClick={() => {
                  setShowCompleteModal(false);
                  setHoursSpent(0);
                }}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
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
