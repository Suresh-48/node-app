import teacherPayment from "../models/teacherPaymentModel.js";
import { getAll, getOne, deleteOne } from "./baseController.js";

export async function teacherAllPayments(req, res, next) {
  try {
    const teacherId = req.params.id;

    const teacherPaymentList = await teacherPayment.find({ teacherId: teacherId }).populate("teacherId");

    res.status(200).json({
      length: teacherPaymentList.length,
      message: "Teacher All Payments List",
      teacherPaymentList,
    });
  } catch (error) {
    next(error);
  }
}
export async function UpdateTeacherPayment(req, res, next) {
  try {
    const data = req.body;

    const teacherPaymentId = await teacherPayment.findOne({ _id: data.updatePaymentId });

    const editData = {
      payment: data.payment,
      paymentDate: data.paymentDate,
    };

    const updatePayment = await teacherPayment.findByIdAndUpdate(teacherPaymentId._id, editData, {
      new: true,
      runValidators: true,
    });

    res.status(201).json({
      message: "Teacher Payment Updated Succesfully",
      updatePayment,
    });
  } catch (error) {
    next(error);
  }
}

export const getTeacherAllPayments = getAll(teacherPayment);
