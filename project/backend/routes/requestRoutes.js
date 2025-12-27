import express from 'express';
import MaintenanceRequest from '../models/MaintenanceRequest.js';
import Equipment from '../models/Equipment.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

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

// Anyone can create a request
router.post('/', async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.body.equipment).populate('maintenanceTeam');

    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    const requestData = {
      ...req.body,
      equipmentCategory: equipment.category,
      // Use maintenanceTeam from request body if provided, otherwise use equipment's team
      maintenanceTeam: req.body.maintenanceTeam || equipment.maintenanceTeam._id,
      createdBy: req.user.name || req.user.email
    };

    // Auto-assign default technician if not already assigned
    if (!req.body.assignedTo?.name && equipment.defaultTechnician?.name) {
      requestData.assignedTo = {
        name: equipment.defaultTechnician.name,
        email: equipment.defaultTechnician.email || '',
        avatar: equipment.defaultTechnician.avatar || ''
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

router.put('/:id', async (req, res) => {
  try {
    const request = await MaintenanceRequest.findById(req.params.id).populate('equipment');
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (req.body.stage === 'Scrap') {
      // Mark equipment as scrapped with detailed notes
      const scrapNote = `Equipment scrapped on ${new Date().toISOString()} due to maintenance request: ${request.subject || 'N/A'}. ${req.body.notes || ''}`;
      await Equipment.findByIdAndUpdate(
        request.equipment._id,
        { 
          status: 'Scrapped',
          notes: scrapNote
        }
      );
      // Add note to request
      req.body.notes = scrapNote;
    }

    if (req.body.stage === 'Repaired' && !req.body.completedDate) {
      req.body.completedDate = new Date();
      // Update equipment status back to Active if it was under maintenance
      if (request.equipment && request.equipment.status === 'Under Maintenance') {
        await Equipment.findByIdAndUpdate(
          request.equipment._id,
          { status: 'Active' }
        );
      }
    }

    if (req.body.stage === 'In Progress' && request.equipment && request.equipment.status === 'Active') {
      // Mark equipment as under maintenance when work starts
      await Equipment.findByIdAndUpdate(
        request.equipment._id,
        { status: 'Under Maintenance' }
      );
    }

    const updatedRequest = await MaintenanceRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('equipment')
      .populate('maintenanceTeam');

    res.json(updatedRequest);
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

export default router;
