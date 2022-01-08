import mongoose from "mongoose";
const { Schema, model } = mongoose;

const courseLessonSchema = new Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  lessonName: {
    type: String,
    required: [false, "Please fill Lesson Name"],
  },
  description: {
    type: String,
    required: [false, "Please fill description"],
  },
  duration: {
    type: String,
    required: [false, "Please fill your duration"],
  },
  lessonNumber: {
    type: String,
    required: [false, "Please fill your lesson number"],
  },
  quizQuestions: {
    type: JSON,
  },
  quizQuestions: {
    type: JSON,
  },
  homeworkQuestions: {
    type: JSON,
  },
});

courseLessonSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

courseLessonSchema.set("autoIndex", true);

const courseLesson = model("courseLesson", courseLessonSchema);

export default courseLesson;
