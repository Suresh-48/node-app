import mongoose from "mongoose";
const { Schema, model } = mongoose;

const courseScheduleSchema = new Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  startTime: {
    type: String,
  },
  endTime: {
    type: String,
  },
  weeklyOn: {
    type: String,
    required: [false, "Please Enter weekly on "],
  },
  timeZone: {
    type: String,
    required: [false, "Please Enter time zone "],
  },
  startDate: {
    type: String,
    required: [false, "Please Enter start date"],
  },
  totalStudentEnrolled: {
    type: Number,
    required: [false, "Please Enter enrolled students count"],
  },
  zoomId: {
    type: String,
    required: [false, "Please Enter zoom id"],
  },
  zoomPassword: {
    type: String,
    required: [false, "Please Enter zoom password"],
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },
  timeStamp: {
    type: Date,
  },
});

courseScheduleSchema.method("toJSON", function () {
  const { _v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

courseScheduleSchema.set("autoIndex", true);

const courseSchedule = model("courseSchedule", courseScheduleSchema);
courseSchedule.createIndexes();

export default courseSchedule;
