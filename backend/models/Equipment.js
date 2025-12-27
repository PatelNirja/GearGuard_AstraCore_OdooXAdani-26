import mongoose from 'mongoose';

const equipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  serialNumber: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Machine', 'Vehicle', 'Computer', 'Tool', 'Other']
  },
  customCategory: {
    type: String
  },
  department: {
    type: String,
    required: true
  },
  assignedTo: {
    type: String,
    required: true
  },
  maintenanceTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  defaultTechnician: {
    name: String,
    email: String
  },
  purchaseDate: {
    type: Date,
    required: true
  },
  warrantyExpiry: Date,
  location: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Under Maintenance', 'Scrapped'],
    default: 'Active'
  },
  isScrapped: {
    type: Boolean,
    default: false
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Equipment', equipmentSchema);
