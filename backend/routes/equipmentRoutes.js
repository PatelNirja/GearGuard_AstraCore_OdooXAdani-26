import express from 'express';
import Equipment from '../models/Equipment.js';
import MaintenanceRequest from '../models/MaintenanceRequest.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const equipment = await Equipment.find()
      .populate('maintenanceTeam')
      .sort({ createdAt: -1 });
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id)
      .populate('maintenanceTeam');
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id/requests', async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find({ equipment: req.params.id })
      .populate('equipment')
      .populate('maintenanceTeam')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id/requests/count', async (req, res) => {
  try {
    const count = await MaintenanceRequest.countDocuments({
      equipment: req.params.id,
      stage: { $in: ['New', 'In Progress'] }
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    if (!req.body.maintenanceTeam) {
      return res.status(400).json({ message: 'Maintenance team is required' });
    }
    if (!req.body.defaultTechnician || !req.body.defaultTechnician.email) {
      return res.status(400).json({ message: 'Default technician email is required' });
    }
    const equipment = new Equipment(req.body);
    const newEquipment = await equipment.save();
    const populated = await Equipment.findById(newEquipment._id)
      .populate('maintenanceTeam');
    res.status(201).json(populated);
  } catch (error) {
    if (error && error.code === 11000 && error.keyPattern && error.keyPattern.serialNumber) {
      return res.status(409).json({ message: 'Serial number already exists. Please use a unique serial number.' });
    }
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    if (req.body.maintenanceTeam === null || req.body.maintenanceTeam === '') {
      return res.status(400).json({ message: 'Maintenance team is required' });
    }
    if (req.body.defaultTechnician && !req.body.defaultTechnician.email) {
      return res.status(400).json({ message: 'Default technician email is required' });
    }
    const equipment = await Equipment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('maintenanceTeam');
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    res.json(equipment);
  } catch (error) {
    if (error && error.code === 11000 && error.keyPattern && error.keyPattern.serialNumber) {
      return res.status(409).json({ message: 'Serial number already exists. Please use a unique serial number.' });
    }
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndDelete(req.params.id);
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    res.json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
