import Chat from "../models/chatModel.js";
import Billing from "../models/billingModel.js";
import User from "../models/userModel.js";
import courseSchedule from "../models/courseScheduleModel.js";
import { updateOne, getAll, getOne, deleteOne } from "./baseController.js";

export async function createChat(req, res, next) {
  try {
    const data = req.body;

    const createChat = await Chat.create({
      senderId: data.senderId,
      receiverId: data.receiverId,
      createdAt: data.createdAt,
      text: data.text,
      user: data.user,
      sent: true,
    });

    res.status(201).json({
      status: "success",
      message: "Chat created successfully",
      createChat,
    });
  } catch (error) {
    next(error);
  }
}

export async function getChat(req, res, next) {
  try {
    const data = req.query;
    const senderId = data.senderId;
    const receiverId = data.receiverId;
    const getChat = await Chat.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });
    res.status(200).json({
      status: "success",
      getChat,
    });
  } catch (error) {
    next(error);
  }
}

export async function getChatMembers(req, res, next) {
  try {
    const courseId = req.query.courseId;

    const chatList = await Billing.find({
      courseId: courseId,
    })
      .populate("studentId")
      .populate("parentId")
      .populate({ path: "courseScheduleId", populate: "teacherId" });

    res.status(200).json({
      message: "Get Members List",
      chatList,
    });
  } catch (error) {
    next(error);
  }
}

export async function getTeacherCourse(req, res, next) {
  try {
    const teacherId = req.query.teacherId;

    const data = await courseSchedule.find({ teacherId: teacherId });

    const scheduleData = [];
    data.forEach((res) => {
      scheduleData.push(res.id);
    });

    const billingSchedule = await Billing.find({ courseScheduleId: { $in: scheduleData } });

    const studentData = [];
    const userData = [];

    billingSchedule.forEach((res) => {
      if (studentData.indexOf(`${res.courseId}`) < 0) {
        studentData.push(`${res.courseId}`);
        userData.push(`${res._id}`);
      }
    });

    const chatList = await Billing.find({ _id: { $in: userData } })
      .populate({
        path: "courseScheduleId",
        populate: "teacherId",
      })
      .populate("courseId")
      .populate("studentId")
      .populate("parentId");

    res.status(200).json({
      message: "Get Teacher Course List",
      chatList,
    });
  } catch (error) {
    next(error);
  }
}

export async function getTeacherChatMembers(req, res, next) {
  try {
    const teacherId = req.query.teacherId;
    const courseId = req.query.courseId;

    const courseData = await courseSchedule.find({
      teacherId: teacherId,
      courseId: courseId,
    });

    const scheduleData = [];
    courseData.forEach((res) => {
      scheduleData.push(res.id);
    });

    const billingSchedule = await Billing.find({ courseScheduleId: { $in: scheduleData } });

    const studentData = [];
    const userData = [];

    billingSchedule.forEach((res) => {
      if (studentData.indexOf(`${res.studentId}`) < 0) {
        studentData.push(`${res.studentId}`);
        userData.push(`${res._id}`);
      }
    });

    const chatList = await Billing.find({ _id: { $in: userData } })
      .populate({
        path: "courseScheduleId",
        populate: "teacherId",
      })
      .populate("courseId")
      .populate("studentId")
      .populate("parentId");

    res.status(200).json({
      message: "Get Teacher Chat Members List",
      chatList,
    });
  } catch (error) {
    next(error);
  }
}
export async function getStudentChat(req, res, next) {
  try {
    const studentId = req.query.studentId;

    const data = await Billing.find({ studentId: studentId });

    //get all billing student
    const studentData = [];
    const scheduleData = [];
    data.forEach((res) => {
      studentData.push(`${res.studentId}`);
      scheduleData.push(`${res.courseScheduleId}`);
    });

    const chatList = await Billing.find({
      courseScheduleId: { $in: scheduleData },
      studentId: { $in: studentData },
    }).populate("courseScheduleId");

    const teacherData = [];
    const userData = [];

    chatList.forEach((res) => {
      if (teacherData.indexOf(`${res.courseScheduleId.teacherId}`) < 0) {
        teacherData.push(`${res.courseScheduleId.teacherId}`);
        userData.push(`${res._id}`);
      }
    });

    const chatData = await Billing.find({ _id: { $in: userData } })
      .populate({
        path: "courseScheduleId",
        populate: "teacherId",
      })
      .populate("studentId")
      .populate("parentId");

    res.status(200).json({
      message: "Get Student Chat Members List",
      chatData,
    });
  } catch (error) {
    next(error);
  }
}

export async function getStudentCourse(req, res, next) {
  try {
    const studentId = req.query.studentId;

    const data = await Billing.find({ studentId: studentId });

    const studentData = [];
    const userData = [];

    data.forEach((res) => {
      if (studentData.indexOf(`${res.courseScheduleId}`) < 0) {
        studentData.push(`${res.courseScheduleId}`);
        userData.push(`${res._id}`);
      }
    });

    const chatList = await Billing.find({ _id: { $in: userData } })
      .populate({
        path: "courseScheduleId",
        populate: "teacherId",
      })
      .populate("courseScheduleId")
      .populate("courseId")
      .populate("studentId")
      .populate("parentId");

    res.status(200).json({
      message: "Get Teacher Course List",
      chatList,
    });
  } catch (error) {
    next(error);
  }
}

export async function getParentChat(req, res, next) {
  try {
    const parentId = req.query.parentId;

    const data = await Billing.find({ parentId: parentId });

    //get all billing student
    const parentData = [];
    const scheduleData = [];
    data.forEach((res) => {
      parentData.push(`${res.parentId}`);
      scheduleData.push(`${res.courseScheduleId}`);
    });

    const chatList = await Billing.find({
      courseScheduleId: { $in: scheduleData },
      parentId: { $in: parentData },
    }).populate("courseScheduleId");

    const teacherData = [];
    const userData = [];

    chatList.forEach((res) => {
      if (teacherData.indexOf(`${res.courseScheduleId.teacherId}`) < 0) {
        teacherData.push(`${res.courseScheduleId.teacherId}`);
        userData.push(`${res._id}`);
      }
    });

    const chatData = await Billing.find({ _id: { $in: userData } })
      .populate({
        path: "courseScheduleId",
        populate: "teacherId",
      })
      .populate("studentId")
      .populate("parentId");

    res.status(200).json({
      message: "Get Student Chat Members List",
      chatData,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllChatForAdmin(req, res, next) {
  try {
    const chatData = await User.find().populate("studentId").populate("parentId").populate("teacherId");
    res.status(200).json({
      message: "Get All Chat Members List For Admin",
      chatData,
    });
  } catch (error) {
    next(error);
  }
}

export const getAllChat = getAll(Chat);
export const updateChat = updateOne(Chat);
export const deleteChat = deleteOne(Chat);
