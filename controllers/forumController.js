import Forum from "../models/forumModel.js";
import Course from "../models/courseModel.js";
import Billing from "../models/billingModel.js";
import User from "../models/userModel.js";
import { deleteOne, getAll } from "./baseController.js";
import nodemailer from "nodemailer";
import { EMAIL, PASSWORD } from "../config.js";
import sgMail from "@sendgrid/mail";
import sendMail from "../utils/sendMail.js";
const { FROM_EMAIL, FROM_EMAIL_DISPLAY_NAME } = process.env;

sgMail.setApiKey("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");
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL,
    pass: PASSWORD,
  },
});


export async function createForum(req, res, next) {
  try {
    const data = req.body;
    const createData = await Forum.create({
      question: data.question,
      createdAt: data.createdAt,
      userId: data.user,
      courseId: data.courseId,
    });

    const userData = await User.findOne({ _id: data.user });

    // Email Notifications start
    const forumCreateStudentEmail = {
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
      studentName: `${userData.firstName} ${userData.lastName}`,
    };

    const forumStudentEmailData = {
      
      to: userData.email,
      from: FROM_EMAIL,
      subject: "Student Created forum ",
      template: "ForumCreate",
      substitutions: forumCreateStudentEmail,
    };

    res.status(201).json({
      message: "Forum Question created successfully",
      data: createData,
    });
    res.on("finish", () => {
      // To send a Email Notifications
      sendMail(forumStudentEmailData, () => {});
    });
  } catch (error) {
    next(error);
  }
}

