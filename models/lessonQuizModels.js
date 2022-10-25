import mongoose from "mongoose";
const { Schema, model } = mongoose;

const lessonQuizSchema = new Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  courseLessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "courseLesson",
  },
  questionNumber: {
    type: Number,
  },
  question: {
    type: String,
  },
  option1: {
    type: String,
  },
  option2: {
    type: String,
  },
  option3: {
    type: String,
  },
  option4: {
    type: String,
  },
  checkBox1: {
    type: String,
  },
  checkBox2: {
    type: String,
  },
  checkBox3: {
    type: String,
  },
  checkBox4: {
    type: String,
  },
  answer: {
    type: String,
  },
  type: {
    type: String,
  },
  fileType: {
    type: String,
  },
  answer: {
    type: String,
  },
});

lessonQuizSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

lessonQuizSchema.set("autoIndex", true);

const lessonQuiz = model("LessonQuiz", lessonQuizSchema);

export default lessonQuiz;
