"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
  type: "user" | "oa";
  text: string;
  timestamp: number;
};

type User = {
  userId: string;
  displayName: string;
  pictureUrl?: string;
};

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();

    setUsers(data);

    setSelectedUser((prev) => {
      if (!data.length) return null;
      if (!prev) return data[0];

      const stillExists = data.find((u: User) => u.userId === prev.userId);
      return stillExists || data[0];
    });
  };

  const fetchMessages = async (userId: string) => {
    const res = await fetch(`/api/messages?userId=${userId}`);
    const data = await res.json();
    
    setMessages(data);
  };

  const sendMessage = async () => {
    if (!input.trim() || !selectedUser) return;

    await fetch("/api/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: input,
        userId: selectedUser.userId,
      }),
    });

    setInput("");
    fetchMessages(selectedUser.userId);
  };

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!selectedUser) return;

    fetchMessages(selectedUser.userId);

    const interval = setInterval(() => {
      fetchMessages(selectedUser.userId);
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/4 bg-white border-r p-4 overflow-y-auto">
        <h2 className="text-lg text-black font-bold mb-4">Users</h2>

        {users.map((user) => (
          <div
            key={user.userId}
            onClick={() => setSelectedUser(user)}
            className={`flex items-center gap-3 p-2 mb-2 rounded cursor-pointer transition ${
              selectedUser?.userId === user.userId
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {user.pictureUrl && (
              <img
                src={user.pictureUrl}
                className="w-8 h-8 rounded-full"
              />
            )}
            <span className="text-sm">{user.displayName}</span>
          </div>
        ))}
      </div>

      <div className="flex-1 flex flex-col p-6">
        <h1 className="text-xl text-black font-bold mb-4">
          {selectedUser
            ? `Chat with ${selectedUser.displayName}`
            : "Select a user"}
        </h1>

        <div className="flex-1 bg-white p-4 rounded shadow overflow-y-auto mb-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 ${
                msg.type === "user" ? "text-right" : "text-left"
              }`}
            >
              <span
                className={`inline-block px-4 py-2 rounded-lg ${
                  msg.type === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                {msg.text}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {selectedUser && (
          <div className="flex">
            <input
              className="flex-1 text-black border p-2 rounded-l"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white px-6 rounded-r"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
