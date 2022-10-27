import mongoose from "mongoose";
const { Schema, model } = mongoose;

const quizScheduleSchema = new Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  courseScheduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "courseSchedule",
  },
  courseLessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "courseLesson",
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  questions: {
    type: Object,
  },
  answers: {
    type: Object,
  },
  scheduleLesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UpcomingSchedule",
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "quiz",
  },
  quizStatus: {
    type: String,
    enum: ["Pending", "Completed", "Reviewed"],
    default: "Pending",
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },
  scored: {
    type: String,
  },
  reviewAnswer: {
    type: Object,
  },
  reviewStatus: {
    type: String,
    enum: ["Open", "OnReview", "ReviewCompleted"],
    default: "Open",
  },
});

quizScheduleSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

quizScheduleSchema.set("autoIndex", true);

const quizSchedule = model("quizSchedule", quizScheduleSchema);

export default quizSchedule;
