import mongoose from "mongoose";
const { Schema, model } = mongoose;

const quizSchema = new Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  courseLessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "courseLesson",
  },
  questions: {
    type: JSON,
  },
  answers: {
    type: String,
  },
});

quizSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

quizSchema.set("autoIndex", true);

const quiz = model("quiz", quizSchema);

export default quiz;
