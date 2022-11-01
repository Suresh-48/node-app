import mongoose from "mongoose";
const { Schema, model } = mongoose;

const favouriteCourseSchema = new Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }
});

favouriteCourseSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

favouriteCourseSchema.set("autoIndex", true);

const favouriteCourse = model("favouriteCourse", favouriteCourseSchema);

export default favouriteCourse;
