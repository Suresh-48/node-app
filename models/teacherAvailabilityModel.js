import mongoose from "mongoose";
const { Schema, model } = mongoose;

const teacherAvailabilitySchema = new Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },
  start: {
    type: Date,
    required: [false, "Please Enter Start Date"],
  },
  end: {
    type: Date,
    required: [false, "Please Enter Start Date"],
  },
  startTime: {
    type: String,
  },
  endTime: {
    type: String,
  },
  title: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Availability", "CourseSchedule"],
  },
  courseScheduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "courseSchedule",
  },
  courseLessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "courseLesson",
  },
});

teacherAvailabilitySchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

teacherAvailabilitySchema.set("autoIndex", true);

const teacherAvailability = model(
  "TeacherAvailability",
  teacherAvailabilitySchema
);

export default teacherAvailability;
