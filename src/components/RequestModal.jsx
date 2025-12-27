import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { api } from '../utils/api';
import { authStore } from '../utils/auth';

const RequestModal = ({ equipment, teams, editRequest, onClose, onUpdate }) => {
  const user = authStore.getUser();
  const userRole = user?.role?.toUpperCase() || 'USER';
  const canCreatePreventive = userRole === 'MANAGER';
  const canAssignTechnician = userRole === 'MANAGER' || userRole === 'TECHNICIAN';
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    equipment: '',
    requestType: 'Corrective',
    priority: 'Medium',
    scheduledDate: new Date().toISOString().split('T')[0],
    assignedTo: { name: '', email: '', avatar: '' },
    createdBy: 'Admin User',
    duration: 0
  });

  const [selectedEquipment, setSelectedEquipment] = useState(null);

  useEffect(() => {
    if (editRequest) {
      setFormData({
        ...editRequest,
        equipment: editRequest.equipment._id,
        scheduledDate: new Date(editRequest.scheduledDate).toISOString().split('T')[0]
      });
      setSelectedEquipment(editRequest.equipment);
    }
  }, [editRequest]);

  const handleEquipmentChange = (equipmentId) => {
    const selected = equipment.find(e => e._id === equipmentId);
    setSelectedEquipment(selected);
    setFormData({ ...formData, equipment: equipmentId });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = { ...formData };
      
      // Auto-assign technician if they are creating the request
      if (userRole === 'TECHNICIAN' && !editRequest) {
        submitData.assignedTo = {
          name: user.name || '',
          email: user.email || '',
          avatar: ''
        };
      }
      
      if (editRequest) {
        await api.requests.update(editRequest._id, submitData);
      } else {
        await api.requests.create(submitData);
      }
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error saving request:', error);
      alert('Failed to save request');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">
            {editRequest ? 'Edit Request' : 'New Maintenance Request'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="What needs to be fixed?"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              placeholder="Detailed description..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Equipment</label>
              <select
                required
                value={formData.equipment}
                onChange={(e) => handleEquipmentChange(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Equipment</option>
                {equipment.map((eq) => (
                  <option key={eq._id} value={eq._id}>
                    {eq.name} ({eq.serialNumber})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Request Type</label>
              <select
                value={formData.requestType}
                onChange={(e) => setFormData({ ...formData, requestType: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!canCreatePreventive && formData.requestType === 'Preventive'}
              >
                <option value="Corrective">Corrective</option>
                {canCreatePreventive && <option value="Preventive">Preventive</option>}
              </select>
              {!canCreatePreventive && (
                <p className="text-xs text-slate-500 mt-1">Only managers can create preventive requests</p>
              )}
            </div>
          </div>

          {selectedEquipment && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Category (Auto-filled)</label>
                <input
                  type="text"
                  value={selectedEquipment.category || ''}
                  readOnly
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-100 text-slate-600 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Maintenance Team (Auto-filled)</label>
                <input
                  type="text"
                  value={selectedEquipment.maintenanceTeam?.name || 'N/A'}
                  readOnly
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-100 text-slate-600 cursor-not-allowed"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Scheduled Date</label>
              <input
                type="date"
                required
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Assigned Technician Name</label>
              {userRole === 'TECHNICIAN' && !editRequest ? (
                <input
                  type="text"
                  value={user.name || ''}
                  disabled
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-100 text-slate-600"
                  placeholder="Auto-assigned to you"
                />
              ) : (
                <input
                  type="text"
                  value={formData.assignedTo.name}
                  onChange={(e) => setFormData({ ...formData, assignedTo: { ...formData.assignedTo, name: e.target.value } })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Technician name"
                  disabled={!canAssignTechnician}
                />
              )}
              {userRole === 'TECHNICIAN' && !editRequest && (
                <p className="text-xs text-slate-500 mt-1">You will be auto-assigned to this request</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Duration (hours)</label>
              <input
                type="number"
                min="0"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:shadow-lg transition-all duration-200 font-semibold"
            >
              {editRequest ? 'Update Request' : 'Create Request'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-200 font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestModal;
