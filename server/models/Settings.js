import mongoose from 'mongoose';

// Singleton document (there is only ever one Settings row) holding the
// secret codes required to self-register as reporter/admin. Storing these
// in the database (instead of only .env) lets an admin rotate them from
// the app itself, without editing files or restarting the server.
const settingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: 'global',
      unique: true,
    },
    reporterSecretCode: {
      type: String,
      required: true,
    },
    adminSecretCode: {
      type: String,
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Fetches the single settings doc, creating it from .env defaults the
// first time the app runs (so nothing breaks if it doesn't exist yet).
settingsSchema.statics.getOrCreate = async function () {
  let settings = await this.findOne({ key: 'global' });
  if (!settings) {
    settings = await this.create({
      key: 'global',
      reporterSecretCode: process.env.REPORTER_SECRET_CODE || 'reporter-secret-2026',
      adminSecretCode: process.env.ADMIN_SECRET_CODE || 'admin-secret-2026',
    });
  }
  return settings;
};

export default mongoose.model('Settings', settingsSchema);
