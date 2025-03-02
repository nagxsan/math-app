import mongoose from 'mongoose';

const OptionSchema = new mongoose.Schema({
  number: { type: Number, required: true },
  value: { type: String, required: true }
});

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [OptionSchema], required: true },
  correctOption: { type: Number, required: true }
});

const QuizSchema = new mongoose.Schema({
  quiz: { type: [QuestionSchema], required: true }
});

const QuizModel = mongoose.models.quizzes || mongoose.model("quizzes", QuizSchema);

export default QuizModel;
