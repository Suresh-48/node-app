import teacherUpcomingSchedule from "../models/teacherUpcomingScheduleModels.js";
import courseLesson from "../models/courseLessonModel.js";
import courseSchedule from "../models/courseScheduleModel.js";
import moment from "moment";
import teacher from "../models/teacherModel.js";

export async function getTeacherUpcomingSchedule(req, res, next) {
  try {
    const teacherId = req.query.teacherId;
    const date = new Date();
    const newDate = moment(date).tz("America/Chicago").format();
    const currentDate = moment(newDate).tz("America/Chicago").format("ll");
    const currentTime = moment(newDate).tz("America/Chicago").format("HH:mm");
    const upcomingList = await teacherUpcomingSchedule
      .find({
        teacherId: teacherId,
        $or: [
          {
            $and: [{ timeStamp: currentDate }, { lessonEndTime: { $gt: currentTime } }],
          },
          {
            timeStamp: { $gt: currentDate },
          },
        ],
      })
      .populate("courseId")
      .populate("courseScheduleId")
      .populate("courseLessonId")
      .populate("teacherId")
      .sort({lessonDate:1,lessonEndTime:1})

    res.status(200).json({
      length: upcomingList.length,
      message: "List Of Upcoming Courses",
      upcomingList,
    });
  } catch (error) {
    next(error);
  }
}

export async function getTeacherCompletedSchedule(req, res, next) {
  try {
    const teacherId = req.query.teacherId;
    const date = new Date();
    const newDate = moment(date).tz("America/Chicago").format();
    const currentDate = moment(newDate).tz("America/Chicago").format("ll");
    const currentTime = moment(newDate).tz("America/Chicago").format("HH:mm");

    const completedList = await teacherUpcomingSchedule
      .find({
        teacherId: teacherId,
        $or: [
          {
            $and: [{ timeStamp: currentDate }, { lessonEndTime: { $lte: currentTime } }],
          },
          {
            timeStamp: { $lt: currentDate },
          },
        ],
      })
      .populate("courseId")
      .populate("courseScheduleId")
      .populate("courseLessonId")
      .populate("teacherId");

    res.status(200).json({
      length: completedList.length,
      message: "List Of Completed Courses",
      completedList,
    });
  } catch (error) {
    next(error);
  }
}

export async function getTeacherUpcomingScheduleBasedonSchedule(req, res, next) {
  try {
    const teacherId = req.query.teacherId;
    const scheduleId = req.query.courseScheduleId;
    const date = new Date();
    const newDate = moment(date).tz("America/Chicago").format();
    const currentDate = moment(newDate).tz("America/Chicago").format("ll");
    const currentTime = moment(newDate).tz("America/Chicago").format("HH:mm");

    const upcomingList = await teacherUpcomingSchedule
      .find({
        teacherId: teacherId,
        courseScheduleId: scheduleId,
        $or: [
          {
            $and: [{ timeStamp: currentDate }, { lessonEndTime: { $gt: currentTime } }],
          },
          {
            timeStamp: { $gt: currentDate },
          },
        ],
      })
      .populate("courseId")
      .populate("courseScheduleId")
      .populate("courseLessonId")
      .populate("teacherId");

    res.status(200).json({
      length: upcomingList.length,
      message: "List Of Upcoming Courses",
      upcomingList,
    });
  } catch (error) {
    next(error);
  }
}

