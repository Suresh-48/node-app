import mongoose from "mongoose";
const { Schema, model } = mongoose;

const billingSchema = new Schema({
  firstName: {
    type: String,
    required: [false, "Please fill your first name"],
  },
  lastName: {
    type: String,
    required: [false, "Please fill your last name"],
  },
  address1: {
    type: String,
    required: [false, "Please fill your address1"],
  },
  address2: {
    type: String,
    required: [false, "Please fill your address2"],
  },
  city: {
    type: String,
    required: [false, "Please fill your city"],
  },
  state: {
    type: String,
    required: [false, "Please fill your state"],
  },
  zipCode: {
    type: String,
    required: [false, "Please fill your zip code"],
  },
  email: {
    type: String,
    required: [false, "please fill your email"],
  },
  phone: {
    type: String,
    required: [false, "please fill your phone number"],
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Parent",
  },
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
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "courseLesson",
  },
  courseName: {
    type: String,
    required: [false, "Please Fille your course name"],
  },

  time: {
    type: String,
    required: [false, "Please fill your time"],
  },
  payment: {
    type: Number,
  },
  createdAt: {
    type: String,
  },
  isCourseChecout: {
    type: Boolean,
  },
});

billingSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

billingSchema.set("autoIndex", true);

const billing = model("Billing", billingSchema);

export default billing;
