import Course from "../models/courseModel.js";
import Category from "../models/categoryModel.js";
import courseSchedule from "../models/courseScheduleModel.js";
import moment from "moment-timezone";
import { getPublicImagUrl, uploadBase64File } from "../utils/s3.js";
import courseLesson from "../models/courseLessonModel.js";
import { getAll, getOne, deleteOne, updateOne } from "./baseController.js";
import course from "../models/courseModel.js";
import Billing from "../models/billingModel.js";
import FavouriteCourse from "../models/favouriteCourse.js";
import user from "../models/userModel.js";

export async function courseCreation(req, res, next) {
  try {
    const data = req.body;
    const categoryName = await Category.findOne({ _id: data.category });
    const courseName = categoryName.name + " " + data.name;
    const aliasName = courseName.replace(/\s/g, "-");
    const exist = await Course.find({
      name: data.name,
      category: data.category,
    });

    if (exist.length == 0) {
      const createData = await Course.create({
        category: data.category,
        name: data.name,
        aliasName: aliasName,
        description: data.description,
        schedule: data.schedule,
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

    const findCourseEnrolled = await Billing.find({ courseId: data.id });
    const exist = await course.find({
      _id: { $nin: [data.id] },
      category: data.category,
      name: data.name,
    });
    const editedData = {
      category: data.category,
      name: data.name,
      aliasName: aliasName,
      description: data.description,
      submitType: data.type,
      isFuture: data.isFuture,
      duration: data.duration,
    };
    if (findCourseEnrolled.length !== 0 && data.type === "Draft") {
      res.status(406).json({
        message: "This Course Has Been Enrolled ",
      });
    } else if (exist.length == 0) {
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
    const data = await Course.find().populate({
      path: "category",
      select: "name",
    });
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
    const data = req.query;
    const courses = await Course.find({
      isFuture: true,
      submitType: "Publish",
    }).populate({
      path: "category",
      select: "name",
    });
    const overallCourse = await Course.find();
    const favCourse = await FavouriteCourse.find({ userId: data.userId });
    const favlength = favCourse.length;
    if (favlength > 0)
      courses.map(async (res) => {
        for (let i = 0; i <= favlength; i++) {
          if (res?.id == favCourse[i]?.courseId) {
            res.favourite = true;
          }
        }
      });
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

function updateFav(courses, favCourse, favlength, res) {
  if (favlength > 0) {
    courses.map(async (res) => {
      for (let i = 0; i < favlength; i++) {
        if (res?.id == favCourse[i]?.courseId) {
          res.favourite = true;
        }
      }
    });
  }
  res.status(200).json({
    status: "success",
    message: "Courses List",
    length: courses.length,
    data: courses,
  });
}

export async function categoryFilter(req, res, next) {
  try {
    const userId = req.body.userId;
    const category = req.body.filter;
    const amountRange = req.body.range;
    const search = req.body.search;

    const datas = [];
    const favCourse = await FavouriteCourse.find({ userId: userId });
    const favlength = favCourse.length;

    category.forEach((res) => {
      datas.push(res.id);
    });
    //category filter
    if (category.length != 0 && search.length === 0 && amountRange.length === 0) {
      const result = await Course.find({
        category: { $in: datas },
        submitType: "Publish",
      }).populate("category");

      updateFav(result, favCourse, favlength, res);
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
      updateFav(slider, favCourse, favlength, res);
    }

    //course search
    else if (amountRange.length === 0 && search.length !== 0 && category.length === 0) {
      const reg = new RegExp(".*" + search + ".*", "i");
      const query = { name: { $regex: reg } };

      const courseSearch = await Course.find(query);

      updateFav(courseSearch, favCourse, favlength, res);
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

      updateFav(paymentAndSearch, favCourse, favlength, res);
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

      updateFav(categoryAndPayment, favCourse, favlength, res);
    }
    //category and serch filter
    else if (amountRange.length === 0 && search.length != 0 && category.length != 0) {
      const reg = new RegExp(".*" + search + ".*", "i");

      const categorySearchAndPayment = await Course.find({
        category: { $in: datas },
        name: { $regex: reg },
        submitType: "Publish",
      }).populate("category");

      updateFav(categorySearchAndPayment, favCourse, favlength, res);
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

      updateFav(categoryAndSearch, favCourse, favlength, res);
    }
    //get all published course list
    else {
      const data = await Course.find({ submitType: "Publish" }).populate("category");
      updateFav(data, favCourse, favlength, res);
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
    const data = req.query;
    const courseDetail = await Course.findOne({ aliasName: id }).populate("category");
    const updateFavouriteCourse = await FavouriteCourse.find({
      userId: data.userId,
      courseId: courseDetail.id,
    });
    const favourite = updateFavouriteCourse.length > 0 ? true : false;

    const lessonDetail = await courseLesson.find({
      courseId: courseDetail._id,
    });
    lessonDetail.map(async (list, key) => {
      const checkoutData = await Billing.find({
        lessonId: list._id,
        studentId: data.studentId,
      });

      if (checkoutData.length > 0) {
        checkoutData.map(async (checkList) => {
          const stId = checkList.studentId;

          const userDetails = await user.findOne({
            studentId: stId,
          });

          if (list.id == checkList.lessonId && data.userId == userDetails._id) {
            Object.assign(lessonDetail[key], { isCheckout: true });
          } else {
            Object.assign(lessonDetail[key], { isCheckout: false });
          }

          // if (list.id == checkList.lessonId) {
          //   Object.assign(lessonDetail[key], { isCheckout: true });
          // }
        });
      } else {
        const checkoutData = await Billing.find({
          courseId: courseDetail.id,
          studentId: data.studentId,
        });

        const courseChecoutvalidation = checkoutData[0]?.isCourseChecout;
        if (courseChecoutvalidation === true) {
          Object.assign(lessonDetail[key], { isCheckout: true });
        } else {
          Object.assign(lessonDetail[key], { isCheckout: false });
        }
        // const courseCheckout = Object.keys(checkoutData);
        // const myJsonString = JSON.stringify(checkoutData);
        // if (checkoutData.find({ isCourseChecout: true })) {
        // } else {
        //   Object.assign(lessonDetail[key], { isCheckout: false });
        // }

        // Object.assign(lessonDetail[key], { isCheckout: true });
      }
    });
    const date = new Date();
    const newDate = moment(date)
      .tz("America/Chicago")
      .format();
    const currentDate = moment(newDate)
      .tz("America/Chicago")
      .format("ll");
    const scheduleDetail = await courseSchedule
      .find({ courseId: courseDetail._id })
      .populate("teacherId")
      .populate({ path: "courseId", populate: "category" });

    const courseCheckout = await Billing.findOne({
      studentId: data.studentId,
      courseId: courseDetail.id,
    });

    // const checkoutTrue = await courseCheckout.isCourseChecout;
    // console.log("checkoutTrue", checkoutTrue);

    // if (checkoutTrue === true) {
    //   scheduleDetail.isCheckout = true;
    //   Object.assign(scheduleDetail, { isCheckout: true });
    //   // scheduleDetail.push({ isCheckout: true });
    // }

  
    res.status(200).json({
      status: 200,
      message: "Course Detail List",
      data: {
        courseDetail,
        lessonDetail,
        scheduleDetail,
        favourite,
        courseCheckout,
      },
    });
  } catch (error) {
    next(error);
  }
}
