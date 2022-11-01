import Billing from "../models/billingModel.js";
import Parent from "../models/parentModel.js";
import Student from "../models/studentModel.js";
import UpcomingSchedule from "../models/upcomingScheduleModel.js";
import CourseLesson from "../models/courseLessonModel.js";
import { getAll, getOne, deleteOne } from "./baseController.js";
import Course from "../models/courseModel.js";
import Stripe from "stripe";
import moment from "moment-timezone";

import sendMail from "../utils/sendMail.js";

const { FROM_EMAIL, FROM_EMAIL_DISPLAY_NAME } = process.env;

const stripe = new Stripe(
  "sk_test_51KixAqSFzQyT0dTSb9eyoyCltxmj0J2gIQHEPRv20VIZtqUGv5PGlROwXsIRzGxSTvgEGWMIaD2mdvxCR0ykUpTX00ByvFb1Vw"
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
    const date = Date.now();
    const createdAt = moment(date).tz("America/Chicago").format("lll");

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
        parentId: data.parentId,
        studentId: data.studentId,
        courseId: data.courseId,
        courseScheduleId: data.courseScheduleId,
        courseName: data.courseName,
        time: data.time,
        payment: data.payment,
        createdAt: createdAt,
      });
      const courseId = data.courseId;

      const totalCourseEnrolled = await Billing.find({ studentId: data.studentId });

      await Student.findByIdAndUpdate(
        data.studentId,
        { totalCourseEnrolled: totalCourseEnrolled.length },
        {
          new: true,
          runValidators: true,
        }
      );
      const courseData = await Course.findOne({ _id: data.courseId });

      // }
      // Email Notifications start
      const parentCourseCheckoutSubstitutions = {
        appUrl: `http:localhost:3000/login`,
        websiteBaseUrl: "http:localhost:3000",
        facebookUrl: "http:localhost:3000",
        twitterUrl: "http:localhost:3000",
        instagramUrl: "http:localhost:3000",
        linkedInUrl: "http:localhost:3000",
        dribbleUrl: "http:localhost:3000",
        emailLogoUrl: "http:localhost:3000",
        copyRightText: "http:localhost:3000",
        emailPrimaryBackgroundColor: "#009dda",
        emailPrimaryTextColor: "#FFFFFF",
        mediaBaseUrl: "http:localhost:3000",
        marketplaceName: "http:localhost:3000",
        studentName: `${data.firstName} ${data.lastName}`,
        courseName: `${courseData.courseName}`,
      };

      const parentCourseCheckoutData = {
        // to: FROM_EMAIL,
        to: data.email,
        from: FROM_EMAIL,
        subject: "Kharphi Student Course Checkout",
        template: "ParentCheckout",
        substitutions: parentCourseCheckoutSubstitutions,
      };

      // Email Notifications Ends
      res.status(201).json({
        message: "Billing created Successfully",
        billing,
      });
      res.on("finish", () => {
        // To send a Email Notifications
        sendMail(parentCourseCheckoutData, () => {});
      });
      ////
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

