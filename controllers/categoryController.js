import Category from "../models/categoryModel.js";

import { getAll, getOne, deleteOne, updateOne } from "./baseController.js";

export async function createCategory(req, res, next) {
  try {
    const categoryName = req.body.name;
    const editedName = new RegExp(["^", categoryName, "$"].join(""), "i");
    const exist = await Category.find({ name: editedName });

    if (exist.length === 0) {
      const createCategory = await Category.create({ name: categoryName });
      res.status(201).json({
        message: "Category Created SucessFully",
        data: {
          createCategory,
        },
      });
    } else {
      res.status(208).json({
        message: "Category Name Alredy Exist",
        data: {
          data: exist,
        },
      });
    }
  } catch (error) {
    next(error);
  }
}

export const updateCategory = updateOne(Category);
export const getAllCategory = getAll(Category);
export const getCategory = getOne(Category);
export const deleteCategory = deleteOne(Category);
