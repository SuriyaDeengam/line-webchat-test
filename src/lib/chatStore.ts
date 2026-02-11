export type ChatMessage = {
  type: "user" | "oa";
  text: string;
  timestamp: number;
};

type ChatRooms = {
  [userId: string]: ChatMessage[];
};

let rooms: ChatRooms = {};

export const addMessage = (
  userId: string,
  msg: ChatMessage
) => {
  if (!rooms[userId]) {
    rooms[userId] = [];
  }
  rooms[userId].push(msg);
};

export const getMessages = (userId: string) => {
  return rooms[userId] || [];
};

export const getAllUsers = () => {
  return Object.keys(rooms);
};
