import { v4 } from "uuid";
import { writeDB } from "../dbController.js";

const setMsgs = (data) => writeDB("messages", data);

const messageResolver = {
  Query: {
    messages: (parent, args, { models }) => {
      console.log(parent, args);
      return models.messages;
    },
    message: (parent, { id = "" }, { models }) => {
      return models.messages.find((msg) => msg.id === id);
    },
  },
  Mutation: {
    createMessages: (parent, { text, userId }, { models }) => {
      const newMsg = {
        id: v4(),
        text,
        userId,
        timestamp: Date.now(),
      };
      models.messages.unshift(newMsg);
      setMsgs(models.messages);
      return newMsg;
    },
    updateMessages: (parent, { id, text, userId }, { models }) => {
      const targetIndex = models.messages.findIndex((msg) => msg.id === id);
      if (targetIndex < 0) {
        throw new Error("메시지가 없습니다.");
      }
      if (models.messages[targetIndex].userId !== userId) {
        throw new Error("사용자가 다릅니다.");
      }

      const newMsg = { ...models.messages[targetIndex], text };
      models.messages.splice(targetIndex, 1, newMsg);
      setMsgs(models.messages);
      return newMsg;
    },
    deleteMessages: (parent, { id, userId }, { models }) => {
      const targetIndex = models.messages.findIndex((msg) => msg.id === id);
      if (targetIndex < 0) {
        throw new Error("메시지가 없습니다.");
      }
      if (models.messages[targetIndex].userId !== userId) {
        throw new Error("사용자가 다릅니다.");
      }

      models.messages.splice(targetIndex, 1);
      setMsgs(models.messages);
      return id;
    },
  },
};

export default messageResolver;
