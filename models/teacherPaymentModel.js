import mongoose from "mongoose";
const { Schema, model } = mongoose;

const teacherPaymentSchema = new Schema({
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
  courseName: {
    type: String,
  },
  lessonName: {
    type: String,
  },
  teacherPayableAmount: {
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
  date: {
    type: String,
  },
  paymentDate: {
    type: String,
  },
  payment: {
    type: Boolean,
  },
  paymentDate: {
    type: String,
  },
  paymentTime: {
    type: Date,
  },
});

teacherPaymentSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

// teacherPaymentSchema.set("autoIndex", true);

const teacherPayment = model("teacherPayment", teacherPaymentSchema);

export default teacherPayment;
