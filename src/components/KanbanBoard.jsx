import { useState } from 'react';
import { Plus, Clock, AlertCircle, User, Search, Filter, X } from 'lucide-react';
import { api } from '../utils/api';
import { authStore } from '../utils/auth';
import RequestModal from './RequestModal';
import RequestCard from './RequestCard';

const stages = ['New', 'In Progress', 'Repaired', 'Scrap'];

const stageColors = {
  'New': 'bg-blue-50 border-blue-200',
  'In Progress': 'bg-amber-50 border-amber-200',
  'Repaired': 'bg-green-50 border-green-200',
  'Scrap': 'bg-red-50 border-red-200'
};

const KanbanBoard = ({ requests, equipment, teams, technicians = [], onUpdate }) => {
  const user = authStore.getUser();
  const userRole = user?.role?.toUpperCase() || 'USER';
  const canCreateRequest = userRole === 'USER' || userRole === 'MANAGER';
  const canChangeStatus = userRole === 'TECHNICIAN' || userRole === 'MANAGER';
  
  const [showModal, setShowModal] = useState(false);
  const [draggedRequest, setDraggedRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterEmployee, setFilterEmployee] = useState('');
  const [showHoursModal, setShowHoursModal] = useState(false);
  const [hoursStage, setHoursStage] = useState(null);
  const [hoursValue, setHoursValue] = useState('');

  const handleDragStart = (request) => {
    setDraggedRequest(request);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (stage) => {
    if (!canChangeStatus) {
      setDraggedRequest(null);
      return;
    }
    
    if (!draggedRequest || draggedRequest.stage === stage) {
      setDraggedRequest(null);
      return;
    }

    // Technicians can only scrap if they are assigned to the request
    if (stage === 'Scrap' && userRole === 'TECHNICIAN') {
      const isAssigned = draggedRequest.assignedTo?.email?.toLowerCase() === user?.email?.toLowerCase();
      if (!isAssigned) {
        alert('You can only scrap requests assigned to you');
        setDraggedRequest(null);
        return;
      }
    }

    try {
      if (stage === 'Repaired' || stage === 'Scrap') {
        setHoursStage(stage);
        setHoursValue('');
        setShowHoursModal(true);
        return;
      }

      const updateData = { stage };
      
      // Auto-assign technician when they move request to "In Progress" (technicians can assign themselves)
      if (userRole === 'TECHNICIAN' && stage === 'In Progress') {
        updateData.assignedTo = {
          name: user.name || '',
          email: user.email || '',
          avatar: ''
        };
      }

      await api.requests.update(draggedRequest._id, updateData);
      onUpdate();
    } catch (error) {
      console.error('Error updating request:', error);
      alert('Failed to update request');
    }
    setDraggedRequest(null);
  };

  const getFilteredRequests = () => {
    return requests.filter(req => {
      const matchesSearch = !searchTerm || 
        req.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.equipment?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = !filterDepartment || 
        req.equipment?.department?.toLowerCase() === filterDepartment.toLowerCase();
      
      const matchesEmployee = !filterEmployee || 
        req.equipment?.assignedTo?.toLowerCase() === filterEmployee.toLowerCase();
      
      return matchesSearch && matchesDepartment && matchesEmployee;
    });
  };

  const getRequestsByStage = (stage) => {
    const filtered = getFilteredRequests();
    return filtered.filter(req => req.stage === stage);
  };

  const getUniqueDepartments = () => {
    const depts = new Set();
    requests.forEach(req => {
      if (req.equipment?.department) {
        depts.add(req.equipment.department);
      }
    });
    return Array.from(depts).sort();
  };

  const getUniqueEmployees = () => {
    const employees = new Set();
    requests.forEach(req => {
      if (req.equipment?.assignedTo) {
        employees.add(req.equipment.assignedTo);
      }
    });
    return Array.from(employees).sort();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Maintenance Kanban Board</h2>
            <p className="text-slate-600 mt-1">
              {canChangeStatus 
                ? 'Drag and drop requests to update their status' 
                : 'View maintenance requests'}
            </p>
          </div>
          {canCreateRequest && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
            >
              <Plus size={20} />
              New Request
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-slate-600" />
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Departments</option>
              {getUniqueDepartments().map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <User size={18} className="text-slate-600" />
            <select
              value={filterEmployee}
              onChange={(e) => setFilterEmployee(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Employees</option>
              {getUniqueEmployees().map(emp => (
                <option key={emp} value={emp}>{emp}</option>
              ))}
            </select>
          </div>
          {(searchTerm || filterDepartment || filterEmployee) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterDepartment('');
                setFilterEmployee('');
              }}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 flex-1 overflow-auto">
        {stages.map((stage) => {
          const stageRequests = getRequestsByStage(stage);
          return (
              <div
                key={stage}
                onDragOver={canChangeStatus ? handleDragOver : undefined}
                onDrop={canChangeStatus ? () => handleDrop(stage) : undefined}
                className={`rounded-xl border-2 p-4 ${stageColors[stage]} transition-all duration-200 ${
                  canChangeStatus ? '' : 'opacity-75'
                }`}
              >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800">{stage}</h3>
                <span className="px-3 py-1 bg-white rounded-full text-sm font-semibold text-slate-700 shadow-sm">
                  {stageRequests.length}
                </span>
              </div>
              <div className="space-y-3">
                {stageRequests.map((request) => (
                  <RequestCard
                    key={request._id}
                    request={request}
                    technicians={technicians}
                    onDragStart={handleDragStart}
                    onUpdate={onUpdate}
                  />
                ))}
                {stageRequests.length === 0 && (
                  <div className="text-center py-8 text-slate-400">
                    <p className="text-sm">No requests</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <RequestModal
          equipment={equipment}
          teams={teams}
          onClose={() => setShowModal(false)}
          onUpdate={onUpdate}
        />
      )}

      {showHoursModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Enter Hours Spent</h3>
              <button
                type="button"
                onClick={() => {
                  setShowHoursModal(false);
                  setHoursStage(null);
                  setHoursValue('');
                  setDraggedRequest(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Hours Spent</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={hoursValue}
                onChange={(e) => setHoursValue(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={async () => {
                    const hoursSpent = parseFloat(hoursValue);
                    if (!hoursSpent || hoursSpent <= 0) {
                      alert('hoursSpent is required');
                      return;
                    }
                    try {
                      if (!draggedRequest || !hoursStage) {
                        setShowHoursModal(false);
                        return;
                      }
                      if (hoursStage === 'Repaired') {
                        await api.requests.complete(draggedRequest._id, hoursSpent);
                      } else {
                        await api.requests.scrap(draggedRequest._id, hoursSpent);
                      }
                      setShowHoursModal(false);
                      setHoursStage(null);
                      setHoursValue('');
                      setDraggedRequest(null);
                      onUpdate();
                    } catch (error) {
                      alert(error.message || 'Failed to update request');
                    }
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-lg hover:shadow-lg transition-all duration-200 font-semibold"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowHoursModal(false);
                    setHoursStage(null);
                    setHoursValue('');
                    setDraggedRequest(null);
                  }}
                  className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-200 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;
