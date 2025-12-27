import mongoose from 'mongoose';

const maintenanceRequestSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true
  },
  description: String,
  equipment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment',
    required: true
  },
  equipmentCategory: String,
  maintenanceTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  assignedTo: {
    name: String,
    email: String,
    avatar: String
  },
  requestType: {
    type: String,
    enum: ['Corrective', 'Preventive'],
    required: true
  },
  stage: {
    type: String,
    enum: ['New', 'In Progress', 'Repaired', 'Scrap'],
    default: 'New'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  completedDate: Date,
  duration: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: String,
    required: true
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

maintenanceRequestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('MaintenanceRequest', maintenanceRequestSchema);
