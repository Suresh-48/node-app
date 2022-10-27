import mongoose from "mongoose";
const { Schema, model } = mongoose;

const teacherUpcomingScheduleSchema = new Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },
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
  lessonDate: {
    type: String,
  },
  lessonEndTime: {
    type: String,
  },
  timeStamp: {
    type: Date,
  },
  zoomStartTime: {
    type: String,
  },
  zoomEndTime: {
    type: String,
  },
});

teacherUpcomingScheduleSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

teacherUpcomingScheduleSchema.set("autoIndex", true);

const teacherUpcomingSchedule = model("teacherUpcomingSchedule", teacherUpcomingScheduleSchema);

export default teacherUpcomingSchedule;
