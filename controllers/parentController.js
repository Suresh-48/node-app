import Parent from "../models/parentModel.js";
import User from "../models/userModel.js";
import Student from "../models/studentModel.js";
import { getAll, getOne, deleteOne } from "./baseController.js";
import getRandomNumberForMail from "../utils/sendEmail.js";
import { USER_ROLE_PARENT } from "../constants/userRole.js";
import Billing from "../models/billingModel.js";
import { getPublicImagUrl, uploadBase64File } from "../utils/s3.js";

export async function signUp(req, res, next) {
  try {
    const data = req.body;

    const exist = await Parent.find({ email: data.email });

    if (exist.length == 0) {
      const parent = await Parent.create({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      const tokenId = getRandomNumberForMail();

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
      });

      res.status(201).json({
        status: "Created",
        message: "Parent Registration Created Successfuly",
        parent,
        parentLogin,
      });
    } else {
      res.status(208).json({
        status: "Already Exist",
        message: "Parent Already Exist",
        data: {
          exist,
        },
      });
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
      country: data.country,
      zipCode: data.zipCode,
      phone: data.phone,
      email: data.email,
      alternateEmail: data.alternateEmail,
      fbReference: data.fbReference,
      googleReference: data.googleReference,
      hearAboutUs: data.hearAboutUs,
      password: data.password,
      confirmPassword: data.confirmPassword,

    };
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

    const editUser = await User.findByIdAndUpdate(
      userParentData._id,
      editedUser,
      {
        new: true,
        runValidators: true,
      }
    );

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
        deleteStudentUser
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
    const parentId= req.params.id;
    const courseHistory=await Billing.find({parentId:parentId})
    .populate("studentId")
    .populate({path:"courseId",populate:{path:"categoryId"}})
    .populate({path:"courseScheduleId",populate:{path:"teacherId"}})

    res.status(200).json({
      message: "Course History List",
      courseHistory
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
      Parent.findByIdAndUpdate(
        { _id: parentId },
        { imageUrl: getPublicImagUrl(mediaPath) }
      )
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