export async function payBillingAsStudent(req, res, next) {
  try {
    const data = req.body;
    const exist = await Billing.find({
      studentId: data.studentId,
      courseId: data.courseId,
      courseScheduleId: data.courseScheduleId,
    });
    const date = Date.now();
    const createdAt = moment(date).tz("America/Chicago").format("lll");

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
        createdAt: createdAt,
        isCourseChecout: true,
      });
      let courseId = data.courseId;
      let lessonValue = await CourseLesson.findOne({ courseId: courseId });

      const totalCourseEnrolled = await Billing.find({ studentId: data.studentId });

      await Student.findByIdAndUpdate(
        data.studentId,
        { totalCourseEnrolled: totalCourseEnrolled.length },
        {
          new: true,
          runValidators: true,
        }
      );
      // }

      const courseData = await Course.findOne({ _id: data.courseId });

      // }
      // Email Notifications start
      const studentCourseCheckoutSubstitutions = {
        appUrl: `http:localhost:3000/login`,
        websiteBaseUrl: "http:localhost:3000",
        facebookUrl: "http:localhost:3000",
        twitterUrl: "http:localhost:3000",
        instagramUrl: "http:localhost:3000",
        linkedInUrl: "http:localhost:3000",
        dribbleUrl: "http:localhost:3000",
        emailLogoUrl: "http:localhost:3000",
        copyRightText: "http:localhost:3000",
        emailPrimaryBackgroundColor: "#009dda",
        emailPrimaryTextColor: "#FFFFFF",
        mediaBaseUrl: "http:localhost:3000",
        marketplaceName: "http:localhost:3000",
        studentName: `${data.firstName} ${data.lastName}`,
        courseName: `${courseData.name}`,
      };

      const studentCourseCheckoutData = {
        // to: FROM_EMAIL,
        to: data.email,
        from: FROM_EMAIL,
        subject: "Kharphi Course Checkout",
        template: "StudentCheckout",
        substitutions: studentCourseCheckoutSubstitutions,
      };
      res.status(201).json({
        message: "Billing created Successfully",
        billing,
      });
      res.on("finish", () => {
        // To send a Email Notifications
        sendMail(studentCourseCheckoutData, () => {});
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

export async function parentCheckoutLesson(req, res, next) {
  try {
    const data = req.body;
    let lessonIds = [];
    lessonIds = data.lessonId;

    for (let i = 0; i < lessonIds.length; i++) {
      const exist = await Billing.find({
        parentId: data.parentId,
        studentId: data.studentId,
        courseId: data.courseId,
        courseScheduleId: data.courseScheduleId,
        lessonId: lessonIds[i].id,
      });
      const date = Date.now();
      const createdAt = moment(date).tz("America/Chicago").format("lll");

      if (exist.length === 0) {
        const billingLesson = await Billing.create({
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
          lessonId: lessonIds[i].id,
          courseName: data.courseName,
          time: data.time,
          payment: lessonIds[i].lessonDiscountAmount,
          createdAt: createdAt,
        });

        res.status(201).json({
          message: "Billing Created Successfully This Course Lesson",
          billingLesson,
        });
      } else {
        res.status(208).json({
          message: "Student Has Already Enrolled This Course Lesson",
        });
      }
    }
  } catch (error) {
    next(error);
  }
}
export async function studentCheckoutLesson(req, res, next) {
  try {
    const data = req.body;

    let lessonIds = [];
    lessonIds = data.lessonId;

    for (let i = 0; i < lessonIds.length; i++) {
      const exist = await Billing.find({
        studentId: data.studentId,
        courseId: data.courseId,
        courseScheduleId: data.courseScheduleId,
        lessonId: lessonIds[i].id,
      });

      const date = Date.now();
      const createdAt = moment(date).tz("America/Chicago").format("lll");

      if (exist.length === 0) {
        const billingLesson = await Billing.create({
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
          lessonId: lessonIds[i].id,
          courseName: data.courseName,
          time: data.time,
          payment: lessonIds[i].lessonDiscountAmount,
          createdAt: createdAt,
        });

        res.status(201).json({
          message: "Billing Created Successfully This Course Lesson",
          billingLesson,
        });
      } else {
        res.status(208).json({
          message: "Student Has Already Enrolled This Course Lesson",
          exist,
        });
      }
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

export async function createStripePaymentForLesson(req, res, next) {
  try {
    const { currency, price, studentId, courseId, courseScheduleId, lessonId } = req.body;

    for (let i = 0; i < lessonId.length; i++) {
      const exist = await Billing.find({
        studentId: studentId,
        courseId: courseId,
        courseScheduleId: courseScheduleId,
        lessonId: lessonId[i].id,
      });

      if (exist.length === 0) {
        const charge = await stripe.paymentIntents.create({
          amount: price,
          currency,
          payment_method_types: ["card"],
          metadata: {
            name: "kharphi",
          },
        });

        const clientSecret = charge.client_secret;
        res.status(201).json({
          message: "Payment Success",
          charge,
          clientSecret,
        });
      } else {
        res.status(403).json({
          message: "Student Already Enrolled This Course Lesson Timing",
          exist,
        });
      }
    }
  } catch (error) {
    next(error);
  }
}
