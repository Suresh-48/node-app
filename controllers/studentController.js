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
import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client("901411976146-5r87ft9nah8tqdp3stg7uod39i1h66ft.apps.googleusercontent.com");
import lessonQuiz from "../models/lessonQuizModels.js";
import LessonHomeWork from "../models/lessonHomeWorkModel.js";
import jwt from "jsonwebtoken";
import { TOKEN_KEY } from "../config.js";

import sendMail from "../utils/sendMail.js";

const { FROM_EMAIL, FROM_EMAIL_DISPLAY_NAME } = process.env;

export async function signUp(req, res, next) {
  try {
    const data = req.body;
    if (data.isGoogleLogin) {
      client
        .verifyIdToken({
          idToken: data.tokenId,
          audience: "901411976146-5r87ft9nah8tqdp3stg7uod39i1h66ft.apps.googleusercontent.com",
        })
        .then(async (response) => {
          const { email_verified, name, email } = response.payload;
          const responseData = response.payload;
          const firstName = responseData.given_name[0].toUpperCase() + responseData.given_name.substring(1);
          const lastName = responseData.family_name[0].toUpperCase() + responseData.family_name.substring(1);
          const exist = await User.find({ email: email });

          if (email_verified) {
            if (exist.length === 0) {
              const student = await Student.create({
                email: email,
                firstName: firstName,
                lastName: lastName,
                googleId: data.googleId,
                loginType: "Google",
              });
              const studentId = student._id;
              // const tokenId = getRandomNumberForMail();

              const tokenId = jwt.sign({ email: data.email, password: data.password }, TOKEN_KEY, {
                expiresIn: "25m",
              });

              const studentLogin = await User.create({
                firstName: firstName,
                lastName: lastName,
                email: email,
                role: USER_ROLE_STUDENT,
                token: tokenId,
                isEmailVerified: "true",
                studentId: studentId,
                googleId: data.googleId,
                loginType: "Google",
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
                dataVerified: false,
              });
            } else {
              res.status(400).json({
                message: "Email Already Exist Try Another",
                data: {
                  exist,
                },
              });
            }
          } else {
            res.status(400).json({
              message: "Email Verification Failed, Try Again After SomeTime",
            });
          }
        });
    } else if (data.isFaceBookLogin) {
      const email = data.email;
      const firstName = data.firstName;
      const lastName = data.lastName;

      if (data.email && data.firstName && data.lastName && data.faceBookId) {
        const exist = await User.find({ email: email });
        if (exist.length === 0) {
          const student = await Student.create({
            email: email,
            firstName: firstName,
            lastName: lastName,
            faceBookId: data.faceBookId,
            loginType: "FaceBook",
          });
          const studentId = student._id;
          // const tokenId = getRandomNumberForMail();
          const tokenId = jwt.sign({ email: data.email, password: data.password }, TOKEN_KEY, {
            expiresIn: "25m",
          });
          const studentLogin = await User.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            role: USER_ROLE_STUDENT,
            token: tokenId,
            isEmailVerified: true,
            studentId: studentId,
            faceBookId: data.faceBookId,
            loginType: "faceBook",
          });

          const parentId = data.parentId;

          if (parentId) {
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
            message: "Student Created Successfully",
            student,
            studentLogin,
            dataVerified: false,
          });
        } else {
          res.status(400).json({
            message: "Email already Exist Try Another",
            data: {
              exist,
            },
          });
        }
      } else {
        res.status(400).json({
          message: "Email Vefification Failed, Try Again After SomeTime",
        });
      }
    } else {
      const exist = await User.find({ email: data.email });

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
          loginType: "Email",
        });

        const studentId = student._id;

        // const tokenId = getRandomNumberForMail();
        const tokenId = jwt.sign({ email: data.email, password: data.password }, TOKEN_KEY, {
          expiresIn: "25m",
        });

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
          loginType: "Email",
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
            parentDetail.address1 && parentDetail.city && (await Student.findByIdAndUpdate(studentId, addressDetails));
          }
        }
        // Email Notifications start
        const studentEmailSubstitutions = {
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
        };

        const studentEmailData = {
          // to: FROM_EMAIL,
          to: data.email,
          from: FROM_EMAIL,
          subject: "Student User Registration",
          template: "StudentRegrisation",
          substitutions: studentEmailSubstitutions,
        };
        res.status(201).json({
          message: "Student  Created Successfuly",
          student,
          studentLogin,
          dataVerified: true,
        });
        res.on("finish", () => {
          // To send a Email Notifications
          sendMail(studentEmailData, () => {});
        });
      } else {
        res.status(400).json({
          message: "Email Already Exist Try Another",
          data: {
            exist,
          },
        });
      }
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
    };
    if (data.loginType === "Email") {
      editedStudent.password = data.password;
      editedStudent.confirmPassword = data.confirmPassword;
    }
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

    const editUser = await User.findByIdAndUpdate(userStudentData._id, editedUser, {
      new: true,
      runValidators: true,
    });

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

    if (data?.lessonId?.length > 0 || data.lessonId !== undefined) {
      const lessonList = data.lessonId;

      const lessonDate = scheduleDetail.startDate;
      const lessonEndTime = moment(scheduleDetail.endTime, "LT").format("HH:mm");

      lessonList.forEach(async (res, i) => {
        const newDate = moment(lessonDate, "ll").add(7 * i, "days");

        const date = moment(newDate).format();
        const timeStamp = moment(date)
          .utc()
          .format();
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

          const quizRecord = await lessonQuiz.find({ courseLessonId: res.id }).sort({ questionNumber: 1 });

          const createQuizSchedule = await quizSchedule.create(
            quizRecord.length !== 0
              ? {
                  courseId: data.courseId,
                  courseScheduleId: data.courseScheduleId,
                  courseLessonId: res.id,
                  studentId: data.studentId,
                  scheduleLesson: value._id,
                  questions: quizRecord,
                  teacherId: scheduleDetail.teacherId,
                }
              : {
                  courseId: data.courseId,
                  courseScheduleId: data.courseScheduleId,
                  courseLessonId: res.id,
                  studentId: data.studentId,
                  scheduleLesson: value._id,
                  teacherId: scheduleDetail.teacherId,
                }
          );

          const homeworkRecord = await LessonHomeWork.find({ courseLessonId: res.id }).sort({ questionNumber: 1 });
          const createhomeworkSchedule = await homeworkSchedule.create(
            homeworkRecord
              ? {
                  courseId: data.courseId,
                  courseScheduleId: data.courseScheduleId,
                  courseLessonId: res.id,
                  studentId: data.studentId,
                  scheduleLesson: value._id,
                  questions: homeworkRecord,
                  teacherId: scheduleDetail.teacherId,
                }
              : {
                  courseId: data.courseId,
                  courseScheduleId: data.courseScheduleId,
                  courseLessonId: res.id,
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
    } else {
      const lessonList = await courseLesson.find({ courseId: data.courseId }).sort({ lessonNumber: 1 });

      const lessonDate = scheduleDetail.startDate;
      const lessonEndTime = moment(scheduleDetail.endTime, "LT").format("HH:mm");

      lessonList.forEach(async (res, i) => {
        const newDate = moment(lessonDate, "ll").add(7 * i, "days");

        const date = moment(newDate).format();
        const timeStamp = moment(date)
          .utc()
          .format();
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

          const quizRecord = await lessonQuiz.find({ courseLessonId: res._id }).sort({ questionNumber: 1 });
          //
          const createQuizSchedule = await quizSchedule.create(
            quizRecord.length !== 0
              ? {
                  courseId: data.courseId,
                  courseScheduleId: data.courseScheduleId,
                  courseLessonId: res._id,
                  studentId: data.studentId,
                  scheduleLesson: value._id,
                  //old code
                  // quizId: quizRecord.id,
                  //custom quiz creation
                  questions: quizRecord,
                  ////
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
          ///old code
          // const homeworkRecord = await homework.findOne({
          //   courseLessonId: res.id,
          // });
          //new code
          const homeworkRecord = await LessonHomeWork.find({ courseLessonId: res._id }).sort({ questionNumber: 1 });
          const createhomeworkSchedule = await homeworkSchedule.create(
            homeworkRecord
              ? {
                  courseId: data.courseId,
                  courseScheduleId: data.courseScheduleId,
                  courseLessonId: res._id,
                  studentId: data.studentId,
                  scheduleLesson: value._id,
                  ///old code
                  //homeworkId: homeworkRecord._id,
                  //new code
                  questions: homeworkRecord,
                  ///
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
    }
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
      Student.findByIdAndUpdate({ _id: studentId }, { imageUrl: getPublicImagUrl(mediaPath) })
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
//delete Student image
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

export async function ActiveEnrollList(req, res, next) {
  try {
    const data = req.query;
    const date = new Date();
    const newDate = moment(date)
      .tz("America/Chicago")
      .format();
    const currentDate = moment(newDate)
      .tz("America/Chicago")
      .format("ll");
    const currentTime = moment(newDate)
      .tz("America/Chicago")
      .format("HH:mm");
    const query = data.studentId ? { studentId: data.studentId } : { parentId: data.parentId };

    const checkoutList = await Billing.find(query)
      .populate({
        path: "courseId",
        populate: {
          path: "category",
        },
      })
      .populate("courseScheduleId")
      .populate("courseLessonId")
      .populate("studentId");

    const listData = [];
    let count = 0;

    if (checkoutList.length > 0) {
      checkoutList.map(async (list, index) => {
        const upcomingList = await upcomingSchedule.find(
          data.studentId
            ? {
                studentId: data.studentId,
                courseScheduleId: list.courseScheduleId._id,
                $or: [
                  {
                    $and: [{ timeStamp: currentDate }, { lessonEndTime: { $gt: currentTime } }],
                  },
                  {
                    timeStamp: { $gt: currentDate },
                  },
                ],
              }
            : {
                parentId: data.parentId,
                courseScheduleId: list.courseScheduleId._id,
                $or: [
                  {
                    $and: [{ timeStamp: currentDate }, { lessonEndTime: { $gt: currentTime } }],
                  },
                  {
                    timeStamp: { $gt: currentDate },
                  },
                ],
              }
        );
        if (upcomingList.length > 0) {
          listData.push(list);
        }
        count = count + 1;
        if (checkoutList.length === count) {
          res.status(200).json({
            message: "List of Active Course List",
            listData,
          });
        }
      });
    } else {
      res.status(200).json({
        message: "List of Active Course List",
        listData,
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function completedCourseList(req, res, next) {
  try {
    const data = req.query;
    const date = new Date();
    const newDate = moment(date)
      .tz("America/Chicago")
      .format();
    const currentDate = moment(newDate)
      .tz("America/Chicago")
      .format("ll");
    const currentTime = moment(newDate)
      .tz("America/Chicago")
      .format("HH:mm");

    const query = data.studentId ? { studentId: data.studentId } : { parentId: data.parentId };

    const checkoutList = await Billing.find(query)
      .populate({
        path: "courseId",
        populate: {
          path: "category",
        },
      })
      .populate("courseScheduleId")
      .populate("courseLessonId")
      .populate("studentId");

    const completedCourseList = [];
    let count = 0;

    if (checkoutList.length > 0) {
      checkoutList.map(async (list, index) => {
        const upcomingList = await upcomingSchedule.find(
          data.studentId
            ? {
                studentId: data.studentId,
                courseScheduleId: list.courseScheduleId._id,
                $or: [
                  {
                    $and: [{ timeStamp: currentDate }, { lessonEndTime: { $gt: currentTime } }],
                  },
                  {
                    timeStamp: { $gt: currentDate },
                  },
                ],
              }
            : {
                parentId: data.parentId,
                courseScheduleId: list.courseScheduleId._id,
                $or: [
                  {
                    $and: [{ timeStamp: currentDate }, { lessonEndTime: { $gt: currentTime } }],
                  },
                  {
                    timeStamp: { $gt: currentDate },
                  },
                ],
              }
        );
        if (upcomingList.length === 0) {
          completedCourseList.push(list);
        }
        count = count + 1;
        if (checkoutList.length === count) {
          res.status(200).json({
            message: "List of Active Course List",
            completedCourseList,
          });
        }
      });
    } else {
      res.status(200).json({
        message: "List of Active Course List",
        completedCourseList,
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function checkStudentSchdeuleExist(req, res, next) {
  try {
    const data = req.query;
    const studentId = data.studentId;
    const courseScheduleId = data.courseScheduleId;

    const scheduleDetail = await courseSchedule
      .findOne({
        _id: courseScheduleId,
      })
      .populate("courseId");
    const lessonList = await courseLesson.find({ courseId: scheduleDetail.courseId._id }).sort({ lessonNumber: 1 });
    const courseStartDate = scheduleDetail.startDate;
    const studentUpcomingScheduleList = await upcomingSchedule
      .find({ studentId: studentId })
      .populate("courseScheduleId")
      .populate("courseLessonId");
    const existingSchedule = [];

    lessonList.forEach(async (res, i) => {
      const newDate = moment(courseStartDate, "ll").add(7 * i, "days");
      const lessonDate = moment(newDate).format("ll");
      const clientTime1 = moment(scheduleDetail.startTime, "hh:mm A").format("HH:mm");
      const clientTime2 = moment(scheduleDetail.endTime, "hh:mm A").format("HH:mm");
      studentUpcomingScheduleList.forEach(async (data, i) => {
        const upcomingScheduleDate = data.lessonDate;
        const getTime1 = moment(data.courseScheduleId.startTime, "hh:mm A").format("HH:mm");
        const getTime2 = moment(data.courseScheduleId.endTime, "hh:mm A").format("HH:mm");
        if (lessonDate === upcomingScheduleDate) {
          if (
            lessonDate === upcomingScheduleDate &&
            ((getTime1 > clientTime1 && clientTime1 < getTime2 && getTime1 < clientTime2 && clientTime2 < getTime2) ||
              (getTime1 < clientTime1 && clientTime1 <= getTime2) ||
              (getTime1 === clientTime1 && getTime2 === clientTime2))
          ) {
            existingSchedule.push(res._id);
          }
        }
      });
    });
    if (existingSchedule.length === 0) {
      res.status(200).json({
        message: "Checked Student Upcoming Schedule",
      });
    } else {
      res.status(401).json({
        message: "Student Has Already Schedule In Some Other Courses",
      });
    }
  } catch (error) {
    next(error);
  }
}

export const getAllStudent = getAll(Student);
export const getStudent = getOne(Student);
export const deleteStudent = deleteOne(Student);
export const getAllUser = getAll(User);
export const getUser = getOne(User);
