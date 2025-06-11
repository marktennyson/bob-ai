"use client";

import { useEffect } from "react";

interface Message {
  role: string;
  content: string;
}

interface Props {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export default function ChatMessages({ messages, messagesEndRef }: Props) {
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, messagesEndRef]);

  return (
    <div className="flex-1 overflow-y-auto p-2 sm:p-4 md:p-6 bg-gray-50">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`mb-2 sm:mb-3 md:mb-4 flex ${
            msg.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <span
            className={`max-w-[80vw] sm:max-w-lg md:max-w-xl px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow text-sm sm:text-base whitespace-pre-wrap break-words ${
              msg.role === "user"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-800"
            }`}
          >
            {msg.content}
          </span>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
