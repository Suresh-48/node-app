import mongoose from "mongoose";
const { Schema, model } = mongoose;

const chatSchema = new Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  text: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  sent: {
    type: Boolean,
  },
  received: {
    type: Boolean,
  },
  createdAt: {
    type: String,
  },
  user: {
    type: Object,
  },
});

chatSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

chatSchema.set("autoIndex", true);

const chat = model("Chat", chatSchema);
chat.createIndexes();

export default chat;