export async function getTeacherCompletedScheduleBasedonSchedule(req, res, next) {
  try {
    const teacherId = req.query.teacherId;
    const scheduleId = req.query.courseScheduleId;
    const date = new Date();
    const newDate = moment(date).tz("America/Chicago").format();
    const currentDate = moment(newDate).tz("America/Chicago").format("ll");
    const currentTime = moment(newDate).tz("America/Chicago").format("HH:mm");

    const completedList = await teacherUpcomingSchedule
      .find({
        teacherId: teacherId,
        courseScheduleId: scheduleId,
        $or: [
          {
            $and: [{ timeStamp: currentDate }, { lessonEndTime: { $lte: currentTime } }],
          },
          {
            timeStamp: { $lt: currentDate },
          },
        ],
      })
      .populate("courseId")
      .populate("courseScheduleId")
      .populate("courseLessonId")
      .populate("teacherId");

    res.status(200).json({
      length: completedList.length,
      message: "List Of Completed Courses",
      completedList,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllTeacherUpcomingSchedule(req, res, next) {
  try {
    const date = new Date();
    const newDate = moment(date).tz("America/Chicago").format();
    const currentDate = moment(newDate).tz("America/Chicago").format("ll");
    const currentTime = moment(newDate).tz("America/Chicago").format("HH:mm");

    const upcomingList = await teacherUpcomingSchedule
      .find({
        $or: [
          {
            $and: [{ timeStamp: currentDate }, { lessonEndTime: { $gt: currentTime } }],
          },
          {
            timeStamp: { $gt: currentDate },
          },
        ],
      })
      .populate("courseId")
      .populate("courseScheduleId")
      .populate("courseLessonId")
      .populate("teacherId");

    res.status(200).json({
      length: upcomingList.length,
      message: "List Of Upcoming Courses",
      upcomingList,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateTeacherInList(req, res, next) {
  try {
    const data = req.body;
    const scheduleDetail = await teacherUpcomingSchedule
      .findOne({ _id: data.teacherScheduleId })
      .populate("courseId")
      .populate("courseScheduleId")
      .populate("courseLessonId")
      .populate("teacherId");
    const startDate = scheduleDetail.lessonDate;
    const startTime = scheduleDetail.courseScheduleId.startTime;
    const endTime = scheduleDetail.courseScheduleId.endTime;

    const teacherSchedule = await teacherUpcomingSchedule
      .find({
        teacherId: data.teacherId,
        _id: { $nin: [data.teacherScheduleId] },
      })
      .populate("courseId")
      .populate("courseScheduleId")
      .populate("courseLessonId")
      .populate("teacherId");
    const existingSchedule = [];
    teacherSchedule.forEach(async (res) => {
      const getStartTime = res.courseScheduleId.startTime;
      const getEndTime = res.courseScheduleId.endTime;
      const clientStartTime = startTime;
      const clientEndTime = endTime;
      const getTime1 = moment(getStartTime, "hh:mm A").format("HH:mm");
      const getTime2 = moment(getEndTime, "hh:mm A").format("HH:mm");
      const clientTime1 = moment(clientStartTime, "hh:mm A").format("HH:mm");
      const clientTime2 = moment(clientEndTime, "hh:mm A").format("HH:mm");
      if (startDate === res.lessonDate) {
        if (
          (getTime1 > clientTime1 && clientTime1 < getTime2 && getTime1 < clientTime2 && clientTime2 < getTime2) ||
          (getTime1 < clientTime1 && clientTime1 <= getTime2) ||
          (getTime1 === clientTime1 && getTime2 === clientTime2)
        ) {
          existingSchedule.push(res._id);
        }
      }
    });
    if (existingSchedule.length === 0) {
      const upcomingList = await teacherUpcomingSchedule.findByIdAndUpdate(data.teacherScheduleId, {
        teacherId: data.teacherId,
      });

      res.status(201).json({
        length: upcomingList.length,
        message: "List Of Upcoming Courses",
        upcomingList,
      });
    } else {
      res.status(403).json({
        message: "Teacher Has Bean Already Scheduled For Another Course",
      });
    }
  } catch (error) {
    next(error);
  }
}

//Create Teacher schedule List
export async function teacherUpcomingList(req, res, next) {
  try {
    const data = req.body;
    const scheduleDetail = await courseSchedule.findOne({
      _id: data.courseScheduleId,
    });
    if (data.teacherId !== "null" || data.teacherId !== undefined) {
      const existData = await teacherUpcomingSchedule.find({
        courseScheduleId: data.courseScheduleId,
      });
      const lessonEndTime = moment(scheduleDetail.endTime, "LT").format("HH:mm");

      if (existData.length === 0) {
        const lessonList = await courseLesson.find({ courseId: scheduleDetail.courseId }).sort({ lessonNumber: 1 });

        const lessonDate = scheduleDetail.startDate;

        lessonList.forEach(async (res, i) => {
          const newDate = moment(lessonDate, "ll").add(7 * i, "days");

          const timeStamp = moment(newDate).format("LLLL");
          const edit = moment(newDate).format("ll");
          const exist = await teacherUpcomingSchedule.find({
            courseId: scheduleDetail.courseId,
            courseScheduleId: data.courseScheduleId,
            courseLessonId: res.id,
            teacherId: data.teacherId,
          });
          {
            exist.length === 0 &&
              (await teacherUpcomingSchedule.create({
                courseId: scheduleDetail.courseId,
                courseScheduleId: data.courseScheduleId,
                courseLessonId: res.id,
                teacherId: data.teacherId,
                lessonDate: edit,
                lessonEndTime: lessonEndTime,
                timeStamp: timeStamp,
              }));
          }
        });

        res.status(200).json({
          message: "Upcoming Schedule For Teacher Created Successfully",
        });
      } else {
        existData.forEach(async (list) => {
          const update = await teacherUpcomingSchedule.findByIdAndUpdate(list.id, { teacherId: data.teacherId });
        });

        res.status(201).json({
          message: "Upcoming Schedule For Teacher Updated",
        });
      }
    }
  } catch (error) {
    next(error);
  }
}
