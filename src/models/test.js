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

// Helper function to prepare text for slug generation (same as in sitemap)
const prepareSlugText = (html, maxLength = 60) => {
  // Remove HTML tags
  let text = html.replace(/<[^>]*>?/gm, '');
  
  // Replace multiple spaces/newlines with single space
  text = text.replace(/\s+/g, ' ').trim();
  
  // Truncate if too long
  if (text.length > maxLength) {
    text = text.substring(0, maxLength);
    // Don't cut words in middle - find last space
    const lastSpace = text.lastIndexOf(' ');
    if (lastSpace > 0) {
      text = text.substring(0, lastSpace);
    }
    text = text + '...';
  }
  
  return text;
};


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
    const question = test.questions.find(q => {
      const cleanText = prepareSlugText(q.questionText);
      const currentSlug = slugify(cleanText).replace(/-+$/, '');
      return currentSlug === decodedSlug
    }
      
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