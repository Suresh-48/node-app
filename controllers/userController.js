import User from "../models/userModel.js";
import Parent from "../models/parentModel.js";
import Teacher from "../models/teacherModel.js";
// import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getAll, getOne, deleteOne, createOne, updateOne } from "./baseController.js";
import getRandomNumberForMail from "../utils/sendEmail.js";
import sendMail from "../utils/sendMail.js";
const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;
const client = new OAuth2Client("901411976146-5r87ft9nah8tqdp3stg7uod39i1h66ft.apps.googleusercontent.com");
import { OAuth2Client } from "google-auth-library";
import student from "../models/studentModel.js";
import { TOKEN_KEY } from "../config.js";

const { FROM_EMAIL, FROM_EMAIL_DISPLAY_NAME } = process.env;

export const createUser = createOne(User);
export const updateUser = updateOne(User);
export const getAllUser = getAll(User);
// export const getUser = getOne(User);
export const deleteUser = deleteOne(User);

export async function login(req, res, next) {
  try {
    const data = req.body;
    const email = data.email;
    const password = data.password;
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
          if (email_verified) {
            const user = await User.findOne({
              email: email,
              googleId: data.googleId,
            });
            if (user) {
              const role = user.role;
              let checkPassword = false;
              if (role === "student") {
                const userDetail = await student.findOne({
                  email: email,
                  googleId: data.googleId,
                });
                checkPassword = userDetail.dob !== undefined || userDetail.gender !== undefined ? true : false;
              } else if (role === "parent") {
                checkPassword = true;
              } else if (role === "teacher") {
                const userDetail = await Teacher.findOne({
                  email: email,
                  googleId: data.googleId,
                });
                checkPassword = userDetail.specialityDescription !== undefined;
                userDetail.speciality !== undefined || userDetail.phone !== undefined ? true : false;
              }
              const userData = await User.findOne({ _id: user._id });
              const tokenId = jwt.sign({ email: user.email }, TOKEN_KEY, {
                expiresIn: "25m",
              });

              const editedUser = {
                token: tokenId,
              };

              const updateToken = await User.findByIdAndUpdate(userData._id, editedUser, {
                new: true,
                runValidators: true,
              });

              res.status(200).json({
                message: "User Login Success",
                updateToken,
                dataVerified: checkPassword,
              });
            } else {
              res.status(400).json({
                status: "Bad Request",
                message: "Invalid Credential, Sign in to Continue",
              });
            }
          }
        });
    } else if (data.isFaceBookLogin) {
      if (data.email && data.faceBookId) {
        const user = await User.findOne({
          email: email,
          faceBookId: data.faceBookId,
        });
        const role = user.role;
        let checkPassword = false;
        if (role === "student") {
          const userDetail = await student.findOne({
            email: email,
            faceBookId: data.faceBookId,
          });
          checkPassword = userDetail.dob !== undefined || userDetail.gender !== undefined ? true : false;
        } else if (role === "parent") {
          checkPassword = true;
        } else if (role === "teacher") {
          const userDetail = await Teacher.findOne({
            email: email,
            faceBookId: data.faceBookId,
          });
          checkPassword = userDetail.specialityDescription !== undefined;
          userDetail.speciality !== undefined || userDetail.phone !== undefined ? true : false;
        }

        const userData = await User.findOne({
          _id: user._id,
        });

        const tokenId = jwt.sign({ email: user.email }, TOKEN_KEY, { expiresIn: "25m" });

        const editUser = {
          token: tokenId,
        };

        const updateToken = await User.findByIdAndUpdate(userData._id, editUser, {
          new: true,
          runValidators: true,
        });

        res.status(200).json({
          message: "User Login Success",
          updateToken,
          dataVerified: checkPassword,
        });
      } else {
        res.status(400).json({
          message: "Email Verification Failed, Try Again After SomeTime",
        });
      }
    } else {
      const user = await User.findOne({ email: email, password: password });

      // const tokenId = getRandomNumberForMail();

      if (user) {
        const userParentData = await User.findOne({ _id: user._id });
        const tokenId = jwt.sign({ email: user.email, password: user.password }, TOKEN_KEY, {
          expiresIn: "25m",
        });

        const editedUser = {
          token: tokenId,
        };

        const updateToken = await User.findByIdAndUpdate(user._id, editedUser, {
          new: true,
          runValidators: true,
        });
        // const hash = await bcrypt.hash(password, 10);

        res.status(200).json({
          status: "Created",
          updateToken,
        });
      } else {
        res.status(400).json({
          status: "Bad Request",
          message: "Invalid Credential",
        });
      }
    }
  } catch (err) {
    console.log("err", err);
  }
}

export async function logout(req, res, next) {
  try {
    const data = req.body;

    const userParentData = await Parent.findOne({ email: data.email });

    const userDataId = await User.findOne({ parentId: userParentData.id });

    const editedUser = {
      token: "",
    };

    const editUser = await User.findByIdAndUpdate(userDataId._id, editedUser, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "Logout Successfuly",
      editUser,
    });
  } catch (error) {
    next(error);
  }
}

