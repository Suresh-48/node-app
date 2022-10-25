import mongoose from "mongoose";
const { Schema, model } = mongoose;

const teacherBankDetailsSchema = new Schema({
  accountName: {
    type: String,
  },
  routingNumber: {
    type: String,
  },
  bankName: {
    type: String,
  },
  accountNumber: {
    type: String,
  },
  confirmAccountNumber: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },
});

teacherBankDetailsSchema.method("toJSON", function () {
  const { _v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

teacherBankDetailsSchema.set("autoIndex", true);

const teacherBankDetails = model("TeacherBankDetails", teacherBankDetailsSchema);

export default teacherBankDetails;
