import Parent from "../models/parentModel.js";
import User from "../models/userModel.js";
import Student from "../models/studentModel.js";
import upcomingSchedule from "../models/upcomingScheduleModel.js";
import { getAll, getOne, deleteOne } from "./baseController.js";
import getRandomNumberForMail from "../utils/sendEmail.js";
import { USER_ROLE_PARENT } from "../constants/userRole.js";
import Billing from "../models/billingModel.js";
import { getPublicImagUrl, uploadBase64File } from "../utils/s3.js";
import { OAuth2Client } from "google-auth-library";
import moment from "moment";
const client = new OAuth2Client("901411976146-5r87ft9nah8tqdp3stg7uod39i1h66ft.apps.googleusercontent.com");
import user from "../models/userModel.js";
import sendMail from "../utils/sendMail.js";
import jwt from "jsonwebtoken";
import { TOKEN_KEY } from "../config.js";

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
          const { email_verified, email } = response.payload;
          const responseData = response.payload;
          const firstName = responseData.given_name[0].toUpperCase() + responseData.given_name.substring(1);
          const lastName = responseData.family_name[0].toUpperCase() + responseData.family_name.substring(1);
          const exist = await User.find({ email: email });

          if (email_verified) {
            if (exist.length === 0) {
              const parent = await Parent.create({
                firstName: firstName,
                lastName: lastName,
                email: email,
                googleId: data.googleId,
                loginType: "Google",
              });

              // const tokenId = getRandomNumberForMail();
              const tokenId = getRandomNumberForMail();

              const parentLogin = await User.create({
                firstName: firstName,
                lastName: lastName,
                email: email,
                role: USER_ROLE_PARENT,
                token: tokenId,
                isEmailVerified: "true",
                parentId: parent._id,
                googleId: data.googleId,
                loginType: "Google",
              });
              res.status(201).json({
                status: "Created",
                message: "Parent Registration Created Successfuly",
                parent,
                parentLogin,
                dataVerified: true,
              });
            } else {
              res.status(400).json({
                status: "Already Exist",
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
          const parent = await Parent.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            faceBookId: data.faceBookId,
            loginType: "FaceBook",
          });

          // const tokenId = getRandomNumberForMail();
          const tokenId = jwt.sign({ email: data.email, password: data.password }, TOKEN_KEY, {
            expiresIn: "25m",
          });

          const parentLogin = await User.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            role: USER_ROLE_PARENT,
            token: tokenId,
            isFaceBookVerified: true,
            parentId: parent._id,
            faceBookId: data.faceBookId,
            loginType: "FaceBook",
          });

          res.status(201).json({
            status: "Created",
            message: "Parent Registration Created Successfully",
            parent,
            parentLogin,
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

      if (exist.length == 0) {
        const parent = await Parent.create({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
          loginType: "Email",
        });

        // const tokenId = getRandomNumberForMail();
        const tokenId = jwt.sign({ email: data.email, password: data.password }, TOKEN_KEY, {
          expiresIn: "25m",
        });

        const parentLogin = await User.create({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
          role: USER_ROLE_PARENT,
          token: tokenId,
          isEmailVerified: "true",
          parentId: parent._id,
          loginType: "Email",
        });

        // Email Notifications start
        const parentEmailSubstitutions = {
          appUrl: `https://kharphi.herokuapp.com/login`,
          websiteBaseUrl: "https://kharphi.herokuapp.com/",
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
          parentName: `${data.firstName} ${data.lastName}`,
        };

        const parentEmailData = {
          // to: FROM_EMAIL,
          to: data.email,
          from: FROM_EMAIL,
          subject: "Parent User Registration",
          template: "ParentRegistration",
          substitutions: parentEmailSubstitutions,
        };

        // Email Notifications Ends

        res.status(201).json({
          status: "Created",
          message: "Parent Registration Created Successfuly",
          parent,
          parentLogin,
          dataVerified: true,
        });
        res.on("finish", () => {
          // To send a Email Notifications
          sendMail(parentEmailData, () => {});
        });
      } else {
        res.status(400).json({
          status: "Already Exist",
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

export async function updateParent(req, res, next) {
  try {
    const id = req.params.id;
    const data = req.body;

    const editedData = {
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      address1: data.address1,
      address2: data.address2,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      phone: data.phone,
      email: data.email,
      alternateEmail: data.alternateEmail,
      fbReference: data.fbReference,
      googleReference: data.googleReference,
      hearAboutUs: data.hearAboutUs,
    };
    if (data.loginType === "Email") {
      editedData.password = data.password;
      editedData.confirmPassword = data.confirmPassword;
    }
    const editDetail = await Parent.findByIdAndUpdate(id, editedData, {
      new: true,
      runValidators: true,
    });

    const userParentData = await User.findOne({ parentId: id });

    const editedUser = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    };

    const editUser = await User.findByIdAndUpdate(userParentData._id, editedUser, {
      new: true,
      runValidators: true,
    });

    res.status(201).json({
      status: "Created",
      message: "Parent Details Updated Successfuly",
      editDetail,
      editUser,
    });
  } catch (error) {
    next(error);
  }
}

export async function setPasssword(req, res, next) {
  try {
    const id = req.params.id;
    const setpassData = req.body;

    const token_id = "";
    const editedData = {
      password: setpassData.password,
      token: token_id,
    };
    const editDetail = await User.findByIdAndUpdate(id, editedData, {
      new: true,
      runValidators: true,
    });

    res.status(201).json({
      status: "Created",
      message: "Password Created Successfuly",
      data: {
        editDetail,
      },
    });
  } catch (error) {
    next(error);
  }
}
export async function resetPasssword(req, res, next) {
  try {
    const id = req.params.id;
    const resetData = req.body;

    const token_id = "";
    const editedData = {
      password: resetData.password,
      token: token_id,
    };
    const editDetail = await User.findByIdAndUpdate(id, editedData, {
      new: true,
      runValidators: true,
    });

    res.status(201).json({
      status: "Created",
      message: "Password Created Successfuly",
      data: {
        editDetail,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getStudentList(req, res, next) {
  try {
    const parentId = req.query.parentId;
    const studentList = await Student.find({ parentId: parentId });
    res.status(200).json({
      status: "sucess",
      message: "Student List",
      length: studentList.length,
      data: {
        studentList,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function parentDeleteStudent(req, res, next) {
  try {
    const studentId = req.params.id;
    const deleteStudentDetail = await Student.deleteOne({ _id: studentId });
    const findUser = await User.findOne({ studentId: studentId });
    const deleteStudentUser = await User.deleteOne({ _id: findUser._id });

    res.status(200).json({
      message: "Parent Removed Student",
      data: {
        deleteStudentDetail,
        deleteStudentUser,
      },
    });
  } catch (error) {
    next(error);
  }
}

export const getAllParent = getAll(Parent);
export const getParent = getOne(Parent);
export const deleteParent = deleteOne(Parent);

export const getAllUser = getAll(User);
export const getUser = getOne(User);

export async function listOfCourseHistory(req, res, next) {
  try {
    const parentId = req.params.id;
    const courseHistory = await Billing.find({ parentId: parentId })
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

// student image upload
export async function parentProfileImage(req, res, next) {
  try {
    const parentId = req.body.parentId;
    const file = req.body.image;
    const parent_PATH = "media/parent";
    const type = file && file.split(";")[0].split("/")[1];
    const random = new Date().getTime();
    const fileName = `${parentId}-${random}.${type}`;
    const filePath = `${parent_PATH}/${fileName}`;
    const parentDetails = await Parent.findById(parentId);
    if (!parentDetails) {
      return next(new Error("parent not found"));
    }

    uploadBase64File(file, filePath, async (err, mediaPath) => {
      if (err) {
        return callback(err);
      }
      Parent.findByIdAndUpdate({ _id: parentId }, { imageUrl: getPublicImagUrl(mediaPath) })
        .then((obj) => {
          res.status(201).json({
            status: "Created",
            message: "parent Image Updated Successfully",
            parentDetails,
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
//delete parent profile image
export async function DeleteParentImage(req, res, next) {
  try {
    const parentId = req.query.parentId;
    const removeImage = await Parent.findByIdAndUpdate(parentId, {
      imageUrl: "",
    });
    res.status(204).json({
      message: "Parent Profile Image Removed",
    });
  } catch (error) {
    next(error);
  }
}

//parent make student active & inactive
export async function changeStudentActiveStatus(req, res, next) {
  try {
    const data = req.body;

    const date = Date.now();
    const currentDate = moment(date)
      .tz("America/Chicago")
      .format("ll");
    const courseList = await upcomingSchedule.find({
      timeStamp: { $gte: currentDate },
      studentId: data.studentId,
    });

    if (courseList.length === 0) {
      const changeStatus = await Student.findByIdAndUpdate(data.studentId, {
        activeStatus: data.activeStatus,
      });
      res.status(201).json({
        message: "Student Active Status Changed",
        changeStatus,
      });
    } else {
      res.status(403).json({
        message: "Student Has An Ongoing Courses",
        courseList,
      });
    }
  } catch (error) {
    next(error);
  }
}
