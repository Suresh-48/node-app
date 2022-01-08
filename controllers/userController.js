import User from "../models/userModel.js";
import Parent from "../models/parentModel.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
dotenv.config({ silent: true });
import { getAll, getOne, deleteOne, createOne, updateOne } from "./baseController.js";
import getRandomNumberForMail from "../utils/sendEmail.js";
const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

export const createUser = createOne(User);
export const updateUser = updateOne(User);
export const getAllUser = getAll(User);
export const getUser = getOne(User);
export const deleteUser = deleteOne(User);

export async function login(req, res, next) {
  try {
    const login = req.body;
    const email = login.email;
    const password = login.password;

    const user = await User.findOne({ email: email, password: password });

    const tokenId = getRandomNumberForMail();

    if (user) {
      const userParentData = await User.findOne({ parentId: user.parentId });

      const editedUser = {
        token: tokenId,
      };

      const updateToken = await User.findByIdAndUpdate(userParentData._id, editedUser, {
        new: true,
        runValidators: true,
      });
      const hash = await bcrypt.hash(password, 10);

      res.status(201).json({
        status: "Created",
        user,
      });
    } else {
      res.status(400).json({
        status: "Bad Request",
        message: "Invalid Credential",
      });
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
