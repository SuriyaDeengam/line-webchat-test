"use client";

import { useEffect, useState } from "react";

type Message = {
  type: "user" | "oa";
  text: string;
  timestamp: number;
};

export default function Home() {
  const [users, setUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  // โหลดรายชื่อ user
  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);

    if (!selectedUser && data.length > 0) {
      setSelectedUser(data[0]);
    }
  };

  // โหลดข้อความตาม userId
  const fetchMessages = async (userId: string) => {
    const res = await fetch(`/api/messages?userId=${userId}`);
    const data = await res.json();
    setMessages(data);
  };

  // ส่งข้อความ
  const sendMessage = async () => {
    if (!input || !selectedUser) return;

    await fetch("/api/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: input,
        userId: selectedUser,
      }),
    });

    setInput("");
    fetchMessages(selectedUser);
  };

  // polling
  useEffect(() => {
    fetchUsers();
    const interval = setInterval(() => {
      fetchUsers();
      if (selectedUser) fetchMessages(selectedUser);
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedUser]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-white border-r p-4">
        <h2 className="text-lg text-black font-bold mb-4">Users</h2>

        {users.length === 0 && (
          <p className="text-black text-sm">No users yet</p>
        )}

        {users.map((user) => (
          <div
            key={user}
            onClick={() => setSelectedUser(user)}
            className={`p-2 mb-2 rounded cursor-pointer text-sm break-all ${selectedUser === user
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
              }`}
          >
            {user}
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col p-6">
        <h1 className="text-xl text-black font-bold mb-4 ">
          {selectedUser
            ? `Chat with ${selectedUser}`
            : "Select a user"}
        </h1>

        <div className="flex-1 bg-white p-4 rounded shadow overflow-y-auto mb-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 ${msg.type === "user" ? "text-right" : "text-left"
                }`}
            >
              <span
                className={`inline-block text-black px-4 py-2 rounded-lg ${msg.type === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300"
                  }`}
              >
                {msg.text}
              </span>
            </div>
          ))}
        </div>

        {selectedUser && (
          <div className="flex">
            <input
              className="flex-1 text-black  border p-2 rounded-l"
              value={input}
              onChange={(e) => setInput(e.target.value)}
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
