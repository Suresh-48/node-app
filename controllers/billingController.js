import Billing from "../models/billingModel.js";
import Parent from "../models/parentModel.js";
import Student from "../models/studentModel.js";
import UpcomingSchedule from "../models/upcomingScheduleModel.js";
import CourseLesson from "../models/courseLessonModel.js";
import { getAll, getOne, deleteOne } from "./baseController.js";
import Course from "../models/courseModel.js";
import Stripe from "stripe";
import moment from "moment-timezone";

const stripe = new Stripe(
  "sk_test_51JvGtNSBOsSQBGYsL8WRyTUHIb5Rb08CsTWHtSeDpeV7ZacWNcPd1nGzETJz8PhocYF52LgXiLejZW4lQaMxWOY800CLwNa2Kl"
);

export async function payBillingAsParent(req, res, next) {
  try {
    const data = req.body;
    const exist = await Billing.find({
      parentId: data.parentId,
      studentId: data.studentId,
      courseId: data.courseId,
      courseScheduleId: data.courseScheduleId,
    });
    const date=Date.now()
const createdAt=moment(date).tz("America/Chicago").format("lll")
    /////
    if (exist.length === 0) {
    ///////
      const billing = await Billing.create({
        firstName: data.firstName,
        lastName: data.lastName,
        address1: data.address1,
        address2: data.address2,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        email: data.email,
        phone: data.phone,
        parentId: data.parentId,
        studentId: data.studentId,
        courseId: data.courseId,
        courseScheduleId: data.courseScheduleId,
        courseName: data.courseName,
        time: data.time,
        payment: data.payment,
        createdAt:createdAt
      });
      const courseId = data.courseId;
      const lessonValue = await CourseLesson.findOne({ courseId: courseId });

      const addressDetails = {
        address1: data.address1,
        address2: data.address2,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        phone: data.phone,
      };
      const parentDetail = await Parent.findOne({ _id: data.parentId });
      {
        !parentDetail.address1 &&
          !parentDetail.city &&
          !parentDetail.state &&
          (await Parent.findByIdAndUpdate(data.parentId, addressDetails, {
            new: true,
            runValidators: true,
          }));
      }

      const totalCourseEnrolled = await Billing.find({ studentId: data.studentId });
      const parentAddress = await Parent.findOne({ _id: data.parentId });

      const editedData = {
        totalCourseEnrolled: totalCourseEnrolled.length,
        address1: parentAddress.address1,
        address2: parentAddress.address2,
        city: parentAddress.city,
        state: parentAddress.state,
        zipCode: parentAddress.zipCode,
        phone: parentAddress.phone,
      };
      const studentDetail = await Student.findOne({ _id: data.studentId });
      {
        !studentDetail.address1 && !studentDetail.city && !studentDetail.state
          ? await Student.findByIdAndUpdate(data.studentId, editedData, {
              new: true,
              runValidators: true,
            })
          : await Student.findByIdAndUpdate(
              data.studentId,
              { totalCourseEnrolled: totalCourseEnrolled.length },
              {
                new: true,
                runValidators: true,
              }
            );
      }
      res.status(201).json({
        message: "Billing created Successfully",
        billing,
      });
      ////
    } else {
      res.status(208).json({
        message: "Student Has Already Enrolled This Course",
        exist,
      });
    }
    ////
  } catch (error) {
    next(error);
  }
}

export async function payBillingAsStudent(req, res, next) {
  try {
    const data = req.body;
    const exist = await Billing.find({
      studentId: data.studentId,
      courseId: data.courseId,
      courseScheduleId: data.courseScheduleId,
    });
    const date=Date.now()
    const createdAt=moment(date).tz("America/Chicago").format("lll")
    
    if (exist.length === 0) {
      const billing = await Billing.create({
        firstName: data.firstName,
        lastName: data.lastName,
        address1: data.address1,
        address2: data.address2,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        email: data.email,
        phone: data.phone,
        studentId: data.studentId,
        courseId: data.courseId,
        courseScheduleId: data.courseScheduleId,
        courseName: data.courseName,
        time: data.time,
        payment: data.payment,
        createdAt:createdAt
      });
      let courseId = data.courseId;
      let lessonValue = await CourseLesson.findOne({ courseId: courseId });

      const totalCourseEnrolled = await Billing.find({ studentId: data.studentId });
      const editedData = {
        totalCourseEnrolled: totalCourseEnrolled.length,
        address1: data.address1,
        address2: data.address2,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        phone: data.phone,
      };
      const studentDetail = await Student.findOne({ _id: data.studentId });
      {
        !studentDetail.address1 && !studentDetail.city && !studentDetail.state
          ? await Student.findByIdAndUpdate(data.studentId, editedData, {
              new: true,
              runValidators: true,
            })
          : await Student.findByIdAndUpdate(
              data.studentId,
              { totalCourseEnrolled: totalCourseEnrolled.length },
              {
                new: true,
                runValidators: true,
              }
            );
      }
      res.status(201).json({
        message: "Billing created Successfully",
        billing,
      });
    } else {
      res.status(208).json({
        message: "Student Has Already Enrolled This Course",
        exist,
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function updateBilling(req, res, next) {
  try {
    const id = req.params.id;
    const data = req.body;

    const editedData = {
      firstName: data.firstName,
      lastName: data.lastName,
      address1: data.address1,
      address2: data.address2,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      email: data.email,
      phone: data.phone,
      parentId: data.parentId,
      studentId: data.studentId,
      courseId: data.courseId,
      courseScheduleId: data.courseScheduleId,
      courseName: data.courseName,
      time: data.time,
    };

    const editDetail = await Billing.findByIdAndUpdate(id, editedData, {
      new: true,
      runValidators: true,
    });

    res.status(201).json({
      message: "Billing Information Updated Successfully",
      editDetail,
    });
  } catch (error) {
    next(error);
  }
}

export const getAllBilling = getAll(Billing);
export const getBilling = getOne(Billing);
export const deleteBilling = deleteOne(Billing);

export async function createStripePayment(req, res, next) {
  try {
    const { currency, price, studentId, courseId, courseScheduleId } = req.body;
    const exist = await Billing.find({
      studentId: studentId,
      courseId: courseId,
      courseScheduleId: courseScheduleId,
    });
    if (exist.length === 0) {
      const charge = await stripe.paymentIntents.create({
        amount: price,
        currency,
        payment_method_types: ["card"],
        metadata: {
          name: "Kharphi",
        },
      });
      const clientSecret = charge.client_secret;
      res.status(201).json({
        message: "Payment Succccess",
        charge,
        clientSecret,
      });
    } else {
      res.status(403).json({
        message: "Student Already Enrolled This Course Timing",
        exist,
      });
    }
  } catch (error) {
    next(error);
  }
}

