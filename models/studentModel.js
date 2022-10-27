import mongoose from "mongoose";
const { Schema, model } = mongoose;

const studentSchema = new Schema({
  firstName: {
    type: String,
    required: [false, "Please fill your first name"],
  },
  middleName: {
    type: String,
    required: [false, "Please fill your middle name"],
  },
  lastName: {
    type: String,
    required: [false, "Please fill your last name"],
  },
  age: {
    type: String,
    required: [false, "Please fill your age"],
  },
  gender: {
    type: String,
    required: [false, "Please fill your gender"],
  },
  email: {
    type: String,
    required: [false, "Please fill your  email"],
  },
  phone: {
    type: String,
    trim: true,
    required: [false, "Please fill your phone number"],
  },
  password: {
    type: String,
    required: [false, "Please fill your password"],
  },
  confirmPassword: {
    type: String,
    required: [false, "Please fill your confirm password"],
  },
  isEmailVerified: {
    type: String,
    required: [false, "Email Verified"],
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Parent",
  },
  totalCourseEnrolled: {
    type: Number,
    default: 0,
  },
  address1: {
    type: String,
    required: [false, "Please fill your address1"],
  },
  address2: {
    type: String,
    required: [false, "Please fill your address2"],
  },
  city: {
    type: String,
    required: [false, "Please fill your city"],
  },
  activeStatus:{
    type:Boolean,
    default:true
  },
  state: {
    type: String,
    required: [false, "Please fill your state"],
  },
  country: {
    type: String,
    default: "USA",
    required: [false, "Please fill your country"],
  },
  zipCode: {
    type: String,
    required: [false, "Please fill your zip code"],
  },
  imageUrl: {
    type: String,
  },
  dob: {
    type: Date,
    required: [false, "Please Enter Date of Birth"],
  },
  googleId: {
    type: String,
  },
  faceBookId: {
    type: String,
  },
  loginType: {
    type: String,
  },
});

studentSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

studentSchema.set("autoIndex", true);

const student = model("Student", studentSchema);

export default student;
