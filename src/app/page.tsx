"use client";

import { useEffect, useRef, useState } from "react";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ======================
  // Fetch Users
  // ======================
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();

      setUsers((prev) => {
        // อัปเดตเฉพาะเมื่อจำนวนเปลี่ยน
        if (prev.length !== data.length) {
          return data;
        }
        return prev;
      });

      // set default user แค่ครั้งแรกจริง ๆ
      if (!selectedUser && data.length > 0) {
        setSelectedUser(data[0]);
      }
    } catch (err) {
      console.error("Fetch users error:", err);
    }
  };

  // ======================
  // Fetch Messages
  // ======================
  const fetchMessages = async (userId: string) => {
    try {
      const res = await fetch(`/api/messages?userId=${userId}`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Fetch messages error:", err);
    }
  };

  // ======================
  // Send Message
  // ======================
  const sendMessage = async () => {
    if (!input.trim() || !selectedUser) return;

    try {
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
    } catch (err) {
      console.error("Send error:", err);
    }
  };

  // ======================
  // Load users (poll every 5 sec)
  // ======================
  useEffect(() => {
    fetchUsers();

    const interval = setInterval(() => {
      fetchUsers();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // ======================
  // Poll messages when selectedUser changes
  // ======================
  useEffect(() => {
    if (!selectedUser) return;

    fetchMessages(selectedUser);

    const interval = setInterval(() => {
      fetchMessages(selectedUser);
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedUser]);

  // ======================
  // Auto scroll
  // ======================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-white border-r p-4 overflow-y-auto">
        <h2 className="text-lg text-black font-bold mb-4">Users</h2>

        {users.length === 0 && (
          <p className="text-gray-400 text-sm">No users yet</p>
        )}

        {users.map((user) => (
          <div
            key={user}
            onClick={() => setSelectedUser(user)}
            className={`p-2 mb-2 rounded cursor-pointer text-sm break-all transition ${
              selectedUser === user
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {user}
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col p-6">
        <h1 className="text-xl text-black font-bold mb-4">
          {selectedUser
            ? `Chat with ${selectedUser}`
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
              placeholder="Type a message..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
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
