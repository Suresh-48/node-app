import mongoose from "mongoose";
const { Schema, model } = mongoose;

const forumSchema = new Schema({
  question: {
    type: JSON,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  createdAt: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Close", "Declined"],
    default: "Pending",
  },
  replyCount: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default:"true"
  },
});

forumSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

forumSchema.set("autoIndex", true);

const forum = model("Forum", forumSchema);
forum.createIndexes();

export default forum;
