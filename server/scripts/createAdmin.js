#!/usr/bin/env node
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function main() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI environment variable is required');
    process.exit(1);
  }
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  const email = process.env.ADMIN_EMAIL || 'admin@civic-assist.local';
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'Admin@1234';

  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`User with email ${email} already exists. Updating role to Admin.`);
    existing.role = 'Admin';
    await existing.save();
    console.log('User promoted to Admin.');
    process.exit(0);
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashed, role: 'Admin' });
  console.log('Admin user created:');
  console.log(`  email: ${email}`);
  console.log(`  username: ${username}`);
  console.log(`  password: ${password}`);
  console.log('Please change the password after first login.');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
