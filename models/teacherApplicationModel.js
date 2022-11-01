import mongoose from "mongoose";
const { Schema, model } = mongoose;

const teacherApplicationSchema = new Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },
  education: {
    type: JSON,
  },
  experience: {
    type: JSON,
  },
  profile: {
    type: JSON,
  },
  status: {
    enum: ["Approved", "Pending", "Review", "Rejected"],
    type: String,
    default: "Pending",
  },
});

teacherApplicationSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

teacherApplicationSchema.set("autoIndex", true);
const teacherApplication = model("TeacherApplication", teacherApplicationSchema);

export default teacherApplication;
