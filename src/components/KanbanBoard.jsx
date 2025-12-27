import { useState } from 'react';
import { Plus, Clock, AlertCircle, User } from 'lucide-react';
import { api } from '../utils/api';
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
  const [showModal, setShowModal] = useState(false);
  const [draggedRequest, setDraggedRequest] = useState(null);

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
    return requests.filter(req => req.stage === stage);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Maintenance Kanban Board</h2>
          <p className="text-slate-600 mt-1">Drag and drop requests to update their status</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
        >
          <Plus size={20} />
          New Request
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6 flex-1 overflow-auto">
        {stages.map((stage) => {
          const stageRequests = getRequestsByStage(stage);
          return (
            <div
              key={stage}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(stage)}
              className={`rounded-xl border-2 p-4 ${stageColors[stage]} transition-all duration-200`}
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
    </div>
  );
};

export default KanbanBoard;
