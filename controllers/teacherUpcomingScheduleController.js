import teacherUpcomingSchedule from "../models/teacherUpcomingScheduleModels.js";
import courseLesson from "../models/courseLessonModel.js";
import courseSchedule from "../models/courseScheduleModel.js";
import moment from "moment-timezone";
import "moment-timezone";

moment.suppressDeprecationWarnings = true;

import teacher from "../models/teacherModel.js";
import teacherAvailability from "../models/teacherAvailabilityModel.js";
import teacherPayment from "../models/teacherPaymentModel.js";
import Teacher from "../models/teacherModel.js";
import sendMail from "../utils/sendMail.js";

const { FROM_EMAIL, FROM_EMAIL_DISPLAY_NAME } = process.env;

export async function getTeacherUpcomingSchedule(req, res, next) {
  try {
    const teacherId = req.query.teacherId;
    const date = new Date();
    const newDate = moment(date).tz("America/Chicago").format();
    const currentDate = moment(newDate).tz("America/Chicago").format("ll");
    const currentTime = moment(newDate).tz("America/Chicago").format("HH:mm");
    const currentTimeAndDate = moment(currentDate + " " + currentTime);
    const upcomingCalendarList = await teacherAvailability
      .find({
        teacherId: teacherId,
        start: { $gte: currentTimeAndDate },
        status:"CourseSchedule"
      })
      .populate("courseScheduleId")
      .populate("courseLessonId")
      .populate("teacherId")
      .sort({ start: 1 });

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
      .sort({ lessonDate: 1, lessonEndTime: 1 });

    res.status(200).json({
      length: upcomingList.length,
      message: "List Of Upcoming Courses",
      upcomingList,
      upcomingCalendarList
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
    const currentTimeAndDate = moment(currentDate + " " + currentTime);

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

    const upcomingCalendarList = await teacherAvailability
      .find({
        teacherId: teacherId,
        courseScheduleId: scheduleId,
        start: { $gt: currentTimeAndDate },
        status: "CourseSchedule",
      })
      .populate("courseScheduleId")
      .populate("teacherId")
      .sort({ start: 1 });

    res.status(200).json({
      length: upcomingList.length,
      message: "List Of Upcoming Courses",
      upcomingList,
      upcomingCalendarList,
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
    const currentTimeAndDate = moment(currentDate + " " + currentTime);

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

    const upcomingCalendarList = await teacherAvailability
      .find({
        start: { $gt: currentTimeAndDate },
        status: "CourseSchedule",
      })
      .populate("courseScheduleId")
      .populate("teacherId")
      .sort({ start: 1 });

    res.status(200).json({
      length: upcomingList.length,
      message: "List Of Upcoming Courses",
      upcomingList,
      upcomingCalendarList,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateTeacherZoomTimings(req, res, next) {
  try {
    const data = req.body;
    const scheduleDetail = await teacherUpcomingSchedule.find({
      _id: data.teacherUpcomingScheduleId,
    });
    if (scheduleDetail.length > 0) {
      const editData = {
        zoomStartTime: data.zoomStartTime,
        zoomEndTime: data.zoomEndTime,
      };
      const zoomDetails = await teacherUpcomingSchedule.findByIdAndUpdate(data.teacherUpcomingScheduleId, editData, {
        new: true,
        runValidators: true,
      });
      res.status(201).json({
        message: "Succes",
        zoomDetails,
      });
    } else {
      res.status(403).json({
        message: "No Record Found",
      });
    }
    if (data.zoomEndTime.length > 0) {
      const teacherPaymentDetail = await teacherPayment.create({
        teacherId: data.teacherId,
        zoomStartTime: data.zoomStartTime,
        zoomEndTime: data.zoomEndTime,
        courseName: data.courseName,
        lessonName: data.lessonName,
        teacherPayableAmount: data.teacherPayableAmount,
        date: data.date,
      });
      res.status(201).json({
        message: "success",
        teacherPaymentDetail,
      });
    } else {
      res.status(403).json({
        message: "No Teacher Payments",
      });
    }
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
      const upcomingList = await teacherUpcomingSchedule.findByIdAndUpdate(
        data.teacherScheduleId,
        {
          teacherId: data.teacherId,
        }
      );
      const updateTeacherAvailability =
        await teacherAvailability.findByIdAndUpdate(
          teacherAvailabilityDetail._id,
          { teacherId: data.teacherId }
        );
      const teacherData = await Teacher.findOne({ _id : data.teacherId });

      // Email Notifications start
      const teacherUpdate = {
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
        // studentName: `${data.firstName} ${data.lastName}`,
      };

      const teacherUpdateData = {
        // to: FROM_EMAIL,
        to: teacherData.email,
        from: FROM_EMAIL,
        subject: "Teacher Update",
        template: "TeacherUpdate",
        substitutions: teacherUpdate,
      };
      res.status(201).json({
        length: upcomingList.length,
        message: "List Of Upcoming Courses",
        upcomingList,
        updateTeacherAvailability,
      });
      res.on("finish", () => {
        // To send a Email Notifications
        sendMail(teacherUpdateData, () => {});
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
    const existData = await teacherUpcomingSchedule
      .find({
        courseScheduleId: data.courseScheduleId,
      })
      .sort({ timeStamp: 1 })
      .populate("courseId")
      .populate("courseScheduleId")
      .populate("courseLessonId");

    const lessonDate = scheduleDetail.startDate;

    const lessonEndTime = moment(scheduleDetail.endTime, "LT").format("HH:mm");
    if (existData.length === 0) {
      const lessonList = await courseLesson
        .find({ courseId: scheduleDetail.courseId })
        .populate("courseId")
        .sort({ lessonNumber: 1 });

      lessonList.forEach(async (res, i) => {
        const newDate = moment(lessonDate, "ll").add(7 * i, "days");

        const timeStamp = moment(newDate).format("LLLL");
        const edit = moment(newDate).format("ll");
        const courseStartTime = moment(scheduleDetail.startTime, "LT").format("HH:mm");
        const courseEndTime = moment(scheduleDetail.endTime, "LT").format("HH:mm");
        const newCourseStartTime = moment(edit + " " + courseStartTime).format();
        const newCourseEndTime = moment(edit + " " + courseEndTime).format();
        const title = `${res.courseId.name} - ${res.lessonName} (${scheduleDetail.startTime} to ${scheduleDetail.endTime} )`;
        const exist = await teacherUpcomingSchedule.find({
          courseId: scheduleDetail.courseId,
          courseScheduleId: data.courseScheduleId,
          courseLessonId: res.id,
          teacherId: data.teacherId,
        });

        const nonAvailabilityTiming = await teacherAvailability.find({
          status: "Availability",
          teacherId: data.teacherId,
          $or: [
            {
              $and: [{ start: { $lte: newCourseStartTime } }, { end: { $gte: newCourseStartTime } }],
            },
            {
              $and: [{ start: { $lte: newCourseEndTime } }, { end: { $gte: newCourseEndTime } }],
            },
            {
              $and: [{ start: { $gte: newCourseStartTime } }, { end: { $lte: newCourseEndTime } }],
            },
          ],
        });

        if (nonAvailabilityTiming.length === 0) {
          exist.length === 0 &&
            (await teacherUpcomingSchedule.create({
              courseId: scheduleDetail.courseId,
              courseScheduleId: data.courseScheduleId,
              courseLessonId: res.id,
              teacherId: data.teacherId,
              lessonDate: edit,
              lessonEndTime: lessonEndTime,
              timeStamp: timeStamp,
            }),
            await teacherAvailability.create({
              teacherId: data.teacherId,
              courseScheduleId: data.courseScheduleId,
              startTime: scheduleDetail.startTime,
              endTime: scheduleDetail.endTime,
              courseLessonId: res.id,
              start: newCourseStartTime,
              end: newCourseEndTime,
              title: title,
              status: "CourseSchedule",
            }));
        } else {
          exist.length === 0 &&
            (await teacherUpcomingSchedule.create({
              courseId: scheduleDetail.courseId,
              courseScheduleId: data.courseScheduleId,
              courseLessonId: res.id,
              lessonDate: edit,
              lessonEndTime: lessonEndTime,
              timeStamp: timeStamp,
            }),
            await teacherAvailability.create({
              courseScheduleId: data.courseScheduleId,
              startTime: scheduleDetail.startTime,
              endTime: scheduleDetail.endTime,
              courseLessonId: res.id,
              start: newCourseStartTime,
              end: newCourseEndTime,
              title: title,
              status: "CourseSchedule",
            }));
        }
      });

      res.status(201).json({
        message: "Upcoming Schedule For Teacher Created Successfully",
      });
    } else {
      existData.forEach(async (list, i) => {
        const newDate = moment(lessonDate, "ll").add(7 * i, "days");

        const timeStamp = moment(newDate).format("LLLL");
        const edit = moment(newDate).format("ll");
        const courseStartTime = moment(scheduleDetail.startTime, "LT").format("HH:mm");
        const courseEndTime = moment(scheduleDetail.endTime, "LT").format("HH:mm");
        const title = `${list.courseId.name} - ${list.courseLessonId.lessonName} (${scheduleDetail.startTime} to ${scheduleDetail.endTime} )`;

        const newCourseStartTime = moment(edit + " " + courseStartTime).format();
        const newCourseEndTime = moment(edit + " " + courseEndTime).format();
        const findTeacherAvailability = await teacherAvailability
          .find({
            courseScheduleId: data.courseScheduleId,
            status: "CourseSchedule",
          })
          .sort({ start: 1 });

        const nonAvailabilityTiming = await teacherAvailability.find({
          status: "Availability",
          teacherId: data.teacherId,
          $or: [
            {
              $and: [{ start: { $lte: newCourseStartTime } }, { end: { $gte: newCourseStartTime } }],
            },
            {
              $and: [{ start: { $lte: newCourseEndTime } }, { end: { $gte: newCourseEndTime } }],
            },
            {
              $and: [{ start: { $gte: newCourseStartTime } }, { end: { $lte: newCourseEndTime } }],
            },
          ],
        });
        if (nonAvailabilityTiming.length === 0) {
          await teacherUpcomingSchedule.findByIdAndUpdate(list._id, {
            teacherId: data.teacherId,
            lessonDate: edit,
            lessonEndTime: lessonEndTime,
            timeStamp: timeStamp,
          });

          await teacherAvailability.findByIdAndUpdate(findTeacherAvailability[i]._id, {
            teacherId: data.teacherId,
            start: newCourseStartTime,
            end: newCourseEndTime,
            startTime: scheduleDetail.startTime,
            endTime: scheduleDetail.endTime,
            title: title,
          });
        } else {
          await teacherUpcomingSchedule.findByIdAndUpdate(list._id, {
            lessonDate: edit,
            lessonEndTime: lessonEndTime,
            timeStamp: timeStamp,
            teacherId: null,
          });

          await teacherAvailability.findByIdAndUpdate(findTeacherAvailability[i]._id, {
            start: newCourseStartTime,
            end: newCourseEndTime,
            startTime: scheduleDetail.startTime,
            endTime: scheduleDetail.endTime,
            title: title,
            teacherId: null,
          });
        }
      });
    }
  } catch (error) {
    next(error);
  }
}
