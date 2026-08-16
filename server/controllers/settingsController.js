import Settings from '../models/Settings.js';

// @route  GET /api/settings
// @access admin only
export const getSettings = async (req, res) => {
  try {
    const settings = await Settings.getOrCreate();
    res.json({
      reporterSecretCode: settings.reporterSecretCode,
      adminSecretCode: settings.adminSecretCode,
      updatedAt: settings.updatedAt,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load settings', error: err.message });
  }
};

// @route  PUT /api/settings
// @access admin only
// @desc   Rotate the reporter/admin secret codes. Either field is optional —
//         send only the one(s) you want to change.
export const updateSettings = async (req, res) => {
  try {
    const { reporterSecretCode, adminSecretCode } = req.body;

    if (!reporterSecretCode && !adminSecretCode) {
      return res.status(400).json({ message: 'Provide a new reporter and/or admin secret code' });
    }

    if (reporterSecretCode && reporterSecretCode.length < 6) {
      return res.status(400).json({ message: 'Reporter secret code must be at least 6 characters' });
    }
    if (adminSecretCode && adminSecretCode.length < 6) {
      return res.status(400).json({ message: 'Admin secret code must be at least 6 characters' });
    }

    const settings = await Settings.getOrCreate();
    if (reporterSecretCode) settings.reporterSecretCode = reporterSecretCode;
    if (adminSecretCode) settings.adminSecretCode = adminSecretCode;
    settings.updatedBy = req.user._id;
    await settings.save();

    res.json({
      message: 'Secret codes updated',
      reporterSecretCode: settings.reporterSecretCode,
      adminSecretCode: settings.adminSecretCode,
      updatedAt: settings.updatedAt,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update settings', error: err.message });
  }
};
