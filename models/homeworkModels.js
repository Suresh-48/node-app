import mongoose from "mongoose";
const { Schema, model } = mongoose;

const homeworkSchema = new Schema({
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
    type: String,
  },
});

homeworkSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

homeworkSchema.set("autoIndex", true);

const homework = model("homework", homeworkSchema);

export default homework;
