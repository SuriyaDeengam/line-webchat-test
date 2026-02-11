export type ChatMessage = {
  type: "user" | "oa";
  text: string;
  timestamp: number;
};

export type ChatRoom = {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  messages: ChatMessage[];
};

type ChatRooms = {
  [userId: string]: ChatRoom;
};

let rooms: ChatRooms = {};

export const addUserIfNotExists = (
  userId: string,
  displayName: string,
  pictureUrl?: string
) => {
  if (!rooms[userId]) {
    rooms[userId] = {
      userId,
      displayName,
      pictureUrl,
      messages: [],
    };
  }
};

export const addMessage = (
  userId: string,
  msg: ChatMessage
) => {
  if (!rooms[userId]) return;
  rooms[userId].messages.push(msg);
};

export const getMessages = (userId: string) => {
  return rooms[userId]?.messages || [];
};

export const getAllUsers = () => {
  return Object.values(rooms);
};
