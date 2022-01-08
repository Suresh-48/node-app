import Student from "../models/studentModel.js";
import User from "../models/userModel.js";
import Parent from "../models/parentModel.js";
import Billing from "../models/billingModel.js";
import upcomingSchedule from "../models/upcomingScheduleModel.js";
import courseLesson from "../models/courseLessonModel.js";
import courseSchedule from "../models/courseScheduleModel.js";
import { getAll, getOne, deleteOne } from "./baseController.js";
import getRandomNumberForMail from "../utils/sendEmail.js";
import { USER_ROLE_STUDENT } from "../constants/userRole.js";
import moment from "moment-timezone";
import quizSchedule from "../models/quizScheduleModels.js";
import quiz from "../models/quizModels.js";
import homework from "../models/homeworkModels.js";
import homeworkSchedule from "../models/homeworkScheduleModels.js";
import { getPublicImagUrl, uploadBase64File } from "../utils/s3.js";

export async function signUp(req, res, next) {
  try {
    const data = req.body;

    const exist = await Student.find({ email: data.email });

    //get Age from DOB
    let dob = new Date(data.dob);
    let month = Date.now() - dob.getTime();
    let getAge = new Date(month);
    let year = getAge.getUTCFullYear();

    let age = Math.abs(year - 1970);

    if (exist.length == 0) {
      const student = await Student.create({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        isEmailVerified: "true",
        parentId: data.parentId,
        age: age,
        gender: data.gender,
        dob: data.dob,
      });

      const studentId = student._id;

      const tokenId = getRandomNumberForMail();

      const studentLogin = await User.create({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        role: USER_ROLE_STUDENT,
        token: tokenId,
        isEmailVerified: "true",
        studentId: studentId,
        parentId: data.parentId,
      });

      const parentId = data.parentId;

      if (parentId !== null) {
        const parentDetail = await Parent.findOne({ _id: parentId });
        const addressDetails = {
          address1: parentDetail.address1,
          address2: parentDetail.address2,
          city: parentDetail.city,
          state: parentDetail.state,
          zipCode: parentDetail.zipCode,
        };
        const studentCount = await Student.find({ parentId: parentId });
        const updateStudentCount = await Parent.findByIdAndUpdate(parentId, {
          totalStudentEnroll: studentCount.length,
        });
        {
          parentDetail.address1 &&
            parentDetail.city &&
            (await Student.findByIdAndUpdate(studentId, addressDetails));
        }
      }

      res.status(201).json({
        message: "Student  Created Successfuly",
        student,
        studentLogin,
      });
    } else {
      res.status(208).json({
        message: "Student Already Exist",
        data: {
          exist,
        },
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function updateStudent(req, res, next) {
  try {
    const id = req.params.id;

    const data = req.body;

    //get Age from DOB
    let dob = new Date(data.dob);
    let month = Date.now() - dob.getTime();
    let getAge = new Date(month);
    let year = getAge.getUTCFullYear();

    let age = Math.abs(year - 1970);

    const editedStudent = {
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      age: age,
      dob: data.dob,
      gender: data.gender,
      email: data.email,
      phone: data.phone,
      address1: data.address1,
      address2: data.address2,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      password: data.password,
      confirmPassword: data.confirmPassword,
    };
    const editDetail = await Student.findByIdAndUpdate(id, editedStudent, {
      new: true,
      runValidators: true,
    });
    const userStudentData = await User.findOne({ studentId: id });

    const editedUser = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    };

    const editUser = await User.findByIdAndUpdate(
      userStudentData._id,
      editedUser,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(201).json({
      status: "Created",
      message: "Student Details Updated Successfuly",
      editDetail,
      editUser,
    });
  } catch (error) {
    next(error);
  }
}

export async function getStudentCourseDetail(req, res, next) {
  try {
    const id = req.params.id;
    const studentList = await Billing.find({ studentId: id })
      .populate({ path: "courseId", populate: { path: "category" } })
      .populate("courseScheduleId");
    res.status(200).json({
      message: "Get Student Course List",
      studentList,
    });
  } catch (error) {
    next(error);
  }
}

export async function studentUpcomingList(req, res, next) {
  try {
    const data = req.body;
    const scheduleDetail = await courseSchedule.findOne({
      _id: data.courseScheduleId,
    });
    const lessonList = await courseLesson
      .find({ courseId: data.courseId })
      .sort({ lessonNumber: 1 });
    const lessonDate = scheduleDetail.startDate;
    const lessonEndTime = moment(scheduleDetail.endTime, "LT").format("HH:mm");

    lessonList.forEach(async (res, i) => {
      const newDate = moment(lessonDate, "ll").add(7 * i, "days");

      const date = moment(newDate).format();
      const timeStamp = moment(date).utc().format();
      const edit = moment(newDate).format("ll");

      const exist = await upcomingSchedule.find({
        courseId: data.courseId,
        courseScheduleId: data.courseScheduleId,
        courseLessonId: res.id,
        studentId: data.studentId,
      });

      if (exist.length === 0) {
        const value = await upcomingSchedule.create(
          data.parentId !== "null"
            ? {
                courseId: data.courseId,
                courseScheduleId: data.courseScheduleId,
                courseLessonId: res.id,
                studentId: data.studentId,
                parentId: data.parentId,
                lessonDate: edit,
                lessonEndTime: lessonEndTime,
                timeStamp: timeStamp,
              }
            : {
                courseId: data.courseId,
                courseScheduleId: data.courseScheduleId,
                courseLessonId: res.id,
                studentId: data.studentId,
                lessonDate: edit,
                lessonEndTime: lessonEndTime,
                timeStamp: timeStamp,
              }
        );
        const quizRecord = await quiz.findOne({ courseLessonId: res._id });
        const createQuizSchedule = await quizSchedule.create(
          quizRecord
            ? {
                courseId: data.courseId,
                courseScheduleId: data.courseScheduleId,
                courseLessonId: res._id,
                studentId: data.studentId,
                scheduleLesson: value._id,
                quizId: quizRecord.id,
                teacherId: scheduleDetail.teacherId,
              }
            : {
                courseId: data.courseId,
                courseScheduleId: data.courseScheduleId,
                courseLessonId: res._id,
                studentId: data.studentId,
                scheduleLesson: value._id,
                teacherId: scheduleDetail.teacherId,
              }
        );

        const homeworkRecord = await homework.findOne({
          courseLessonId: res.id,
        });
        const createhomeworkSchedule = await homeworkSchedule.create(
          homeworkRecord
            ? {
                courseId: data.courseId,
                courseScheduleId: data.courseScheduleId,
                courseLessonId: res._id,
                studentId: data.studentId,
                scheduleLesson: value._id,
                homeworkId: homeworkRecord._id,
                teacherId: scheduleDetail.teacherId,
              }
            : {
                courseId: data.courseId,
                courseScheduleId: data.courseScheduleId,
                courseLessonId: res._id,
                studentId: data.studentId,
                scheduleLesson: value._id,
                teacherId: scheduleDetail.teacherId,
              }
        );
      }
    });

    res.status(200).json({
      message: "Quiz Schedule and Homework Schedule Created Successfully",
    });
  } catch (error) {
    next(error);
  }
}

// student image upload
export async function studentProfileImage(req, res, next) {
  try {
    const studentId = req.body.studentId;
    const file = req.body.image;
    const student_PATH = "media/student";
    const type = file && file.split(";")[0].split("/")[1];
    const random = new Date().getTime();
    const fileName = `${studentId}-${random}.${type}`;
    const filePath = `${student_PATH}/${fileName}`;
    const studentDetails = await Student.findById(studentId);
    if (!studentDetails) {
      return next(new Error("student not found"));
    }

    uploadBase64File(file, filePath, async (err, mediaPath) => {
      if (err) {
        return callback(err);
      }
      Student.findByIdAndUpdate(
        { _id: studentId },
        { imageUrl: getPublicImagUrl(mediaPath) }
      )
        .then((obj) => {
          res.status(201).json({
            status: "Created",
            message: "student Image Updated Successfully",
            studentDetails,
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

//course history
export async function listOfCourseHistory(req, res, next) {
  try {
    const studentId = req.params.id;
    const courseHistory = await Billing.find({ studentId: studentId })
      .populate("studentId")
      .populate({ path: "courseId", populate: { path: "categoryId" } })
      .populate({ path: "courseScheduleId", populate: { path: "teacherId" } });

    res.status(200).json({
      message: "Course History List",
      courseHistory,
    });
  } catch (error) {
    next(error);
  }
}
//delete teacher image
export async function DeleteStudentImage(req, res, next) {
  try {
    const studentId = req.query.studentId;
    const removeImage = await Student.findByIdAndUpdate(studentId, {
      imageUrl: "",
    });
    res.status(204).json({
      message: "Student Profile Image Removed",
    });
  } catch (error) {
    next(error);
  }
}

export const getAllStudent = getAll(Student);
export const getStudent = getOne(Student);
export const deleteStudent = deleteOne(Student);
export const getAllUser = getAll(User);
export const getUser = getOne(User);
