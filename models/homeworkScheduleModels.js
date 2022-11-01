import mongoose from "mongoose";
const { Schema, model } = mongoose;

const homeworkScheduleSchema = new Schema({
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
    type: JSON,
  },
  answers: {
    type: JSON,
  },
  scheduleLesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UpcomingSchedule",
  },
  homeworkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "homework",
  },
  homeworkStatus: {
    type: String,
    enum: ["Pending", "Completed", "Reviewed"],
    default: "Pending",
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },
  remark: {
    type: String,
  },
  reviewAnswer: {
    type:Object
  },
  reviewStatus: {
    type: String,
    enum: ["Open", "OnReview", "ReviewCompleted"],
    default: "Open",
  },
  scored: {
    type: String,
  },
});

homeworkScheduleSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

homeworkScheduleSchema.set("autoIndex", true);

const homeworkSchedule = model("homeworkSchedule", homeworkScheduleSchema);

export default homeworkSchedule;
