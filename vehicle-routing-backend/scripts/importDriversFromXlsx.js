/**
 * Script to import drivers from an Excel file into MongoDB
 * Usage: node scripts/importDriversFromXlsx.js path/to/drivers.xlsx
 */
const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
require('dotenv').config();

const Driver = require('../src/models/Driver');

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
const MONGODB_URI = process.env.MONGODB_URI;

async function main() {
  const args = process.argv.slice(2);
  if (!args[0]) {
    console.error('Usage: node scripts/importDriversFromXlsx.js path/to/drivers.xlsx');
    process.exit(1);
  }
  const filePath = path.resolve(args[0]);
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    process.exit(1);
  }
  if (!MONGODB_URI) {
    console.error('MONGODB_URI not set in environment');
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  const wb = xlsx.readFile(filePath);
  const sheetName = wb.SheetNames[0];
  const data = xlsx.utils.sheet_to_json(wb.Sheets[sheetName]);

  const docs = [];
  for (const row of data) {
    // Map common column names to our schema
    const userId = row.userId || row.UserId || row['User ID'] || row.email || row.Email;
    const name = row.name || row.Name || row.driverName || row.DriverName;
    const contactNumber = row.contactNumber || row.contact || row.phone || row.Phone;
    const vehicleName = row.vehicleName || row.vehicle || row.Vehicle;
    const licenseNumber = row.licenseNumber || row.license || row.License || row['License Number'];
    const password = row.password || row.pass || 'changeme123';

    if (!userId || !name || !contactNumber || !licenseNumber) {
      console.warn('Skipping row - missing required fields', row);
      continue;
    }

    const passwordHash = await bcrypt.hash(String(password), SALT_ROUNDS);
    docs.push({ userId: String(userId), name: String(name), contactNumber: String(contactNumber), vehicleName: vehicleName || '', licenseNumber: String(licenseNumber), passwordHash });
  }

  if (docs.length === 0) {
    console.log('No valid rows to import');
    process.exit(0);
  }

  try {
    const res = await Driver.insertMany(docs, { ordered: false });
    console.log(`Inserted ${res.length} drivers`);
  } catch (err) {
    console.error('Import finished with errors (duplicate keys may be expected):', err.message || err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
