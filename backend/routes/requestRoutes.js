import express from 'express';
import MaintenanceRequest from '../models/MaintenanceRequest.js';
import Equipment from '../models/Equipment.js';
import Team from '../models/Team.js';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/manager', requireAuth, async (req, res) => {
  try {
    if (req.user.role !== 'MANAGER') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const requests = await MaintenanceRequest.find()
      .populate('equipment')
      .populate('maintenanceTeam')
      .sort({ createdAt: -1 });

    return res.json(requests);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get('/technician', requireAuth, async (req, res) => {
  try {
    if (req.user.role !== 'TECHNICIAN') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const filter = {
      $or: [
        { assignedToUser: req.user._id },
        { assignedToUser: { $exists: false } },
        { assignedToUser: null },
      ],
    };

    if (req.user.teamId) {
      filter.$or = [
        { assignedToUser: req.user._id },
        { assignedToUser: null, maintenanceTeam: req.user.teamId },
        { assignedToUser: { $exists: false }, maintenanceTeam: req.user.teamId },
      ];
    } else {
      filter.$or = [{ assignedToUser: req.user._id }];
    }

    const requests = await MaintenanceRequest.find(filter)
      .populate('equipment')
      .populate('maintenanceTeam')
      .sort({ createdAt: -1 });

    return res.json(requests);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get('/technicians', requireAuth, async (req, res) => {
  try {
    if (req.user.role !== 'MANAGER') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const technicians = await User.find({ role: 'TECHNICIAN', active: true })
      .select('_id name email teamId')
      .sort({ name: 1 });

    return res.json(technicians);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find()
      .populate('equipment')
      .populate('maintenanceTeam')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/calendar', async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find({ requestType: 'Preventive' })
      .populate('equipment')
      .populate('maintenanceTeam')
      .sort({ scheduledDate: 1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const request = await MaintenanceRequest.findById(req.params.id)
      .populate('equipment')
      .populate('maintenanceTeam');
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.body.equipment).populate('maintenanceTeam');

    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    if (equipment.isScrapped || equipment.status === 'Scrapped') {
      return res.status(400).json({ message: 'Cannot create maintenance request for scrapped equipment' });
    }

    // Validate: If requestType is Preventive, scheduledDate is required
    if (req.body.requestType === 'Preventive' && !req.body.scheduledDate) {
      return res.status(400).json({ message: 'Scheduled date is required for Preventive requests' });
    }

    // Validate: Scheduled date cannot be in the past
    if (req.body.scheduledDate) {
      const scheduledDate = new Date(req.body.scheduledDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      scheduledDate.setHours(0, 0, 0, 0);
      
      if (scheduledDate < today) {
        return res.status(400).json({ message: 'Scheduled date cannot be in the past. Please select a future date.' });
      }
    }

    const requestData = {
      ...req.body,
      equipmentCategory: equipment.category,
      maintenanceTeam: equipment.maintenanceTeam._id,
      stage: 'New',
      status: 'New'
    };

    // Auto-fill default technician if available
    if (
      (!requestData.assignedTo || !requestData.assignedTo.email) &&
      equipment.defaultTechnician &&
      equipment.defaultTechnician.email
    ) {
      requestData.assignedTo = {
        name: equipment.defaultTechnician.name || '',
        email: equipment.defaultTechnician.email || '',
        avatar: ''
      };
    }

    const request = new MaintenanceRequest(requestData);
    const newRequest = await request.save();
    const populated = await MaintenanceRequest.findById(newRequest._id)
      .populate('equipment')
      .populate('maintenanceTeam');
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Assign self to a request (Manager or Technician)
router.patch('/:id/assign-self', requireAuth, async (req, res) => {
  try {
    const request = await MaintenanceRequest.findById(req.params.id)
      .populate('maintenanceTeam');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Only MANAGER or TECHNICIAN can assign
    if (req.user.role !== 'MANAGER' && req.user.role !== 'TECHNICIAN') {
      return res.status(403).json({ message: 'Only managers or technicians can assign themselves' });
    }

    if (request.assignedToUser || (request.assignedTo && request.assignedTo.email)) {
      if (req.user.role === 'TECHNICIAN') {
        return res.status(400).json({ message: 'Request is already assigned' });
      }
    }

    // For TECHNICIAN: validate they are in the same team
    if (req.user.role === 'TECHNICIAN') {
      if (!request.maintenanceTeam) {
        return res.status(400).json({ message: 'Request has no maintenance team assigned' });
      }

      // Check if user's teamId matches the request's maintenanceTeam
      if (req.user.teamId && req.user.teamId.toString() !== request.maintenanceTeam._id.toString()) {
        // Also check if user is in the team's members list
        const team = await Team.findById(request.maintenanceTeam._id);
        const isMember = team && team.members.some(
          member => member.email.toLowerCase() === req.user.email.toLowerCase()
        );
        
        if (!isMember) {
          return res.status(403).json({ message: 'You can only assign yourself to requests from your team' });
        }
      }
    }

    request.assignedTo = {
      name: req.user.name,
      email: req.user.email,
      avatar: ''
    };
    request.assignedToUser = req.user._id;

    if (req.user.role === 'TECHNICIAN') {
      if (request.maintenanceTeam) {
        const existingInProgress = await MaintenanceRequest.findOne({
          maintenanceTeam: request.maintenanceTeam._id,
          stage: 'In Progress',
          _id: { $ne: request._id }
        });
        if (existingInProgress) {
          return res.status(400).json({ message: 'This maintenance team already has an In Progress request' });
        }
      }
      request.stage = 'In Progress';
      request.status = 'In Progress';
      request.startedAt = new Date();
    }

    const updated = await request.save();
    const populated = await MaintenanceRequest.findById(updated._id)
      .populate('equipment')
      .populate('maintenanceTeam');
    
    res.json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Start work on a request (Technician only, must be assigned)
router.patch('/:id/start', requireAuth, async (req, res) => {
  try {
    const request = await MaintenanceRequest.findById(req.params.id)
      .populate('maintenanceTeam');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Only TECHNICIAN or MANAGER can start
    if (req.user.role !== 'TECHNICIAN' && req.user.role !== 'MANAGER') {
      return res.status(403).json({ message: 'Only technicians or managers can start work' });
    }

    // For TECHNICIAN: validate they are assigned and in same team
    if (req.user.role === 'TECHNICIAN') {
      if (!request.assignedTo || request.assignedTo.email.toLowerCase() !== req.user.email.toLowerCase()) {
        return res.status(403).json({ message: 'You must be assigned to this request to start work' });
      }

      if (!request.maintenanceTeam) {
        return res.status(400).json({ message: 'Request has no maintenance team assigned' });
      }

      // Check team membership
      const team = await Team.findById(request.maintenanceTeam._id);
      const isMember = team && team.members.some(
        member => member.email.toLowerCase() === req.user.email.toLowerCase()
      );
      
      if (!isMember && (!req.user.teamId || req.user.teamId.toString() !== request.maintenanceTeam._id.toString())) {
        return res.status(403).json({ message: 'You can only start work on requests from your team' });
      }
    }

    if (request.stage !== 'New') {
      return res.status(400).json({ message: 'Request must be in "New" status to start work' });
    }

    request.stage = 'In Progress';
    request.status = 'In Progress';
    request.startedAt = new Date();

    const updated = await request.save();
    const populated = await MaintenanceRequest.findById(updated._id)
      .populate('equipment')
      .populate('maintenanceTeam');
    
    res.json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Complete a request (Technician only, must be assigned and in progress)
router.patch('/:id/complete', requireAuth, async (req, res) => {
  try {
    const { hoursSpent } = req.body;

    if (!hoursSpent || hoursSpent <= 0) {
      return res.status(400).json({ message: 'hoursSpent is required and must be greater than 0' });
    }

    const request = await MaintenanceRequest.findById(req.params.id)
      .populate('maintenanceTeam');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Only TECHNICIAN or MANAGER can complete
    if (req.user.role !== 'TECHNICIAN' && req.user.role !== 'MANAGER') {
      return res.status(403).json({ message: 'Only technicians or managers can complete work' });
    }

    // For TECHNICIAN: validate they are assigned and in same team
    if (req.user.role === 'TECHNICIAN') {
      const assignedToUserId = request.assignedToUser ? request.assignedToUser.toString() : null;
      if (assignedToUserId && assignedToUserId !== req.user._id.toString()) {
        return res.status(403).json({ message: 'You must be assigned to this request to complete it' });
      }
      if (!assignedToUserId && (!request.assignedTo || request.assignedTo.email.toLowerCase() !== req.user.email.toLowerCase())) {
        return res.status(403).json({ message: 'You must be assigned to this request to complete it' });
      }

      if (!request.maintenanceTeam) {
        return res.status(400).json({ message: 'Request has no maintenance team assigned' });
      }

      // Check team membership
      const team = await Team.findById(request.maintenanceTeam._id);
      const isMember = team && team.members.some(
        member => member.email.toLowerCase() === req.user.email.toLowerCase()
      );
      
      if (!isMember && (!req.user.teamId || req.user.teamId.toString() !== request.maintenanceTeam._id.toString())) {
        return res.status(403).json({ message: 'You can only complete requests from your team' });
      }
    }

    if (request.stage !== 'In Progress') {
      return res.status(400).json({ message: 'Request must be in "In Progress" status to complete' });
    }

    request.stage = 'Repaired';
    request.status = 'Repaired';
    request.completedAt = new Date();
    request.completedDate = new Date();
    request.hoursSpent = hoursSpent;
    request.duration = hoursSpent; // Keep duration in sync

    const updated = await request.save();
    const populated = await MaintenanceRequest.findById(updated._id)
      .populate('equipment')
      .populate('maintenanceTeam');
    
    res.json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    // Validate: Scheduled date cannot be in the past (only for new scheduled dates)
    if (req.body.scheduledDate) {
      const scheduledDate = new Date(req.body.scheduledDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      scheduledDate.setHours(0, 0, 0, 0);
      
      if (scheduledDate < today) {
        return res.status(400).json({ message: 'Scheduled date cannot be in the past. Please select a future date.' });
      }
    }

    if (req.body.stage === 'In Progress') {
      const current = await MaintenanceRequest.findById(req.params.id).select('maintenanceTeam');
      if (current?.maintenanceTeam) {
        const existingInProgress = await MaintenanceRequest.findOne({
          maintenanceTeam: current.maintenanceTeam,
          stage: 'In Progress',
          _id: { $ne: req.params.id }
        });
        if (existingInProgress) {
          return res.status(400).json({ message: 'This maintenance team already has an In Progress request' });
        }
      }
    }

    if (req.body.stage === 'Scrap' && req.body.equipment) {
      await Equipment.findByIdAndUpdate(
        req.body.equipment,
        { status: 'Scrapped', isScrapped: true, notes: 'Equipment scrapped due to maintenance request' }
      );
    }

    // Keep status and stage in sync
    if (req.body.stage && !req.body.status) {
      req.body.status = req.body.stage;
    }
    if (req.body.status && !req.body.stage) {
      req.body.stage = req.body.status;
    }

    if (req.body.stage === 'Repaired' && !req.body.completedDate) {
      req.body.completedDate = new Date();
    }
    if (req.body.stage === 'Repaired' && !req.body.completedAt) {
      req.body.completedAt = new Date();
    }

    const request = await MaintenanceRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('equipment')
      .populate('maintenanceTeam');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const request = await MaintenanceRequest.findByIdAndDelete(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/:id/assign-manager', requireAuth, async (req, res) => {
  try {
    if (req.user.role !== 'MANAGER') {
      return res.status(403).json({ message: 'Only managers can assign technicians' });
    }

    const { technicianId } = req.body;
    if (!technicianId) {
      return res.status(400).json({ message: 'technicianId is required' });
    }

    const [request, technician] = await Promise.all([
      MaintenanceRequest.findById(req.params.id).populate('maintenanceTeam'),
      User.findById(technicianId),
    ]);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    if (!technician || technician.role !== 'TECHNICIAN') {
      return res.status(404).json({ message: 'Technician not found' });
    }

    request.assignedTo = {
      name: technician.name,
      email: technician.email,
      avatar: ''
    };
    request.assignedToUser = technician._id;

    const updated = await request.save();
    const populated = await MaintenanceRequest.findById(updated._id)
      .populate('equipment')
      .populate('maintenanceTeam');

    return res.json(populated);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.patch('/:id/scrap', requireAuth, async (req, res) => {
  try {
    const { hoursSpent } = req.body;
    if (!hoursSpent || hoursSpent <= 0) {
      return res.status(400).json({ message: 'hoursSpent is required and must be greater than 0' });
    }

    const request = await MaintenanceRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (req.user.role !== 'MANAGER' && req.user.role !== 'TECHNICIAN') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (req.user.role === 'TECHNICIAN') {
      const assignedToUserId = request.assignedToUser ? request.assignedToUser.toString() : null;
      if (assignedToUserId && assignedToUserId !== req.user._id.toString()) {
        return res.status(403).json({ message: 'You can only scrap requests assigned to you' });
      }
      if (!assignedToUserId && request.assignedTo?.email?.toLowerCase() !== req.user.email?.toLowerCase()) {
        return res.status(403).json({ message: 'You can only scrap requests assigned to you' });
      }
    }

    request.stage = 'Scrap';
    request.status = 'Scrap';
    request.hoursSpent = hoursSpent;
    request.duration = hoursSpent;
    request.completedAt = new Date();
    request.completedDate = new Date();

    const updatedRequest = await request.save();

    const note = `Equipment scrapped due to maintenance request ${updatedRequest._id.toString()}`;
    const equipment = await Equipment.findById(updatedRequest.equipment);
    if (equipment) {
      const existing = equipment.notes ? equipment.notes.toString() : '';
      equipment.isScrapped = true;
      equipment.status = 'Scrapped';
      equipment.notes = existing ? `${existing}\n${note}` : note;
      await equipment.save();
    }

    const populated = await MaintenanceRequest.findById(updatedRequest._id)
      .populate('equipment')
      .populate('maintenanceTeam');

    return res.json(populated);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

export default router;
