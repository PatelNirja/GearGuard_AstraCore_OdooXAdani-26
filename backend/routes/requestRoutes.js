import express from 'express';
import MaintenanceRequest from '../models/MaintenanceRequest.js';
import Equipment from '../models/Equipment.js';

const router = express.Router();

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

    const requestData = {
      ...req.body,
      equipmentCategory: equipment.category,
      maintenanceTeam: equipment.maintenanceTeam._id
    };

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
    if (req.body.stage === 'Scrap' && req.body.equipment) {
      await Equipment.findByIdAndUpdate(
        req.body.equipment,
        { status: 'Scrapped', notes: 'Equipment scrapped due to maintenance request' }
      );
    }

    if (req.body.stage === 'Repaired' && !req.body.completedDate) {
      req.body.completedDate = new Date();
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

export default router;
