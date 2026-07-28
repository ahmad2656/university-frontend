import API from "./axiosConfig";

export const sendChatMessage = (messages, role, context) =>
  API.post("/ai/chat", { messages, role, context });