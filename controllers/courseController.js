import Course from "../models/courseModel.js";
import Category from "../models/categoryModel.js";
import courseSchedule from "../models/courseScheduleModel.js";
import { getPublicImagUrl, uploadBase64File } from "../utils/s3.js";
import courseLesson from "../models/courseLessonModel.js";
import { getAll, getOne, deleteOne, updateOne } from "./baseController.js";
import course from "../models/courseModel.js";
import Billing from "../models/billingModel.js";
import { parse } from "dotenv";

export async function courseCreation(req, res, next) {
  try {
    const data = req.body;
    const categoryName = await Category.findOne({ _id: data.category });
    const courseName = categoryName.name + " " + data.name;
    const aliasName = courseName.replace(/\s/g, "-");
    const exist = await Course.find({ name: data.name, category: data.category });
    const actualPrice = parseInt(data.actualAmount);
    const discountPrice = parseInt(data.discountAmount);
    const amountValidate = actualPrice > discountPrice;

    if (exist.length == 0) {
      if (amountValidate) {
        const createData = await Course.create({
          category: data.category,
          name: data.name,
          aliasName: aliasName,
          description: data.description,
          schedule: data.schedule,
          actualAmount: data.actualAmount,
          discountAmount: data.discountAmount,
          submitType: data.type,
          isFuture: data.isFuture,
          duration: data.duration,
        });

        res.status(201).json({
          status: "Created",
          message: "Course Created Successfuly",
          data: {
            createData,
          },
        });
      } else {
        res.status(406).json({
          message: "Discount Amount Should Be Lesser Then Actual Amount",
        });
      }
    } else {
      res.status(208).json({
        status: "Already Exist",
        message: "Course Already Exist",
        data: {
          exist,
        },
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function updateCourse(req, res, next) {
  try {
    const id = req.params.id;
    const data = req.body;
    const categoryName = await Category.findOne({ _id: data.category });
    const courseName = categoryName.name + " " + data.name;
    const aliasName = courseName.replace(/\s/g, "-");
    const actualPrice = parseInt(data.actualAmount);
    const discountPrice = parseInt(data.discountAmount);
    const amountValidate = actualPrice > discountPrice;

    const findCourseEnrolled = await Billing.find({ courseId: data.id });
    const exist = await course.find({ _id: { $nin: [data.id] }, category: data.category, name: data.name });
    const editedData = {
      category: data.category,
      name: data.name,
      aliasName: aliasName,
      description: data.description,
      actualAmount: data.actualAmount,
      discountAmount: data.discountAmount,
      submitType: data.type,
      isFuture: data.isFuture,
      duration: data.duration,
    };
    if (findCourseEnrolled.length !== 0 && data.type === "Draft") {
      res.status(406).json({
        message: "This Course Has Been Enrolled ",
      });
    } else if (exist.length == 0) {
      if (amountValidate) {
        const editDetail = await Course.findByIdAndUpdate(id, editedData, {
          new: true,
          runValidators: true,
        });

        res.status(201).json({
          message: "Course Updated Successfuly",
          data: {
            editDetail,
          },
        });
      } else {
        res.status(406).json({
          message: "Discount Amount Should Be Lesser Then Actual Amount",
        });
      }
    } else {
      res.status(208).json({
        message: "Course Name Already Exist",
        data: {
          exist,
        },
      });
    }
  } catch (error) {
    next(error);
  }
}
export const UpdateCourseImage = updateOne(Course);

export const deleteCourse = deleteOne(Course);

export async function getAllCourse(req, res, next) {
  try {
    const data = await Course.find().populate({ path: "category", select: "name" });
    res.status(201).json({
      status: "success",
      message: "Course Created Successfuly",
      data: {
        data,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getPublishCourse(req, res, next) {
  try {
    const data = await Course.find({ submitType: "Publish" }).populate("category");

    res.status(200).json({
      status: "success",
      message: "List Of Publish Course",
      data: {
        data,
      },
    });
  } catch (error) {
    next(error);
  }
}
export async function getDraftCourse(req, res, next) {
  try {
    const data = await Course.find({ submitType: "Draft" }).populate("category");
    res.status(200).json({
      status: "success",
      message: "List Of Draft Course",
      data: {
        data,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getArchiveCourse(req, res, next) {
  try {
    const data = await Course.find({ submitType: "Archive" }).populate("category");
    res.status(200).json({
      status: "success",
      message: "List Of Archive Course",
      data: {
        data,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function changeCourseType(req, res, next) {
  try {
    const id = req.body.courseId;
    const type = req.body.type;
    if (type === "Publish") {
      const courseUpdate = await Course.updateOne({ _id: id }, { submitType: type });
      res.status(200).json({
        message: "Course Moved TO Publish",
        data: courseUpdate,
      });
    } else {
      const findCourseEnroll = await Billing.find({ courseId: id });
      if (findCourseEnroll.length === 0) {
        const updateCourseType = await Course.updateOne({ _id: id }, { submitType: type });
        res.status(200).json({
          message: "Course Created Successfuly",
          data: updateCourseType,
        });
      } else {
        res.status(405).json({
          message: "This Course Has Been Enrolled",
        });
      }
    }
  } catch (error) {
    next(error);
  }
}

export async function getCourseForLandingScreen(req, res, next) {
  try {
    const courses = await Course.find({ isFuture: true, submitType: "Publish" }).populate({
      path: "category",
      select: "name",
    });
    const overallCourse = await Course.find();
    res.status(200).json({
      status: "success",
      message: "Get Course For Landing Page",
      overallCourseCount: overallCourse.length,
      data: courses,
    });
  } catch (error) {
    next(error);
  }
}

export async function getCourse(req, res, next) {
  try {
    const id = req.params.id;
    const courses = await Course.findOne({ _id: id }).populate("category");
    res.status(200).json({
      status: "success",
      message: "Get Course For Landing Page",
      data: courses,
    });
  } catch (error) {
    next(error);
  }
}

export async function categoryFilter(req, res, next) {
  try {
    const category = req.body.filter;
    const amountRange = req.body.range;
    const search = req.body.search;

    const datas = [];

    category.forEach((res) => {
      datas.push(res.id);
    });
    //category filter
    if (category.length != 0 && search.length === 0 && amountRange.length === 0) {
      const result = await Course.find({ category: { $in: datas }, submitType: "Publish" }).populate("category");

      res.status(200).json({
        status: "success",
        message: "Get Filtered Courses",
        length: result.length,
        data: result,
      });
    }
    //payment rage filter
    else if (amountRange.length != 0 && search.length === 0 && category.length === 0) {
      const slider = await Course.find({
        discountAmount: {
          $gte: amountRange[0],
          $lt: amountRange[1],
        },
        submitType: "Publish",
      }).populate("category");

      res.status(200).json({
        status: "success",
        message: "Courses Between Amount Range",
        length: slider.length,
        data: slider,
      });
    }
    //course search
    else if (amountRange.length === 0 && search.length !== 0 && category.length === 0) {
      const reg = new RegExp(".*" + search + ".*", "i");
      const query = { name: { $regex: reg } };

      const courseSearch = await Course.find(query);

      res.status(200).json({
        status: "success",
        message: "Courses Between Amount Range",
        length: courseSearch.length,
        data: courseSearch,
      });
    }
    // payment range and search filter
    else if (amountRange.length != 0 && search.length != 0 && category.length === 0) {
      const reg = new RegExp(".*" + search + ".*", "i");

      const paymentAndSearch = await Course.find({
        discountAmount: {
          $gte: amountRange[0],
          $lt: amountRange[1],
        },
        name: { $regex: reg },
        submitType: "Publish",
      }).populate("category");

      res.status(200).json({
        status: "success",
        message: "Courses Between Amount Range",
        length: paymentAndSearch.length,
        data: paymentAndSearch,
      });
    }
    //category and payemnt range filter
    else if (category.length != 0 && search.length === 0 && amountRange.length != 0) {
      const categoryAndPayment = await Course.find({
        category: { $in: datas },
        submitType: "Publish",
        discountAmount: {
          $gte: amountRange[0],
          $lt: amountRange[1],
        },
      }).populate("category");

      res.status(200).json({
        status: "success",
        message: "Get Filtered Courses",
        length: categoryAndPayment.length,
        data: categoryAndPayment,
      });
    }
    //category and serch filter
    else if (amountRange.length === 0 && search.length != 0 && category.length != 0) {
      const reg = new RegExp(".*" + search + ".*", "i");

      const categorySearchAndPayment = await Course.find({
        category: { $in: datas },
        name: { $regex: reg },
        submitType: "Publish",
      }).populate("category");

      res.status(200).json({
        status: "success",
        message: "Courses Between Amount Range",
        length: categorySearchAndPayment.length,
        data: categorySearchAndPayment,
      });
    }
    //category ,payment range and search filter
    else if (amountRange.length != 0 && search.length != 0 && category.length != 0) {
      const reg = new RegExp(".*" + search + ".*", "i");

      const categoryAndSearch = await Course.find({
        category: { $in: datas },
        name: { $regex: reg },
        discountAmount: {
          $gte: amountRange[0],
          $lt: amountRange[1],
        },
        submitType: "Publish",
      }).populate("category");

      res.status(200).json({
        status: "success",
        message: "Courses Between Amount Range",
        length: categoryAndSearch.length,
        data: categoryAndSearch,
      });
    }
    //get all published course list
    else {
      const data = await Course.find({ submitType: "Publish" }).populate("category");

      res.status(200).json({
        status: "success",
        message: "All Published Courses",
        data: data,
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function courseImage(req, res, next) {
  try {
    const courseId = req.body.courseId;
    const file = req.body.image;
    const course_PATH = "media/course";
    const type = file && file.split(";")[0].split("/")[1];
    const random = new Date().getTime();
    const fileName = `${courseId}-${random}.${type}`;
    const filePath = `${course_PATH}/${fileName}`;
    const courseDetails = await Course.findById(courseId);
    if (!courseDetails) {
      return next(new Error("course not found"));
    }

    // Upload file
    uploadBase64File(file, filePath, async (err, mediaPath) => {
      if (err) {
        return callback(err);
      }
      Course.updateOne(
        { _id: courseId }, // Filter
        { imageUrl: getPublicImagUrl(mediaPath) } // Update
      )
        .then((obj) => {
          res.status(201).json({
            status: "Created",
            message: "course Image updated successfully",

            data: {
              courseDetails,
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

export async function courseDetail(req, res, next) {
  try {
    const id = req.params.id;

    const courseDetail = await Course.findOne({ aliasName: id }).populate("category");
    const lessonDetail = await courseLesson.find({ courseId: courseDetail._id });
    const scheduleDetail = await courseSchedule.find({ courseId: courseDetail._id }).populate("teacherId");

    res.status(200).json({
      status: 200,
      message: "Course Detail List",
      data: {
        courseDetail,
        lessonDetail,
        scheduleDetail,
      },
    });
  } catch (error) {
    next(error);
  }
}