export async function getUser(req, res, next) {
  try {
    const getOne = await User.findById(req.params.id);

    if (!getOne) {
      return next(new AppError(404, "fail", "No document found with that id"), req, res, next);
    }
    const teacherStatus = getOne.role === "teacher" && (await Teacher.findById(getOne.teacherId));

    res.status(200).json({
      status: "success",
      data: {
        getOne,
        teacherStatus,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function forgetPassword(req, res, next) {
  try {
    const data = req.body;

    const getUser = await User.findOne({ email: data.email });

    const userNames = getUser.firstName + " " + getUser.lastName;

    const gendrateVerificationCode =
      Math.random().toString(36).substring(2, 7) + Math.random().toString(36).substring(2, 7);

    if (getUser) {
      const editPassword = {
        appUrl: `https://kharphi.herokuapp.com/login`,
        websiteBaseUrl: "https://kharphi.herokuapp.com/login",
        facebookUrl: "https://kharphi.herokuapp.com/login",
        twitterUrl: "https://kharphi.herokuapp.com/login",
        instagramUrl: "https://kharphi.herokuapp.com/login",
        linkedInUrl: "https://kharphi.herokuapp.com/login",
        dribbleUrl: "https://kharphi.herokuapp.com/login",
        emailLogoUrl: "http:localhost:3000",
        copyRightText: "https://kharphi.herokuapp.com",
        emailPrimaryBackgroundColor: "#009dda",
        emailPrimaryTextColor: "#FFFFFF",
        mediaBaseUrl: "https://kharphi.herokuapp.com/login",
        marketplaceName: "https://kharphi.herokuapp.com/login",
        resetCode: gendrateVerificationCode,
        userName: userNames,
      };

      const sendPassword = {
        to: getUser.email,
        from: FROM_EMAIL,
        subject: "Forget Password ",
        template: "Forgetpassword",
        substitutions: editPassword,
      };

      await User.findByIdAndUpdate(getUser.id, {
        passwordVerificationCode: gendrateVerificationCode,
      });
      res.status(201).json({
        message: "Verification Code Send To User Mail",
      });
      res.on("finish", () => {
        // To send a Email Notifications
        sendMail(sendPassword, () => {});
      });
    } else {
      res.status(400).json({
        message: "Email Doesn't Exist ",
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function setNewPassword(req, res, next) {
  try {
    const data = req.body;

    const getUser = await User.findOne({ email: data.email });

    if (getUser) {
      const checkVerificationCode = getUser.passwordVerificationCode === data.verificationCode;
      if (checkVerificationCode) {
        await User.findByIdAndUpdate(getUser.id, {
          password: data.newPassword,
          confirmPassword: data.confirmPassword,
        });

        getUser.studentId
          ? await student.findByIdAndUpdate(getUser.studentId, {
              password: data.newPassword,
              confirmPassword: data.confirmPassword,
            })
          : getUser.parentId
          ? await Parent.findByIdAndUpdate(getUser.parentId, {
              password: data.newPassword,
              confirmPassword: data.confirmPassword,
            })
          : await Teacher.findByIdAndUpdate(getUser.teacherId, {
              password: data.newPassword,
              confirmPassword: data.confirmPassword,
            });

        res.status(201).json({
          status: "User Password Changed Successfully",
        });
      } else {
        res.status(400).json({
          message: "Verification Code Doesn't Match",
        });
      }
    } else {
      res.status(400).json({
        message: "Email Doesn't Exist ",
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function changePassword(req, res, next) {
  try {
    const data = req.body;

    if (data.userId) {
      const getUser = await User.findOne({ _id: data.userId });

      if (getUser) {
        const checkOldPassword = getUser.password === data.oldPassword;
        if (checkOldPassword) {
          await User.findByIdAndUpdate(getUser.id, {
            password: data.newPassword,
            confirmPassword: data.confirmPassword,
          });
          getUser.studentId
            ? await student.findByIdAndUpdate(getUser.studentId, {
                password: data.newPassword,
                confirmPassword: data.confirmPassword,
              })
            : getUser.parentId
            ? await Parent.findByIdAndUpdate(getUser.parentId, {
                password: data.newPassword,
                confirmPassword: data.confirmPassword,
              })
            : await Teacher.findByIdAndUpdate(getUser.teacherId, {
                password: data.newPassword,
                confirmPassword: data.confirmPassword,
              });
          res.status(201).json({
            status: "User Password Changed Successfully",
          });
        } else {
          res.status(400).json({
            message: "Old Password Doesn't Match",
          });
        }
      }
    } else {
      res.status(400).json({
        message: "Login Required To Set Password",
      });
    }
  } catch (error) {
    next(error);
  }
}
