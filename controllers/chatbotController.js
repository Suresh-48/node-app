import chatbot from "../models/chatbotModel.js";
import chatBotConversation from "../models/chatBotConversation.js";

export async function createChatQuestion(req, res, next) {
  try {
    const data = req.body;
    const createData = await chatbot.create({ question: data.question, answer: data.answer });
    res.status(200).json({
      message: "Chatbot questions and answers  created successfuly",
      createData,
    });
  } catch (error) {
    next(error);
  }
}

export async function getChatAnswer(req, res, next) {
  try {
    const data = req.body;

    const createQuestionData = await chatBotConversation.create({ userQuestion: data.question });

    const reg = new RegExp(".*" + data.question + ".*", "i");

    const query = { question: { $regex: reg } };

    const answerData = await chatbot.find(query);

    if (answerData.length > 0) {
      res.status(200).json({
        message: "Get answers successfuly",
        answerData,
      });
    } else {
      res.status(204).json({
        message: "Irrelevent Answer",
      });
    }
  } catch (error) {
    next(error);
  }
}
