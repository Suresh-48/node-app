import mongoose from "mongoose";
const { Schema, model } = mongoose;

const categorySchema = new Schema({
  name: {
    type: String,
    required: [false, "Please Enter Course Category"],
    index: true,
  },
});

categorySchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

categorySchema.set("autoIndex", true);
categorySchema.index({ name: "text" });

const category = model("Category", categorySchema);
category.createIndexes();

export default category;
