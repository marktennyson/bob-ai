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
    <div className="flex-1 flex flex-col gap-4 py-4 overflow-y-auto">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex ${
            msg.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`relative max-w-[90vw] sm:max-w-2xl px-4 py-3 rounded-2xl text-base whitespace-pre-wrap break-words shadow-sm
              ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-background border border-border text-foreground rounded-bl-md"
              }
            `}
          >
            {msg.content}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
