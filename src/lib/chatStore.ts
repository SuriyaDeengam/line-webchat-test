export type ChatMessage = {
  type: "user" | "oa";
  text: string;
  timestamp: number;
};

let messages: ChatMessage[] = [];

export const addMessage = (msg: ChatMessage) => {
  messages.push(msg);
};

export const getMessages = () => {
  return messages;
};
