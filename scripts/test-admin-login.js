const bcrypt = require('bcryptjs');

// Test common passwords against the admin user's hash
const adminHash = '$2b$10$xToV3a5CbkkVvxHBuJNniu/yEvn8uCLJQTUDugT7eGWFiobbRYJh6';

const testPasswords = [
  'admin123',
  'password',
  'admin',
  'thinkmoda',
  'ThinkMODA123',
  'admin@thinkmoda',
  'launchpad',
  'LaunchPad123'
];

console.log('Testing passwords for admin@thinkmoda.co...\n');

for (const password of testPasswords) {
  const isValid = bcrypt.compareSync(password, adminHash);
  console.log(`Password: "${password}" - ${isValid ? '✅ VALID' : '❌ Invalid'}`);
}
