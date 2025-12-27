import { useState, useEffect } from 'react';
import { Plus, Package, Wrench, MapPin, Calendar, Edit, Trash2, X } from 'lucide-react';
import { api } from '../utils/api';
import { authStore } from '../utils/auth';

const EquipmentManager = ({ equipment, teams, onUpdate }) => {
  const user = authStore.getUser();
  const userRole = user?.role?.toUpperCase() || 'USER';
  const canManage = userRole === 'MANAGER';
  const [showModal, setShowModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [equipmentRequests, setEquipmentRequests] = useState([]);
  const [requestCount, setRequestCount] = useState(0);
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [equipmentRequestCounts, setEquipmentRequestCounts] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    serialNumber: '',
    category: 'Machine',
    department: '',
    assignedTo: '',
    maintenanceTeam: '',
    defaultTechnician: { name: '', email: '' },
    purchaseDate: '',
    warrantyExpiry: '',
    location: '',
    status: 'Active',
    notes: ''
  });

  const handleEdit = (eq) => {
    setSelectedEquipment(eq);
    setFormData({
      ...eq,
      maintenanceTeam: eq.maintenanceTeam?._id || '',
      purchaseDate: new Date(eq.purchaseDate).toISOString().split('T')[0],
      warrantyExpiry: eq.warrantyExpiry ? new Date(eq.warrantyExpiry).toISOString().split('T')[0] : ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this equipment?')) {
      try {
        await api.equipment.delete(id);
        onUpdate();
      } catch (error) {
        console.error('Error deleting equipment:', error);
        alert('Failed to delete equipment');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedEquipment) {
        await api.equipment.update(selectedEquipment._id, formData);
      } else {
        await api.equipment.create(formData);
      }
      onUpdate();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving equipment:', error);
      alert('Failed to save equipment');
    }
  };

  const resetForm = () => {
    setSelectedEquipment(null);
    setFormData({
      name: '',
      serialNumber: '',
      category: 'Machine',
      department: '',
      assignedTo: '',
      maintenanceTeam: '',
      defaultTechnician: { name: '', email: '' },
      purchaseDate: '',
      warrantyExpiry: '',
      location: '',
      status: 'Active',
      notes: ''
    });
  };

  const handleViewRequests = async (eq) => {
    try {
      const [requests, countData] = await Promise.all([
        api.equipment.getRequests(eq._id),
        api.equipment.getRequestsCount(eq._id)
      ]);
      setEquipmentRequests(requests);
      setRequestCount(countData.count);
      setSelectedEquipment(eq);
      setShowRequestsModal(true);
    } catch (error) {
      console.error('Error loading requests:', error);
    }
  };

  useEffect(() => {
    const loadRequestCounts = async () => {
      const counts = {};
      for (const eq of equipment) {
        try {
          const countData = await api.equipment.getRequestsCount(eq._id);
          counts[eq._id] = countData.count;
        } catch (error) {
          console.error(`Error loading count for equipment ${eq._id}:`, error);
          counts[eq._id] = 0;
        }
      }
      setEquipmentRequestCounts(counts);
    };

    if (equipment.length > 0) {
      loadRequestCounts();
    }
  }, [equipment]);

  const statusColors = {
    'Active': 'bg-green-100 text-green-800',
    'Under Maintenance': 'bg-yellow-100 text-yellow-800',
    'Scrapped': 'bg-red-100 text-red-800'
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Equipment Management</h2>
          <p className="text-slate-600 mt-1">
            {canManage ? 'Manage your company assets' : 'View equipment list'}
          </p>
        </div>
        {canManage && (
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
          >
            <Plus size={20} />
            Add Equipment
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-auto">
        {equipment.map((eq) => (
          <div
            key={eq._id}
            className="bg-white rounded-xl shadow-md border border-slate-200 p-6 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                  <Package className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{eq.name}</h3>
                  <p className="text-sm text-slate-500">{eq.serialNumber}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[eq.status]}`}>
                {eq.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Package size={16} />
                <span>{eq.category}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin size={16} />
                <span>{eq.location}</span>
              </div>
              <div className="text-sm text-slate-600">
                <span className="font-semibold">Department:</span> {eq.department}
              </div>
              <div className="text-sm text-slate-600">
                <span className="font-semibold">Assigned To:</span> {eq.assignedTo}
              </div>
              {eq.maintenanceTeam && (
                <div className="text-sm text-slate-600">
                  <span className="font-semibold">Team:</span> {eq.maintenanceTeam.name}
                </div>
              )}
            </div>

            <button
              onClick={() => handleViewRequests(eq)}
              className="w-full mb-3 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium relative"
            >
              <Wrench size={16} />
              Maintenance
              {equipmentRequestCounts[eq._id] > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {equipmentRequestCounts[eq._id]}
                </span>
              )}
            </button>

            {canManage && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(eq)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(eq._id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">
                {selectedEquipment ? 'Edit Equipment' : 'Add New Equipment'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Equipment Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Serial Number</label>
                  <input
                    type="text"
                    required
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Machine">Machine</option>
                    <option value="Vehicle">Vehicle</option>
                    <option value="Computer">Computer</option>
                    <option value="Tool">Tool</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Active">Active</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                    <option value="Scrapped">Scrapped</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Department</label>
                  <input
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Production"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Assigned To</label>
                  <input
                    type="text"
                    required
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Employee name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Maintenance Team</label>
                <select
                  required
                  value={formData.maintenanceTeam}
                  onChange={(e) => setFormData({ ...formData, maintenanceTeam: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Team</option>
                  {teams.map((team) => (
                    <option key={team._id} value={team._id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Physical location"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Purchase Date</label>
                  <input
                    type="date"
                    required
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Warranty Expiry</label>
                  <input
                    type="date"
                    value={formData.warrantyExpiry}
                    onChange={(e) => setFormData({ ...formData, warrantyExpiry: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:shadow-lg transition-all duration-200 font-semibold"
                >
                  {selectedEquipment ? 'Update Equipment' : 'Add Equipment'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-200 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showRequestsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Maintenance Requests - {selectedEquipment?.name}
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  {requestCount} open requests
                </p>
              </div>
              <button
                onClick={() => {
                  setShowRequestsModal(false);
                  setSelectedEquipment(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {equipmentRequests.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <Wrench size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No maintenance requests for this equipment</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {equipmentRequests.map((req) => (
                    <div key={req._id} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-slate-800">{req.subject}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          req.stage === 'New' ? 'bg-blue-100 text-blue-700' :
                          req.stage === 'In Progress' ? 'bg-amber-100 text-amber-700' :
                          req.stage === 'Repaired' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {req.stage}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{req.description}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>Type: {req.requestType}</span>
                        <span>Priority: {req.priority}</span>
                        <span>Scheduled: {new Date(req.scheduledDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentManager;
