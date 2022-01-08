import mongoose from "mongoose";
const { Schema, model } = mongoose;

const adminDashboardSchema = new Schema({
  totalStudent: {
    type: String,
    required: [false, "please fill total number of students"],
  },
  totalParent: {
    type: String,
    required: [false, "please fill total number of patents"],
  },
  totalCourse: {
    type: String,
    required: [false, "please fill total number of courses"],
  },
  totalAmount: {
    type: String,
    required: [false, "please fill total amount"],
  },
});

adminDashboardSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

adminDashboardSchema.set("autoIndex", true);

const admindashboard = model("admindashboard", adminDashboardSchema);

export default admindashboard;
