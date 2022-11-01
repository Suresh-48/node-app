import TeacherApplication from "../models/teacherApplicationModel.js";
import Teacher from "../models/teacherModel.js";
import { getAll, deleteOne, updateOne } from "./baseController.js";
import sendMail from "../utils/sendMail.js";

const { FROM_EMAIL, FROM_EMAIL_DISPLAY_NAME } = process.env;

export async function createTeacherApplication(req, res, next) {
  try {
    const data = req.body;

    const editData = {
      teacherId: data.teacherId,
      education: data.education,
      experience: data.experience,
      profile: data.profile,
    };

    const exist = await TeacherApplication.findOne({ teacherId: data.teacherId });

    if (!exist) {
      const createTeacherApplication = await TeacherApplication.create({
        teacherId: data.teacherId,
        education: data.education,
        experience: data.experience,
        profile: data.profile,
      });
      const getTeacherData = await Teacher.findOne({ _id: data.teacherId });

      // Email Notifications start
      const TeacherApplicationSubmit = {
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
      };

      const TeacherApplicationSubmitData = {
        // to: FROM_EMAIL,
        to: getTeacherData.email,
        from: FROM_EMAIL,
        subject: "Teacher Application Submit",
        template: "TeacherApplicationSubmit",
        substitutions: TeacherApplicationSubmit,
      };
      res.status(201).json({
        message: "Teacher application Created SuccessFully",
        createTeacherApplication,
      });
      res.on("finish", () => {
        // To send a Email Notifications
        sendMail(TeacherApplicationSubmitData, () => {});
      });
    } else {
      const updateTeacherApplication = await TeacherApplication.findByIdAndUpdate(exist._id, editData);
      res.status(201).json({
        message: "Teacher application Updated SuccessFully",
        updateTeacherApplication,
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function getTeacherApplication(req, res, next) {
  try {
    const teacherId = req.params.id;

    const getTeacherApplication = await TeacherApplication.findOne({ teacherId: teacherId }).populate("teacherId");
    res.status(201).json({
      message: "Teacher application Details",
      getTeacherApplication,
    });
  } catch (error) {
    next(error);
  }
}

export async function UpdateTeacherApplicationStatus(req, res, next) {
  try {
    const id = req.params.id;
    const data = req.body;

    const exist = await TeacherApplication.findOne({ teacherId: id });

    const editedData = {
      status: data.status,
    };

    const editDetail = await TeacherApplication.findByIdAndUpdate(exist._id, editedData, {
      new: true,
      runValidators: true,
    });

    res.status(201).json({
      message: "Teacher Details Updated Successfuly",
      editDetail,
    });
  } catch (error) {
    next(error);
  }
}

export const updateTeacherApplication = updateOne(TeacherApplication);
export const getAllTeacherApplication = getAll(TeacherApplication);
export const deleteTeacherApplication = deleteOne(TeacherApplication);
