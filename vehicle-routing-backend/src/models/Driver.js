/**
 * Mongoose model for drivers collection
 * CommonJS module.
 */
const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  contactNumber: { type: String, required: true, index: true },
  vehicleName: { type: String },
  licenseNumber: { type: String, required: true, unique: true, index: true },
  distanceDriven: { type: Number, default: 0 },
  passwordHash: { type: String, required: true },
}, { timestamps: true });

// Compound/index declarations (already added via field options, keep explicit)
DriverSchema.index({ userId: 1 });
DriverSchema.index({ licenseNumber: 1 });
DriverSchema.index({ contactNumber: 1 });

module.exports = mongoose.models.Driver || mongoose.model('Driver', DriverSchema);
