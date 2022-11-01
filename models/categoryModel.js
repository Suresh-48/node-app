import mongoose from "mongoose";
const { Schema, model } = mongoose;

const categorySchema = new Schema({
  name: {
    type: String,
    required: [false, "Please Enter Course Category 1"],
    index: true,
  },
  imageUrl: {
    type: String,
  },
  createdAt: {
    type: String,
  },
  updatedAt: {
    type: String,
  },
  deletedAt: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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
