import FavouriteCourse from "../models/favouriteCourse.js";

import { getAll, getOne, deleteOne, updateOne } from "./baseController.js";

export async function createFavouriteCourse(req, res, next) {
  try {
    const data = req.body;

    const exist = await FavouriteCourse.find({
      userId: data.userId,
      courseId: data.courseId,
    });
    if (exist.length === 0) {
      const createFavouriteCourse = await FavouriteCourse.create({
        userId: data.userId,
        courseId: data.courseId,
      });
      res.status(201).json({
        message: "Favourite Course Created SucessFully",
        data: {
          createFavouriteCourse,
        },
      });
    } else {
      const deleteFavouriteCourse = await FavouriteCourse.findByIdAndDelete(
        exist[0].id
      );
      res.status(201).json({
        message: "Favourite Course deleted SucessFully",
        data: {
          deleteFavouriteCourse,
        },
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function getFavouriteCourseList(req, res, next) {
  try {
    const data = req.query;
    const favouriteCourseList = await FavouriteCourse.find({
      userId: data.userId,
    })
      .populate("courseId")
      .populate("userId");

    favouriteCourseList.forEach((list, index) => {
      list.courseId.favourite = true;
    });
    res.status(201).json({
      message: "Favourite Course List",
      data: {
        favouriteCourseList,
      },
    });
  } catch (error) {
    next(error);
  }
}

export const updateFavouriteCourse = updateOne(FavouriteCourse);
export const getAllFavouriteCourse = getAll(FavouriteCourse);
export const getFavouriteCourse = getOne(FavouriteCourse);
export const deleteFavouriteCourse = deleteOne(FavouriteCourse);
