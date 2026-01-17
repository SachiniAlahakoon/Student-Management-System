const pool = require('./db');
const bcrypt = require('bcryptjs');

async function seedUsers() {
  try {
    // Passwords
    const studentPassword = await bcrypt.hash('Student@123', 10);
    const teacherPassword = await bcrypt.hash('Teacher@123', 10);

    // Insert Student
    await pool.query(
      `INSERT INTO users (username, email, password_hash, role)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE username=username`,
      ['student1', 'student1@mail.com', studentPassword, 'student']
    );

    // Insert Teacher
    await pool.query(
      `INSERT INTO users (username, email, password_hash, role)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE username=username`,
      ['teacher1', 'teacher1@mail.com', teacherPassword, 'teacher']
    );

    console.log('✅ Student and Teacher users seeded successfully');
    process.exit(0);

  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seedUsers();
