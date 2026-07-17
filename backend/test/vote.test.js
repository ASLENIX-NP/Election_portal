const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
process.env.NODE_ENV = "test"; // Stop server from starting
const { app, server } = require("../server");
const Student = require("../models/Student");
const Candidate = require("../models/Candidate");
const Position = require("../models/Position");
const bcrypt = require("bcryptjs");

describe("Vote API", () => {
  let posId;

  beforeAll(async () => {
    if(mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/school_election_test");
    }
    // Create a position to satisfy Candidate schema
    const pos = await Position.create({ title: "President", maxVotes: 1 });
    posId = pos._id;
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  afterEach(async () => {
    await Student.deleteMany({});
    await Candidate.deleteMany({});
    await Position.deleteMany({});
  });

  it("should block voting if student has already voted", async () => {
    const pos = await Position.create({ title: "President", maxVotes: 1 });
    const pwd = await bcrypt.hash("pass", 10);
    const student = await Student.create({
      studentId: "STU001",
      fullName: "Test Student",
      password: pwd,
      gender: "Male",
      rollNumber: "1",
      section: "A",
      grade: "10",
      hasVoted: true
    });

    const res = await request(app)
      .post("/api/votes/cast")
      .send({
        studentId: "STU001",
        candidateIds: [new mongoose.Types.ObjectId()]
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Voter has already cast a ballot");
  });

  it("should record a vote for a valid student", async () => {
    const pos = await Position.create({ title: "VP", maxVotes: 1 });
    const candidate = await Candidate.create({
      name: "John Doe",
      position: pos._id,
      votes: 0,
      avatar: "J",
      color: "#000"
    });

    const pwd = await bcrypt.hash("pass", 10);
    const student = await Student.create({
      studentId: "STU002",
      fullName: "Test Student 2",
      password: pwd,
      gender: "Female",
      rollNumber: "2",
      section: "B",
      grade: "11",
      hasVoted: false
    });

    const res = await request(app)
      .post("/api/votes/cast")
      .send({
        studentId: "STU002",
        candidateIds: [candidate._id]
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("Vote cast successfully");

    const updatedStudent = await Student.findOne({ studentId: "STU002" });
    expect(updatedStudent.hasVoted).toBe(true);

    const updatedCandidate = await Candidate.findById(candidate._id);
    expect(updatedCandidate.votes).toBe(1);
  });
});
