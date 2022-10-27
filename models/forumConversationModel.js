import mongoose from "mongoose";
const { Schema, model } = mongoose;

const forumConversationSchema = new Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Forum",
  },
  answer: {
    type: JSON,
  },
  createdAt: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
});

forumConversationSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

forumConversationSchema.set("autoIndex", true);

const forumConversation = model("ForumConversation", forumConversationSchema);
forumConversation.createIndexes();

export default forumConversation;
