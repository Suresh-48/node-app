import mongoose from "mongoose";
const { Schema, model } = mongoose;

const upcomingScheduleSchema = new Schema({
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Parent",
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  courseScheduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "courseSchedule",
  },
  courseLessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "courseLesson",
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },
  lessonDate: {
    type: String,
  },
  lessonEndTime: {
    type: String,
  },
  timeStamp: {
    type: Date,
  },
  start:{
    type:Date
  },
  end:{
    type:Date
  },
  title:{
    type:String
  },
  zoomStartTime:{
    type:String
  },
  zoomEndTime:{
    type:String
  }
});

upcomingScheduleSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

upcomingScheduleSchema.set("autoIndex", true);

const upcomingSchedule = model("UpcomingSchedule", upcomingScheduleSchema);

export default upcomingSchedule;
