import TeacherAvailability from "../models/teacherAvailabilityModel.js";

import {
  getAll,
  getOne,
  deleteOne,
  updateOne,
  createOne,
} from "./baseController.js";

export const updateTeacherAvailability = updateOne(TeacherAvailability);
export const getAllTeacherAvailability = getAll(TeacherAvailability);
export const getTeacherAvailability = getOne(TeacherAvailability);
export const deleteTeacherAvailability = deleteOne(TeacherAvailability);

export async function createTeacherAvailability(req, res, next) {
  try {
    const data = req.body;
    const create = await TeacherAvailability.create(data);

    res.status(201).json({
      message: "Category Created SucessFully",
      data: {
        create,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function TeacherAvailabilityList(req, res, next) {
  try {
    const data = req.query;
    const availabilityList = await TeacherAvailability.find({
      teacherId: data.teacherId,
    });
    res.status(200).json({
      message: "Category Created SucessFully",
      data: {
        availabilityList,
      },
    });
  } catch (error) {
    next(error);
  }
}
