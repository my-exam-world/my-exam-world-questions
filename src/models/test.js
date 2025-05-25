import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import { slug as slugify } from "github-slugger";

const testSchema = new mongoose.Schema({
  teacherId: mongoose.Schema.Types.ObjectId,
  testName: String,
  testStatus: Boolean,
  totalMinutes: Number,
  category: String,
  questions: [{
    questionNumber: Number,
    questionText: String,
    options: [String],
    correctAnswer: String,
  }],
  totalMarks: Number,
  correctAnswers: Array,
  submittedBy: Array,
  teacherName: String,
  testSeries: String,
}, { collection: 'tests' });

let Test;
try {
  Test = mongoose.model('Test');
} catch {
  Test = mongoose.model('Test', testSchema);
}

// Helper function to create slug
function createSlug(text) {
  return text.toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function getQuestionBySlug(testId, questionSlug) {
  await dbConnect();
  
  try {
    const test = await Test.findById(testId).exec();
    if (!test) return null;
    const decodedSlug = decodeURIComponent(questionSlug);
    const question = test.questions.find(q => 
      
      slugify(q.questionText).replace(/-+$/, '') === decodedSlug
    );


    if (!question) return null;

    const answerIndex = test.correctAnswers[question.questionNumber - 1];
    const correctAnswer = question.options[answerIndex];

    return {
      testId: test._id,
      testName: test.testName,
      questionNumber: question.questionNumber,
      questionText: question.questionText,
      options: question.options,
      correctAnswer: {
        index: answerIndex,
        text: correctAnswer
      },
      totalMarks: test.totalMarks,
      category: test.category
    };
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
}

export async function getAllTests() {
  await dbConnect();
  try {
    return await Test.find({}).select('_id questions updatedAt createdAt').lean();
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
}