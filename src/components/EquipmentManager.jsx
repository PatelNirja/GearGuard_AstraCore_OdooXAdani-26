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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterEmployee, setFilterEmployee] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    serialNumber: '',
    category: 'Machine',
    customCategory: '',
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
      if (!formData.defaultTechnician?.email) {
        alert('Default technician email is required');
        return;
      }
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
      customCategory: '',
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

  const getUniqueDepartments = () => {
    const depts = new Set();
    equipment.forEach(eq => {
      if (eq.department) depts.add(eq.department);
    });
    return Array.from(depts).sort();
  };

  const getUniqueEmployees = () => {
    const employees = new Set();
    equipment.forEach(eq => {
      if (eq.assignedTo) employees.add(eq.assignedTo);
    });
    return Array.from(employees).sort();
  };

  const getFilteredEquipment = () => {
    return equipment.filter(eq => {
      const matchesSearch = !searchTerm ||
        eq.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        eq.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        eq.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        eq.assignedTo?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment = !filterDepartment ||
        eq.department?.toLowerCase() === filterDepartment.toLowerCase();

      const matchesEmployee = !filterEmployee ||
        eq.assignedTo?.toLowerCase() === filterEmployee.toLowerCase();

      return matchesSearch && matchesDepartment && matchesEmployee;
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">Equipment Management</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {canManage ? 'Manage your company assets' : 'View equipment list'}
          </p>
        </div>
        {canManage && (
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-md transition-all duration-200 font-medium text-sm"
          >
            <Plus size={18} />
            Add Equipment
          </button>
        )}
      </div>

      <div className="mb-6 bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search equipment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Departments</option>
            {getUniqueDepartments().map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <select
            value={filterEmployee}
            onChange={(e) => setFilterEmployee(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Employees</option>
            {getUniqueEmployees().map((emp) => (
              <option key={emp} value={emp}>{emp}</option>
            ))}
          </select>
          {(searchTerm || filterDepartment || filterEmployee) && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setFilterDepartment('');
                setFilterEmployee('');
              }}
              className="px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 overflow-auto pb-2">
        {getFilteredEquipment().map((eq) => (
          <div
            key={eq._id}
            className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-5 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-11 h-11 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package className="text-blue-600 dark:text-blue-400" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate">{eq.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{eq.serialNumber}</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ml-2 flex-shrink-0 ${statusColors[eq.status]}`}>
                {eq.status}
              </span>
            </div>

            <div className="space-y-1.5 mb-4">
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <Package size={14} />
                <span className="truncate">{eq.category === 'Other' && eq.customCategory ? eq.customCategory : eq.category}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <MapPin size={14} />
                <span className="truncate">{eq.location}</span>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                <span className="font-semibold">Dept:</span> <span className="truncate">{eq.department}</span>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                <span className="font-semibold">Assigned:</span> <span className="truncate">{eq.assignedTo}</span>
              </div>
              {eq.maintenanceTeam && (
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-semibold">Team:</span> <span className="truncate">{eq.maintenanceTeam.name}</span>
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
              <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => handleEdit(eq)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium"
                >
                  <Edit size={14} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(eq._id)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs border border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-auto border border-slate-200 dark:border-slate-800">
            <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {selectedEquipment ? 'Edit Equipment' : 'Add New Equipment'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <X size={20} />
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
                    onChange={(e) => {
                      const next = e.target.value;
                      setFormData({
                        ...formData,
                        category: next,
                        customCategory: next === 'Other' ? formData.customCategory : ''
                      });
                    }}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Machine">Machine</option>
                    <option value="Vehicle">Vehicle</option>
                    <option value="Computer">Computer</option>
                    <option value="Tool">Tool</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                {formData.category === 'Other' && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Other Category</label>
                    <input
                      type="text"
                      required
                      value={formData.customCategory}
                      onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter category"
                    />
                  </div>
                )}
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Default Technician Name</label>
                  <input
                    type="text"
                    value={formData.defaultTechnician?.name || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      defaultTechnician: { ...formData.defaultTechnician, name: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Technician name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Default Technician Email</label>
                  <input
                    type="email"
                    required
                    value={formData.defaultTechnician?.email || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      defaultTechnician: { ...formData.defaultTechnician, email: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="tech@example.com"
                  />
                </div>
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
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-auto border border-slate-200 dark:border-slate-800">
            <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  Maintenance Requests - {selectedEquipment?.name}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {requestCount} open requests
                </p>
              </div>
              <button
                onClick={() => {
                  setShowRequestsModal(false);
                  setSelectedEquipment(null);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <X size={20} />
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
