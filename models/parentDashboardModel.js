import mongoose from "mongoose";
const { Schema, model } = mongoose;

const parentDashboardSchema = new Schema({
  totalStudent: {
    type: String,
    required: [false, "please fill total number of students"],
  },
  activeCourse: {
    type: String,
    required: [false, "please fill total number of active courses"],
  },
  completeCourse: {
    type: String,
    required: [false, "please fill total number of completed courses"],
  },
  totalCourse: {
    type: String,
    required: [false, "please fill total courses"],
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"parent"
  },
});

parentDashboardSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

parentDashboardSchema.set("autoIndex", true);

const parentDashboard = model("parentDashboard", parentDashboardSchema);

export default parentDashboard;
