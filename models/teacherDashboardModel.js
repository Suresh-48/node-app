import mongoose from "mongoose";
const { Schema, model } = mongoose;

const teacherDashboardSchema = new Schema({
  totalCourse: {
    type: String,
    required: [false, "please fill total courses"],
  },
  pendingPayment: {
    type: String,
    required: [false, "please fill pending payment"],
  },
  receivedPayment: {
    type: String,
    required: [false, "please fill received payment"],
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "teacher",
  },
});

teacherDashboardSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

teacherDashboardSchema.set("autoIndex", true);

const teacherDashboard = model("teacherDashboard", teacherDashboardSchema);

export default teacherDashboard;
