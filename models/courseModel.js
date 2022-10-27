import mongoose from "mongoose";
const { Schema, model } = mongoose;

const courseSchema = new Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  name: {
    type: String,
    required: [false, "Please Enter Course Category"],
    index: true,
  },
  aliasName: {
    type: String,
    required: [false, "Please Enter Alice Name"],
  },
  description: {
    type: String,
    required: [false, "Please Enter Course Description"],
  },
  schedule: {
    type: Date,
    required: [false, "Please Enter Course Schedule"],
  },
  actualAmount: {
    type: Number,
    required: [false, "Please Enter Course Payment Amount "],
  },
  discountAmount: {
    type: Number,
    required: [false, "Please Enter Course Payment Offer Percentage "],
  },
  submitType: {
    enum: ["Publish", "Draft", "Archive"],
    type: String,
  },

  isFuture: {
    type: Boolean,
  },
  imageUrl: {
    type: String,
  },
  duration: {
    type: String,
    required: [false, "Please fill duration"],
  },
  favourite:{
    type:Boolean,
    default:false
  }
  // totalEnrolledStudent:{
  //   type:Number,
  //   default:0,
  // }
});

courseSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

courseSchema.set("autoIndex", true);
courseSchema.index({ name: "text" });
const course = model("Course", courseSchema);
course.createIndexes();

export default course;
