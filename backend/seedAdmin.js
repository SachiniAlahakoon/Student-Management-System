const pool = require('./db');
const bcrypt = require('bcryptjs');

async function seed() {
  const username = 'admin';
  const email = 'admin@swarnamali.lk';
  const password = 'Admin@123'; // change after first login
  const role = 'admin';

  const hash = await bcrypt.hash(password, 10);

  try {
    await pool.query(
      'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE username=username',
      [username, email, hash, role]
    );
    console.log('✅ Admin user seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();
