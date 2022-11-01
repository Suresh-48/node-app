import mongoose from "mongoose";
const { Schema, model } = mongoose;

const teacherSchema = new Schema({
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
  phone: {
    type: String,
    trim: true,
    required: [false, "Please fill your phone number"],
  },
  email: {
    type: String,
    required: [false, "Please fill your primary email"],
  },
  alternateEmail: {
    type: String,
    required: [false, "Please fill your alternative email"],
  },
  password: {
    type: String,
    required: [false, "Please fill your password"],
  },
  confirmPassword: {
    type: String,
    required: [false, "Please fill your confirm password"],
  },
  speciality: {
    type: String,
    required: [false, "Please fill speciality"],
  },
  specialityDescription: {
    type: String,
    required: [false, "Please fill speciality"],
  },
  hearAboutUs: {
    type: String,
    required: [false, "Please fill your hear about us"],
  },
  aboutUs: {
    type: String,
    required: [false, "Please fill your hear about us"],
  },
  imageUrl: {
    type: String,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  userName: {
    type: String,
    required: [false, "Please fill your user name"],
  },
  status: {
    enum: ["Approved", "Pending", "Rejected"],
    type: String,
    default: "Pending",
  },
  skills: {
    type: String,
    required: [false, "Please choose your skills"],
  },

  loginType: {
    type: String,
  },
  googleId: {
    type: String,
  },
  faceBookId: {
    type: String,
  },
  teacherSessionAmount: {
    type: String,
  },
  accountName: {
    type: String,
  },
  routingName: {
    type: String,
  },
  bankName: {
    type: String,
  },
  customerId: {
    type: String,
  },
});

teacherSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

teacherSchema.set("autoIndex", true);

const teacher = model("Teacher", teacherSchema);

export default teacher;
