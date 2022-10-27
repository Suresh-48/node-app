import Category from "../models/categoryModel.js";
import { getPublicImagUrl, uploadBase64File } from "../utils/s3.js";
import { getAll, getOne, deleteOne, updateOne } from "./baseController.js";
import moment from "moment-timezone";

export async function createCategory(req, res, next) {
  try {
    const categoryName = req.body.name;
    const userId = req.body.createdBy;
    const editedName = new RegExp(["^", categoryName, "$"].join(""), "i");
    const exist = await Category.find({ name: editedName });

    const categoryNameUpperCase = categoryName.split(" ");

    for (var i = 0; i < categoryNameUpperCase.length; i++) {
      categoryNameUpperCase[i] = categoryNameUpperCase[i].charAt(0).toUpperCase() + categoryNameUpperCase[i].slice(1);
    }

    const concatCategoryName = categoryNameUpperCase.join(" ");

    const date = Date.now();
    const createAt = moment(date).tz("America/Chicago").format("lll");

    if (exist.length === 0) {
      const createCategory = await Category.create({
        name: concatCategoryName,
        createdAt: createAt,
        createdBy: userId,
      });
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

export async function categoryImage(req, res, next) {
  try {
    const categoryId = req.body.categoryId;
    const file = req.body.image;

    const category_PATH = "media/category";
    const type = file && file.split(";")[0].split("/")[1];
    const random = new Date().getTime();
    const fileName = `${categoryId}-${random}.${type}`;
    const filePath = `${category_PATH}/${fileName}`;
    const categoryDetails = await Category.findById(categoryId);
    if (!categoryDetails) {
      return next(new Error("category not found"));
    }

    // Upload file
    uploadBase64File(file, filePath, async (err, mediaPath) => {
      if (err) {
        return callback(err);
      }
      Category.updateOne({ _id: categoryId }, { imageUrl: getPublicImagUrl(mediaPath) })
        .then((obj) => {
          res.status(201).json({
            status: "Created",
            message: "Category Image Updated Successfully",

            data: {
              categoryDetails,
            },
          });
        })
        .catch((err) => {
          console.log("Error: " + err);
        });
    });
  } catch (err) {
    next(err);
  }
}

export async function getCategoryList(req, res, next) {
  try {
    const id = req.params.id;
    const category = await Category.find().populate("createdBy");
    res.status(200).json({
      status: "success",
      message: "Get All Category List",
      data: category,
    });
  } catch (error) {
    next(error);
  }
}


export const getAllCategory = getAll(Category);
export const updateCategory = updateOne(Category);
export const getCategory = getOne(Category);
export const deleteCategory = deleteOne(Category);
