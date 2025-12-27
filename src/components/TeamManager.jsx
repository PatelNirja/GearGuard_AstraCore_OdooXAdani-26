import { useState } from 'react';
import { Plus, Users, Mail, Phone, Edit, Trash2, X, UserPlus } from 'lucide-react';
import { api } from '../utils/api';
import { authStore } from '../utils/auth';

const TeamManager = ({ teams, onUpdate }) => {
  const user = authStore.getUser();
  const userRole = user?.role?.toUpperCase() || 'USER';
  const canManage = userRole === 'MANAGER';
  
  // Filter teams for technicians - only show teams where they are a member
  const filteredTeams = userRole === 'TECHNICIAN' 
    ? teams.filter(team => 
        team.members?.some(member => 
          member.email?.toLowerCase() === user?.email?.toLowerCase()
        )
      )
    : teams;
  const [showModal, setShowModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    description: '',
    members: []
  });

  const [newMember, setNewMember] = useState({ name: '', email: '', phone: '' });

  const handleEdit = (team) => {
    setSelectedTeam(team);
    setFormData(team);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        await api.teams.delete(id);
        onUpdate();
      } catch (error) {
        console.error('Error deleting team:', error);
        alert('Failed to delete team');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedTeam) {
        await api.teams.update(selectedTeam._id, formData);
      } else {
        await api.teams.create(formData);
      }
      onUpdate();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving team:', error);
      alert('Failed to save team');
    }
  };

  const resetForm = () => {
    setSelectedTeam(null);
    setFormData({
      name: '',
      specialization: '',
      description: '',
      members: []
    });
    setNewMember({ name: '', email: '', phone: '' });
  };

  const addMember = () => {
    if (newMember.name && newMember.email) {
      setFormData({
        ...formData,
        members: [...formData.members, { ...newMember, avatar: '' }]
      });
      setNewMember({ name: '', email: '', phone: '' });
    }
  };

  const removeMember = (index) => {
    setFormData({
      ...formData,
      members: formData.members.filter((_, i) => i !== index)
    });
  };

  const getAvatarInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">Team Management</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {canManage 
              ? 'Manage maintenance teams and members' 
              : userRole === 'TECHNICIAN'
              ? 'View your assigned teams'
              : 'View teams'}
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
            Add Team
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 overflow-auto pb-2">
        {filteredTeams.map((team) => (
          <div
            key={team._id}
            className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-5 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-11 h-11 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="text-green-600 dark:text-green-400" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate">{team.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{team.specialization}</p>
                </div>
              </div>
            </div>

            {team.description && (
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">{team.description}</p>
            )}

            <div className="mb-4">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2.5 uppercase tracking-wide">
                Team Members ({team.members.length})
              </p>
              <div className="space-y-2">
                {team.members.slice(0, 3).map((member, index) => (
                  <div key={index} className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                      {getAvatarInitials(member.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">{member.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{member.email}</p>
                    </div>
                  </div>
                ))}
                {team.members.length > 3 && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">+{team.members.length - 3} more members</p>
                )}
              </div>
            </div>

            {canManage && (
              <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => handleEdit(team)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium"
                >
                  <Edit size={14} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(team._id)}
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
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">
                {selectedTeam ? 'Edit Team' : 'Add New Team'}
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
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Team Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Mechanical Team"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Specialization</label>
                <input
                  type="text"
                  required
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Mechanical Repairs"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Brief description of the team"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Team Members</label>
                <div className="space-y-3">
                  {formData.members.map((member, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-semibold">
                        {getAvatarInitials(member.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700">{member.name}</p>
                        <p className="text-xs text-slate-500">{member.email}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMember(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}

                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-4">
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <input
                        type="text"
                        value={newMember.name}
                        onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        placeholder="Name"
                      />
                      <input
                        type="email"
                        value={newMember.email}
                        onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        placeholder="Email"
                      />
                      <input
                        type="tel"
                        value={newMember.phone}
                        onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        placeholder="Phone"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addMember}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      <UserPlus size={16} />
                      Add Member
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:shadow-lg transition-all duration-200 font-semibold"
                >
                  {selectedTeam ? 'Update Team' : 'Create Team'}
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
    </div>
  );
};

export default TeamManager;
