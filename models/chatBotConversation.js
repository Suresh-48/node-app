import mongoose from "mongoose";
const { Schema, model } = mongoose;

const chatBotConversationSchema = new Schema({
  userQuestion: {
    type: String,
  },
});

chatBotConversationSchema.method("toJSON", function () {
  const { __V, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

chatBotConversationSchema.set("autoIndex", true);

const chatBotConversation = model("chatBotConversation", chatBotConversationSchema);

export default chatBotConversation;
