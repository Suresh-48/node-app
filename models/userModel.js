import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: [false, "Please fill your first name"],
  },
  lastName: {
    type: String,
    required: [false, "Please fill your last name"],
  },
  email: {
    type: String,
    required: [false, "Please fill your email"],
    unique: true,
  },
  password: {
    type: String,
    required: [false, "Please fill your password"],
  },
  confirmPassword: {
    type: String,
    required: [false, "Please fill your password"],
  },
  role: {
    type: String,
    required: [false, "Please fill your role"],
  },
  token: {
    type: String,
    required: [false, "Please fill your token"],
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Parent",
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "teacher",
  },
  isEmailVerified: {
    type: String,
    required: [false, "Email Verified"],
  },
});

userSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

userSchema.set("autoIndex", true);

const user = model("User", userSchema);

export default user;
