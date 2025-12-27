import { useState } from 'react';
import { Plus, Clock, AlertCircle, User, Filter } from 'lucide-react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import RequestModal from './RequestModal';
import RequestCard from './RequestCard';

const stages = ['New', 'In Progress', 'Repaired', 'Scrap'];

const stageColors = {
  'New': 'bg-blue-50 border-blue-200',
  'In Progress': 'bg-amber-50 border-amber-200',
  'Repaired': 'bg-green-50 border-green-200',
  'Scrap': 'bg-red-50 border-red-200'
};

const KanbanBoard = ({ requests, equipment, teams, onUpdate }) => {
  const { user, isManager, isTechnician } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [draggedRequest, setDraggedRequest] = useState(null);
  const [groupBy, setGroupBy] = useState('stage'); // 'stage', 'team', 'category'
  
  // Filter requests based on role
  const filteredRequests = requests.filter(req => {
    if (isManager) return true; // Managers see all
    if (isTechnician) {
      // Technicians see requests assigned to them or their team
      return req.assignedTo?.name === user?.name || 
             req.maintenanceTeam?.members?.some(m => m.email === user?.email);
    }
    // Employees see requests they created
    return req.createdBy === user?.name || req.createdBy === user?.email;
  });

  const handleDragStart = (request) => {
    setDraggedRequest(request);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (stage) => {
    if (!draggedRequest || draggedRequest.stage === stage) {
      setDraggedRequest(null);
      return;
    }

    try {
      const updateData = { stage };
      if (stage === 'Repaired') {
        updateData.completedDate = new Date().toISOString();
      }
      if (stage === 'Scrap') {
        updateData.equipment = draggedRequest.equipment._id;
      }

      await api.requests.update(draggedRequest._id, updateData);
      onUpdate();
    } catch (error) {
      console.error('Error updating request:', error);
      alert('Failed to update request');
    }
    setDraggedRequest(null);
  };

  const getRequestsByStage = (stage) => {
    return filteredRequests.filter(req => req.stage === stage);
  };

  const getGroupedRequests = () => {
    if (groupBy === 'stage') {
      return stages.map(stage => ({
        key: stage,
        label: stage,
        requests: getRequestsByStage(stage),
        color: stageColors[stage]
      }));
    } else if (groupBy === 'team') {
      const teamGroups = {};
      filteredRequests.forEach(req => {
        const teamName = req.maintenanceTeam?.name || 'Unassigned';
        if (!teamGroups[teamName]) {
          teamGroups[teamName] = [];
        }
        teamGroups[teamName].push(req);
      });
      return Object.keys(teamGroups).map(teamName => ({
        key: teamName,
        label: teamName,
        requests: teamGroups[teamName],
        color: 'bg-purple-50 border-purple-200'
      }));
    } else if (groupBy === 'category') {
      const categoryGroups = {};
      filteredRequests.forEach(req => {
        const category = req.equipmentCategory || req.equipment?.category || 'Uncategorized';
        if (!categoryGroups[category]) {
          categoryGroups[category] = [];
        }
        categoryGroups[category].push(req);
      });
      return Object.keys(categoryGroups).map(category => ({
        key: category,
        label: category,
        requests: categoryGroups[category],
        color: 'bg-indigo-50 border-indigo-200'
      }));
    }
    return [];
  };

  const groupedData = getGroupedRequests();

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Maintenance Kanban Board</h2>
          <p className="text-slate-600 mt-1">Drag and drop requests to update their status</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-300 px-3 py-2">
            <Filter size={18} className="text-slate-600" />
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              className="border-none outline-none text-sm font-medium text-slate-700 bg-transparent"
            >
              <option value="stage">Group by Stage</option>
              <option value="team">Group by Team</option>
              <option value="category">Group by Category</option>
            </select>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
          >
            <Plus size={20} />
            New Request
          </button>
        </div>
      </div>

      <div className={`grid gap-6 flex-1 overflow-auto ${groupBy === 'stage' ? 'grid-cols-4' : 'grid-cols-3'}`}>
        {groupedData.map((group) => {
          return (
            <div
              key={group.key}
              onDragOver={groupBy === 'stage' ? handleDragOver : undefined}
              onDrop={groupBy === 'stage' ? () => handleDrop(group.key) : undefined}
              className={`rounded-xl border-2 p-4 ${group.color} transition-all duration-200`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800">{group.label}</h3>
                <span className="px-3 py-1 bg-white rounded-full text-sm font-semibold text-slate-700 shadow-sm">
                  {group.requests.length}
                </span>
              </div>
              <div className="space-y-3">
                {group.requests.map((request) => (
                  <RequestCard
                    key={request._id}
                    request={request}
                    onDragStart={groupBy === 'stage' ? handleDragStart : undefined}
                    onUpdate={onUpdate}
                  />
                ))}
                {group.requests.length === 0 && (
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
    </div>
  );
};

export default KanbanBoard;
