import Teacher from "../models/teacherModel.js";
import { getAll, getOne, deleteOne, updateOne } from "./baseController.js";
import getRandomNumberForMail from "../utils/sendEmail.js";
import { getPublicImagUrl, uploadBase64File } from "../utils/s3.js";
import User from "../models/userModel.js";
import { USER_ROLE_TEACHER } from "../constants/userRole.js";
import courseSchedule from "../models/courseScheduleModel.js";
import teacherUpcomingSchedule from "../models/teacherUpcomingScheduleModels.js";
import Billing from "../models/billingModel.js";

import moment from "moment-timezone";

export async function teacherSignUp(req, res, next) {
  try {
    const data = req.body;
    const exist = await Teacher.find({ email: data.email });
    if (exist.length == 0) {
      const teacherData = await Teacher.create({
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address1: data.address1,
        address2: data.address2,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        hearAboutUs: data.hearAboutUs,
        speciality: data.speciality,
        specialityDescription: data.specialityDescription,
        imageUrl: data.imageUrl,
        userName: data.userName,
        skills: data.skills,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      const tokenId = getRandomNumberForMail();

      const teacherLogin = await User.create({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        role: USER_ROLE_TEACHER,
        token: tokenId,
        isEmailVerified: "true",
        teacherId: teacherData._id,
      });
      res.status(201).json({
        status: "Created",
        message: "teacher Registration Created Successfuly",
        teacherData,
        teacherLogin,
      });
    } else {
      res.status(208).json({
        status: "Already Exist",
        message: "teacher Already Exist",
        data: {
          exist,
        },
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function updateTeacher(req, res, next) {
  try {
    const id = req.params.id;

    const data = req.body;

    const exist = await Teacher.find({
      _id: { $nin: [id] },
      email: data.email,
    });

    if (exist.length == 0) {
      const editDetail = await Teacher.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });

      const userTeacherData = await User.findOne({ teacherId: id });

      const editedUser = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      };

      const editUser = await User.findByIdAndUpdate(
        userTeacherData._id,
        editedUser
      );
      res.status(201).json({
        status: "Created",
        message: "Teacher Details Updated Successfuly",
        editDetail,
        editUser,
      });
    } else {
      res.status(208).json({
        status: "Already Exist",
        message: "teacher Already Exist",
        data: {
          exist,
        },
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function updateTeacherStatus(req, res, next) {
  try {
    const teacherId = req.body.teacherId;
    const status = req.body.status;

    const teacherSchedule = await teacherUpcomingSchedule.find({
      teacherId: teacherId,
    });
    if (teacherSchedule.length === 0) {
      const updateStatus = await Teacher.findByIdAndUpdate(teacherId, {
        status: status,
      });
      res.status(201).json({
        status: "success",
        message: "Teacher Status Updated ",
        updateStatus,
      });
    } else {
      res.status(208).json({
        status: "failed",
        message: "Unable To Change, Teacher Already Scheduled For Course",
      });
    }
  } catch (error) {
    next(error);
  }
}

//get approved teachers list
export async function getApprovedTeacher(req, res, next) {
  try {
    const teacherList = await Teacher.find({ status: "Approved" });
    res.status(201).json({
      message: "Teacher Status Updated ",
      teacherList,
    });
  } catch (error) {
    next(error);
  }
}

// teacher image upload
export async function teacherImage(req, res, next) {
  try {
    const teacherId = req.body.teacherId;
    const file = req.body.image;
    const teacher_PATH = "media/teacher";
    const type = file && file.split(";")[0].split("/")[1];
    const random = new Date().getTime();
    const fileName = `${teacherId}-${random}.${type}`;
    const filePath = `${teacher_PATH}/${fileName}`;
    const teacherDetails = await Teacher.findById(teacherId);
    if (!teacherDetails) {
      return next(new Error("teacher not found"));
    }

    uploadBase64File(file, filePath, async (err, mediaPath) => {
      if (err) {
        return callback(err);
      }
      Teacher.updateOne(
        { _id: teacherId },
        { imageUrl: getPublicImagUrl(mediaPath) }
      )
        .then((obj) => {
          res.status(201).json({
            status: "Created",
            message: "Teacher Image Updated Successfully",
            teacherDetails,
          });
        })
        .catch((err) => {
          console.log("Error: " + err);
        });
    });
  } catch (error) {
    next(error);
  }
}
//delete teacher image
export async function DeleteTeacherImage(req, res, next) {
  try {
    const teacherId = req.query.teacherId;
    const updateStatus = await Teacher.findByIdAndUpdate(teacherId, {
      imageUrl: "",
    });
    res.status(204).json({
      message: "Teacher Profile Image Removed",
    });
  } catch (error) {
    next(error);
  }
}

//get teacher user name

export async function getUserName(req, res, next) {
  try {
    const userName = req.query.userName;

    const data = await Teacher.findOne({ userName: userName });

    if (!data) {
      res.status(201).json({
        message: "Created",
        data,
      });
    } else {
      res.status(208).json({
        message: "Already Exist",
        data,
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function getTeacherPendingList(req, res, next) {
  try {
    const PendingList = await Teacher.find({
      status: { $in: ["Pending", "Rejected"] },
    });

    res.status(200).json({
      length: PendingList.length,
      message: "List Of Pending and Rejected Teacher",
      PendingList,
    });
  } catch (error) {
    next(error);
  }
}

export async function getTeacherCourseList(req, res, next) {
  try {
    const teacherId = req.query.teacherId;
    const teacherCourses = await courseSchedule
      .find({ teacherId: teacherId })
      .populate("teacherId")
      .populate({ path: "courseId", populate: { path: "category" } });

    res.status(200).json({
      status: "success",
      length: teacherCourses.length,
      teacherCourses,
    });
  } catch (error) {
    next(error);
  }
}

export const UpdateTeacherImage = updateOne(Teacher);
export const getAllTeacher = getAll(Teacher);
export const getTeacher = getOne(Teacher);
export const deleteTeacher = deleteOne(Teacher);

export async function studentsListFromCourse(req, res, next) {
  try {
    const scheduleId = req.query.scheduleId;

    const studentList = await Billing.find({ courseScheduleId: scheduleId })
      .populate("courseId")
      .populate("courseScheduleId")
      .populate("studentId");

    res.status(200).json({
      length: studentList.length,
      message: "List Of Students in Course",
      studentList,
    });
  } catch (error) {
    next(error);
  }
}
