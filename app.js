import express, { json } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import cors from "cors";
import globalErrHandler from "./controllers/errorController.js";
//ngrok.exe http -host-header=rewrite localhost:5000
// Routes

import courseRoutes from "./routes/courseRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import parentRoutes from "./routes/parentRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import userRoutes from "./routes/userRouter.js";
import billingRoutes from "./routes/billingRoutes.js";
import courseScheduleRoutes from "./routes/courseScheduleRoutes.js";
import courseLessonRoutes from "./routes/courseLessonRoutes.js";
import adminDashboardRoutes from "./routes/adminDashboardRoutes.js";
import parentDashboardRoutes from "./routes/parentDashboardRoutes.js";
import studentDashboardRoutes from "./routes/studentDashboardRoutes.js";
import teacherDashboardRoutes from "./routes/teacherDashboardRoutes.js";
import studentCourseRoutes from "./routes/studentCourseRoutes.js";
import studentUpcomingCourse from "./routes/upcomingScheduleRoutes.js";
import teacherUpcomingScheduleRoutes from "./routes/teacherUpcomingScheduleRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import quizScheduleRoutes from "./routes/quizScheduleRoutes.js";
import lessonQuizRoutes from "./routes/lessonQuizRoutes.js";
import lessonHomeworkRoutes from "./routes/lessonHomeWorkRoutes.js";
import homeworkRoutes from "./routes/homeworkRoutes.js";
import homeworkScheduleRoutes from "./routes/homeworkScheduleRoutes.js";
import teacherAvailabilityRoutes from "./routes/teacherAvailabilityRoutes.js";
import teacherApplicationRoutes from "./routes/teacherApplicationRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import AppError from "./utils/appError.js";
import chatBotRoutes from "./routes/chatbotRoutes.js";
import favouriteCourseRoutes from "./routes/favouriteCourseRoutes.js";
import forumRoutes from "./routes/forumRoutes.js";
import forumConversationRoutes from "./routes/forumConversationRoutes.js";


const app = express();

// Allow Cross-Origin requests
app.use(cors());

// Set security HTTP headers
app.use(helmet());

// Limit request from the same API
const limiter = rateLimit({
  max: 150000,
  windowMs: 60 * 60 * 1000,
  message: "Too Many Request from this IP, please try again in an hour",
});

app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(
  json({
    limit: "25MB",
  })
);
// Data sanitization against No sql query injection
app.use(mongoSanitize());

app.use("/api/v1/user", userRoutes);
// Data sanitization against XSS(clean user input from malicious HTML code)
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

app.use("/api/v1/course", courseRoutes);

app.use("/api/v1/category", categoryRoutes);

app.use("/api/v1/parent", parentRoutes);

app.use("/api/v1/student", studentRoutes);

app.use("/api/v1/billing", billingRoutes);

app.use("/api/v1/courseSchedule", courseScheduleRoutes);

app.use("/api/v1/courseLesson", courseLessonRoutes);

app.use("/api/v1/dashboard/admin", adminDashboardRoutes);

app.use("/api/v1/dashboard/parent", parentDashboardRoutes);

app.use("/api/v1/dashboard/student", studentDashboardRoutes);

app.use("/api/v1/dashboard/teacher", teacherDashboardRoutes);

app.use("/api/v1/studentcourse", studentCourseRoutes);

app.use("/api/v1/upcomingcourse", studentUpcomingCourse);

app.use("/api/v1/teacher", teacherRoutes);

app.use("/api/v1/teacherUpcomingSchedule", teacherUpcomingScheduleRoutes);

app.use("/api/v1/lessonQuiz", lessonQuizRoutes);

app.use("/api/v1/lessonHomework", lessonHomeworkRoutes);

app.use("/api/v1/quizSchedule", quizScheduleRoutes);

app.use("/api/v1/homework", homeworkRoutes);

app.use("/api/v1/quiz", quizRoutes);

app.use("/api/v1/homeworkSchedule", homeworkScheduleRoutes);

app.use("/api/v1/teacherAvailability", teacherAvailabilityRoutes);

app.use("/api/v1/teacherApplication", teacherApplicationRoutes);


app.use("/api/v1/chat", chatRoutes);

app.use("/api/v1/chatbot", chatBotRoutes);

app.use("/api/v1/forum", forumRoutes);

app.use("/api/v1/forum/conversation", forumConversationRoutes);

app.use("/api/v1/favouriteCourse", favouriteCourseRoutes);


// handle undefined Routes
app.use("*", (req, res, next) => {
  const err = new AppError(404, "fail", "undefined route");
  next(err, req, res, next);
});

app.use(globalErrHandler);

export default app;
