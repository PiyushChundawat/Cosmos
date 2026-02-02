// Run this script once to populate subject field in existing TestAttempt records
require('dotenv').config();
const mongoose = require('mongoose');
const TestAttempt = require('../models/Student/testAttempt');
const Test = require('../models/Faculty/test');
const Question = require('../models/Faculty/question');

async function migrateTestAttempts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find all test attempts without subject field
    const attempts = await TestAttempt.find({ subject: { $exists: false } }).lean();
    console.log(`Found ${attempts.length} test attempts without subject`);

    let updated = 0;
    let failed = 0;

    for (const attempt of attempts) {
      try {
        // Get test
        const test = await Test.findById(attempt.testId).lean();
        if (!test) {
          console.log(`Test not found for attempt ${attempt._id}`);
          failed++;
          continue;
        }

        // Get first question to extract subject
        const question = await Question.findOne({
          _id: { $in: test.questionIds }
        }).lean();

        if (!question || !question.tags?.subject) {
          console.log(`No question with subject found for attempt ${attempt._id}`);
          failed++;
          continue;
        }

        // Update attempt with subject
        await TestAttempt.updateOne(
          { _id: attempt._id },
          { $set: { subject: question.tags.subject } }
        );

        updated++;
        console.log(`Updated attempt ${attempt._id} with subject: ${question.tags.subject}`);
      } catch (err) {
        console.error(`Error processing attempt ${attempt._id}:`, err.message);
        failed++;
      }
    }

    console.log('\n=== Migration Complete ===');
    console.log(`✅ Updated: ${updated}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`Total: ${attempts.length}`);

    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateTestAttempts();
