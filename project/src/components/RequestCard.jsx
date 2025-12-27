import { Clock, AlertCircle, User, Calendar } from 'lucide-react';

const priorityColors = {
  'Low': 'bg-slate-100 text-slate-700',
  'Medium': 'bg-blue-100 text-blue-700',
  'High': 'bg-orange-100 text-orange-700',
  'Critical': 'bg-red-100 text-red-700'
};

const RequestCard = ({ request, onDragStart, onUpdate }) => {
  const isOverdue = new Date(request.scheduledDate) < new Date() && request.stage !== 'Repaired' && request.stage !== 'Scrap';
  const isDraggable = !!onDragStart;

  return (
    <div
      draggable={isDraggable}
      onDragStart={isDraggable ? () => onDragStart(request) : undefined}
      className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border-l-4 ${
        isDraggable ? 'cursor-move' : 'cursor-default'
      } ${
        isOverdue ? 'border-l-red-500 border-r border-t border-b border-slate-200' : 'border border-slate-200'
      }`}
    >
      {isOverdue && (
        <div className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-t-lg">
          OVERDUE
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className={`font-semibold text-sm flex-1 ${isOverdue ? 'text-red-700' : 'text-slate-800'}`}>
            {request.subject}
          </h4>
          {isOverdue && (
            <AlertCircle className="text-red-500 flex-shrink-0" size={16} />
          )}
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
      </div>
    </div>
  );
};

export default RequestCard;
