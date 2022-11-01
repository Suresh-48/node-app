import mongoose from "mongoose";
const { Schema, model } = mongoose;

const parentSchema = new Schema({
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
  fbReference: {
    type: String,
    required: [false, "Please fill your facebook id"],
  },
  googleReference: {
    type: String,
    required: [false, "Please fill your google id"],
  },

  hearAboutUs: {
    type: String,
    required: [false, "Please fill your hear about us"],
  },

  isEmailVerified: {
    type: String,
    required: [false, "Email Verified"],
  },
  totalStudentEnroll: {
    type: Number,
    default: 0,
  },
  imageUrl: {
    type: String,
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

parentSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

parentSchema.set("autoIndex", true);

const parent = model("Parent", parentSchema);

export default parent;
