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
  additionalTechnician: {
    name: String,
    email: String,
    avatar: String
  },
  assignedToUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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
  status: {
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
  completedAt: Date,
  startedAt: Date,
  duration: {
    type: Number,
    default: 0
  },
  hoursSpent: {
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
  // Keep status and stage in sync
  if (this.isModified('stage') && !this.isModified('status')) {
    this.status = this.stage;
  }
  if (this.isModified('status') && !this.isModified('stage')) {
    this.stage = this.status;
  }
  // Keep completedDate and completedAt in sync
  if (this.isModified('completedDate') && !this.isModified('completedAt')) {
    this.completedAt = this.completedDate;
  }
  if (this.isModified('completedAt') && !this.isModified('completedDate')) {
    this.completedDate = this.completedAt;
  }
  next();
});

export default mongoose.model('MaintenanceRequest', maintenanceRequestSchema);
