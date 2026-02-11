"use client";

import { useEffect, useState } from "react";

type Message = {
  type: "user" | "oa";
  text: string;
  timestamp: number;
};

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = async () => {
    if (!message) return;

    await fetch("/api/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    setMessage("");
    fetchMessages();
  };

  const fetchMessages = async () => {
    const res = await fetch("/api/messages");
    const data = await res.json();
    setMessages(data);
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="flex flex-col h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">LINE Webchat</h1>

      <div className="flex-1 bg-white p-4 rounded overflow-y-auto mb-4 shadow">
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
                  : "bg-gray-300"
              }`}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <div className="flex">
        <input
          className="flex-1 border p-2 rounded-l"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-6 rounded-r"
        >
          Send
        </button>
      </div>
    </main>
  );
}
