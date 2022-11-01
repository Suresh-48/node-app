import mongoose from "mongoose";
const { connect } = mongoose;

import { config } from "dotenv";

config({
  path: "./.env",
});

import http from "http";
import * as SocketIO from "socket.io";
import app from "./app.js";
import { getPublicImagUrl, uploadBase64File } from "./utils/s3.js";
import Chat from "./models/chatModel.js";

const server = new http.createServer(app);

const inputOutput = new SocketIO.Server(server);

inputOutput.on("connection", (socket) => {
  socket.on("chat message", async (message) => {
    if (message.imageUrl) {
      const file = message.imageUrl;
      const chat_PATH = "media/chat";
      const type = file && file.split(";")[0].split("/")[1];
      const random = new Date().getTime();
      const fileName = `${message.senderId}-${random}.${type}`;
      const filePath = `${chat_PATH}/${fileName}`;

      uploadBase64File(file, filePath, (err, mediaPath) => {
        if (err) {
          return callback(err);
        }
        Chat.create({
          senderId: message.senderId,
          receiverId: message.receiverId,
          createdAt: message.createdAt,
          imageUrl: getPublicImagUrl(mediaPath),
          user: message.user,
          sent: true,
          received: false,
        });
      });
    } else {
      const createChat = await Chat.create({
        senderId: message.senderId,
        receiverId: message.receiverId,
        createdAt: message.createdAt,
        text: message.text,
        user: message.user,
        sent: true,
        received: false,
      });
    }
    //Create Chat Message

    const senderId = message.senderId;
    const receiverId = message.receiverId;

    // Update Chat

    const updateChat = await Chat.updateMany(
      {
        senderId: receiverId,
        receiverId: senderId,
        received: false,
      },
      {
        $set: { received: true },
      }
    );

    const getChat = await Chat.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });

    inputOutput.emit("chat message", getChat, senderId, receiverId);
  });

  // Chat Message List

  socket.on("message list", async (data) => {
    const senderId = data.senderId;
    const receiverId = data.receiverId;

    const updateChat = await Chat.updateMany(
      {
        senderId: receiverId,
        receiverId: senderId,
        received: false,
      },
      {
        $set: { received: true },
      }
    );

    //get chat message list

    const chatList = await Chat.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });

    //send message list to front end
    inputOutput.emit("message list", chatList, senderId, receiverId);
  });

  // delete message
  socket.on("delete message", async (messageId, senderId, receiverId) => {
    const deleteMessage = await Chat.findByIdAndDelete({ _id: messageId });

    const chatMessageList = await Chat.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });

    // sent message list after deleted to front end
    inputOutput.emit("delete message", chatMessageList, senderId, receiverId);
  });

  // disconect socket
  socket.on("disconnect", function () {
    console.log(socket.id + "has disconnected from the chat." + socket.id);
  });
});

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION!!! shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

const database = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

// Connect the database
connect(database, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then((con) => {
  console.log("DB connection Successfully!");
});

// Start the server
const port = process.env.PORT || 5004;
server.listen(port, () => {
  console.log(`Application is running on port ${port}`);
});

// Close the Server
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION!!!  shutting down ...");
  console.log(err.name, err.message);
  // server.close(() => {
  //   process.exit(1);
  // });
});
