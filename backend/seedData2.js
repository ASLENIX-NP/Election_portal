const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('./config/db');

const Position = require('./models/Position');
const Candidate = require('./models/Candidate');
const Student = require('./models/Student');
const Election = require('./models/Election');

const seedData = async () => {
  try {
    await connectDB();
    console.log('Database connected for full seeding...');

    // Clear existing data (except Admins/Moderators)
    await Position.deleteMany({});
    await Candidate.deleteMany({});
    await Student.deleteMany({});
    await Election.deleteMany({});

    // 1. Create Election
    const election = await Election.create({
      title: 'Student Council Election 2026',
      startDate: new Date(),
      endDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // +7 days
      status: 'Active',
      eligibleGrades: [9, 10, 11, 12]
    });
    console.log('✅ Election created');

    // 2. Create Positions
    const posPres = await Position.create({ title: 'President', maxWinners: 1 });
    const posVP = await Position.create({ title: 'Vice President', maxWinners: 1 });
    const posRep = await Position.create({ title: 'Student Council Representatives', maxWinners: 4 });
    console.log('✅ Positions created');

    // 3. Create Students (Voters + Candidates)
    const mockNames = [
      'John Doe', 'Jane Smith', 'Michael Chen', 'Alice W.', 'Bob M.',
      'Emma Watson', 'LeBron James', 'Serena W.', 'Tom Holland', 'Zendaya'
    ];
    
    const students = [];
    for (let i = 0; i < 50; i++) {
      const name = i < mockNames.length ? mockNames[i] : `Voter ${i+1}`;
      const student = await Student.create({
        studentId: `STU-${1001 + i}`,
        fullName: name,
        grade: [9, 10, 11, 12][i % 4],
        section: ['A', 'B', 'C'][i % 3],
        rollNumber: i + 1,
        gender: i % 2 === 0 ? 'Male' : 'Female',
        password: `pass${1001 + i}`, // In a real app, hash this
        role: 'student'
      });
      students.push(student);
    }
    console.log('✅ 50 Students created');

    // 4. Create Candidates referencing Students and Positions
    const candidateData = [
      { sIdx: 0, pId: posPres._id, votes: 0 },
      { sIdx: 1, pId: posPres._id, votes: 0 },
      { sIdx: 2, pId: posPres._id, votes: 0 },
      { sIdx: 3, pId: posVP._id, votes: 0 },
      { sIdx: 4, pId: posVP._id, votes: 0 },
      { sIdx: 5, pId: posRep._id, votes: 0 },
      { sIdx: 6, pId: posRep._id, votes: 0 },
      { sIdx: 7, pId: posRep._id, votes: 0 },
      { sIdx: 8, pId: posRep._id, votes: 0 },
      { sIdx: 9, pId: posRep._id, votes: 0 },
    ];

    for (let c of candidateData) {
      await Candidate.create({
        student: students[c.sIdx]._id,
        position: c.pId,
        election: election._id,
        votes: c.votes,
        isApproved: true
      });
    }
    console.log('✅ Candidates created');

    console.log('🎉 Seeding complete. Exiting...');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
