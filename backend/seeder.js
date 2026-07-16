const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Admin = require('./models/Admin');
const Moderator = require('./models/Moderator');
const connectDB = require('./config/db');

const seedData = async () => {
  try {
    await connectDB();
    console.log('Database connected for seeding...');

    const salt = await bcrypt.genSalt(10);
    const hashedAdminPassword = await bcrypt.hash('admin123', salt);
    const hashedModPassword = await bcrypt.hash('mod123', salt);

    // Check if admin already exists
    const adminExists = await Admin.findOne({ username: 'admin' });
    if (!adminExists) {
      await Admin.create({
        username: 'admin',
        fullName: 'System Administrator',
        email: 'admin@school.edu',
        password: hashedAdminPassword,
        role: 'admin'
      });
      console.log('✅ Default Admin account created (admin / admin123)');
    } else {
      console.log('ℹ️ Admin account already exists. Skipping...');
    }

    // Check if moderator already exists
    const modExists = await Moderator.findOne({ username: 'mod' });
    if (!modExists) {
      await Moderator.create({
        username: 'mod',
        fullName: 'Station Moderator',
        email: 'mod@school.edu',
        password: hashedModPassword,
        role: 'moderator'
      });
      console.log('✅ Default Moderator account created (mod / mod123)');
    } else {
      console.log('ℹ️ Moderator account already exists. Skipping...');
    }

    console.log('Seeding complete. Exiting...');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
