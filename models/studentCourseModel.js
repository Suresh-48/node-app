import mongoose from "mongoose";
const { Schema, model } = mongoose;

const studentCourseSchema = new Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  courseScheduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "courseSchedule",
  },
  createdAt: {
    type: String,
    required: [false, "Please Fill created at"],
  },
});

studentCourseSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

studentCourseSchema.set("autoIndex", true);

const studentCourse = model("StudentCourse", studentCourseSchema);
export default studentCourse;
