import mongoose from "mongoose";
const { Schema, model } = mongoose;

const studentDashboardSchema = new Schema({
  totalCourse: {
    type: String,
    required: [false, "please fill total courses"],
  },
  activeCourse: {
    type: String,
    required: [false, "please fill total number of active courses"],
  },
  completeCourse: {
    type: String,
    required: [false, "please fill total number of completed course"],
  },
});

studentDashboardSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

studentDashboardSchema.set("autoIndex", true);

const studentDashboard = model("studentDashboard", studentDashboardSchema);

export default studentDashboard;