export async function updateForum(req, res, next) {
  try {
    const data = req.body;

    const exist = await Forum.findOne({ _id: data.questionId });

    const editedData = {
      question: data.question,
      createdAt: data.createdAt,
    };
    const editDetail = await Forum.findByIdAndUpdate(data.questionId, editedData, {
      new: true,
      runValidators: true,
    });

    const getUserDetails = await User.findOne({ _id: data.user });

   

    res.status(201).json({
      message: " Updated Forum Questions Successfully",
      editDetail,
    });
    
  } catch (error) {
    next(error);
  }
}
export async function courseFilter(req, res, next) {
  try {
    const id = req.query.categoryId;

    const getCourse = await Course.find({ category: { $in: id } });

    res.status(200).json({
      message: "Get Filtered Courses",
      getCourse,
    });
  } catch (error) {
    next(error);
  }
}
export async function getForum(req, res, next) {
  try {
    const courseId = req.query.courseId;

    const forumList = await Forum.find({
      courseId: courseId,
      status: "Approved",
    })
      .populate({ path: "userId", populate: { path: "studentId" } })
      .populate({ path: "userId", populate: { path: "parentId" } })
      .populate({ path: "userId", populate: { path: "teacherId" } })
      .populate("courseId")
      .sort({ $natural: -1 });

    res.status(200).json({
      message: "Get Forum List",
      forumList,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllForum(req, res, next) {
  try {
    const forumList = await Forum.find().populate("userId").populate("courseId").sort({ $natural: -1 }).limit(3);

    res.status(200).json({
      message: "Get All Forum List",
      forumList,
    });
  } catch (error) {
    next(error);
  }
}

export async function getForumStatusList(req, res, next) {
  try {
    const pendingData = await Forum.find({ status: "Pending" }).populate("userId").populate("courseId");
    const approveData = await Forum.find({ status: "Approved" }).populate("userId").populate("courseId");
    const closeData = await Forum.find({ status: "Close" }).populate("userId").populate("courseId");
    const declineData = await Forum.find({ status: "Declined" }).populate("userId").populate("courseId");

    res.status(200).json({
      message: "Get All Forum List",
      data: {
        pendingData,
        approveData,
        closeData,
        declineData,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateForumQuestionstatus(req, res, next) {
  try {
    const data = req.body;

    const forumQuestion = await Forum.findOne({
      _id: data.questionId,
    });

    const editedData = {
      status: data.status,
    };
    const updateStatus = await Forum.findByIdAndUpdate(forumQuestion._id, editedData, {
      new: true,
      runValidators: true,
    });
const userDetails= await User.findOne({_id : forumQuestion.userId})


const forumStudentStatusEmail = {
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
  studentName: `${userDetails.firstName} ${userDetails.lastName}`,
  message: editedData.status,
  
  
};

const forumStudentStatusData = {
  // to: FROM_EMAIL,
  to: userDetails.email,
  // to: "civildinesh313@gmail.com",
 
  from: FROM_EMAIL,
  subject: "Student forum Status ",
  template: "ForumStatus",
  substitutions: forumStudentStatusEmail ,
};

    res.status(201).json({
      message: "Forum Status Updated Successfully",
      updateStatus,
    });
    res.on("finish", () => {
      // To send a Email Notifications
      sendMail(forumStudentStatusData, () => {});
    });
    
  } catch (error) {
    next(error);
  }
}

export async function sendForumCloseNotification(req, res, next) {
  try {
    // const id = req.query.questionId;

    // const exist = await Forum.findOne({ _id: id });

    // const editData = {
    //   status: "rejected",
    // };

    // const editDetail = await Forum.findByIdAndUpdate(exist._id, editData, {
    //   new: true,
    //   runValidators: true,
    // });

    // const htmlcontent = `<p>This question is closed due to invalid questions.
    //    </p><br>

    //          <p>Thanks and Regards,</p>
    //          <p>
    //          Admin,
    //          Khaprhi Online Services,<br>
    //          California,<br>
    //          United States of America,
    //          60664.</p>
    //          <p>Visit:  www.khraphi.com</p>
    //  `;
    // var mailOptions = {
    //   from: EMAIL,
    //   to: "sureshbefrank92@gmail.com",
    //   subject: "Kharphi Forum Questions ",
    //   html: htmlcontent,
    // };
    // transporter.sendMail(mailOptions, function (error, info) {
    //   if (error) {
    //     console.log(error);
    //   } else {
    //     console.log("Email sent: " + info.response);
    //   }
    // });

    const msg = {
      to: "gowthambarani005@gmail.com", // Change to your recipient
      from: "kharphi2022@gmail.com", // Change to your verified sender
      subject: "Sending with SendGrid is Fun",
      text: "and easy to do anywhere, even with Node.js",
      html: `<div style={{backgroundColor:red}}><p>hiii</p><p>efgerge</p></div>`,
    };
    sgMail.send(msg).then((res) => {
      console.log("Email sent", res);
    });

    res.status(201).json({
      message: "Forum question closed and email sent successfully ",
      // editDetail,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteForumQuestion(req, res, next) {
  try {
    const questionId = req.query.id;

    const data = await Forum.findByIdAndDelete({ _id: questionId });

    if (data) {
      const getQuestion = await Forum.find({
        question: data.question,
      });

     

      

      res.status(200).json({
        message: "Forum Question Deleted Successfuly",
      });
      res.on("finish", () => {
        // To send a Email Notifications
        sendMail(forumStudentDeleteEmailData, () => {});
      });
    } else {
      
    }
  } catch (error) {
    next(error);
  }
}

export async function enableForumchat(req, res, next) {
  try {
    const data = req.body;

    const forumQuestion = await Forum.findOne({
      _id: data.questionId,
    });

    const editedData = {
      isActive: data.isActive,
    };
    const updateChatStatus = await Forum.findByIdAndUpdate(forumQuestion._id, editedData, {
      new: true,
      runValidators: true,
    });

    res.status(201).json({
      message: "Forum Chat Status Updated Successfully",
      updateChatStatus,
    });
   
     
  } catch (error) {
    next(error);
  }
}

export async function getLatestForum(req, res, next) {
  try {
    var today = new Date();
    const forumList = await Forum.find({
      createdAt: { $lt: "today" },
      status: "Approved",
      isActive: true,
    })
      .populate("userId")
      .populate("courseId")
      .sort({ $natural: -1 });

    res.status(200).json({
      message: "Get Latest Forum List",
      forumList,
    });
  } catch (error) {
    next(error);
  }
}

export async function forumCourseCategory(req, res, next) {
  try {
    const studentId = req.query.studentId;

    const studentData = await Billing.find({ studentId: studentId });

    const courseData = [];
    const userData = [];

    studentData.forEach((res) => {
      if (courseData.indexOf(`${res.courseId}`) < 0) {
        courseData.push(`${res.courseId}`);
        userData.push(`${res._id}`);
      }
    });
    const courseList = await Billing.find({ _id: { $in: userData } }).populate({
      path: "courseId",
      populate: { path: "category" },
    });

    res.status(200).json({
      message: "Get Teacher Chat Members List",
      courseList,
    });
  } catch (error) {
    next(error);
  }
}
