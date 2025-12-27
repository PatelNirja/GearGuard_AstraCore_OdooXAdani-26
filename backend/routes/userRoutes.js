import express from 'express';
import { body, validationResult } from 'express-validator';
import { requireAuth } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/me', requireAuth, async (req, res) => {
  return res.json({ user: req.user });
});

router.put(
  '/me',
  requireAuth,
  [
    body('employeeId').optional().isString().trim(),
    body('phoneNumber').optional().isString().trim(),
    body('department').optional().isString().trim(),
    body('jobTitle').optional().isString().trim(),
    body('profilePhotoUrl').optional().isString().trim(),
    body('notificationPreferences').optional().isIn(['EMAIL', 'IN_APP', 'BOTH', 'NONE']),
    body('language').optional().isString().trim(),
    body('theme').optional().isIn(['light', 'dark', 'system']),
    body('availabilityStatus').optional().isIn(['AVAILABLE', 'ON_LEAVE']),
    body('skills').optional().isArray(),
    body('skills.*').optional().isString().trim(),
    body('specialization').optional().isString().trim(),
    body('certification').optional().isString().trim(),
    body('yearsOfExperience').optional().isInt({ min: 0, max: 80 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    try {
      const allowed = [
        'employeeId',
        'phoneNumber',
        'department',
        'jobTitle',
        'profilePhotoUrl',
        'notificationPreferences',
        'language',
        'theme',
        'availabilityStatus',
        'skills',
        'specialization',
        'certification',
        'yearsOfExperience',
      ];

      const update = {};
      for (const key of allowed) {
        if (Object.prototype.hasOwnProperty.call(req.body, key)) {
          update[key] = req.body[key];
        }
      }

      const user = await User.findByIdAndUpdate(req.user._id, update, {
        new: true,
        runValidators: true,
      }).select('-passwordHash');

      return res.json({ user });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
);

export default router;
