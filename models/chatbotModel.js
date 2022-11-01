import mongoose from "mongoose";
const { Schema, model } = mongoose;

const chatbotSchema = new Schema({
  question: {
    type: String,
  },
  answer: {
    type: String,
  },
});

chatbotSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

chatbotSchema.set("autoIndex", true);

const chatBot = model("Chatbot", chatbotSchema);

export default chatBot;
