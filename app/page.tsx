// app/page.tsx or app/chat/page.tsx (Next.js app directory structure)
"use client";

import { useState, useRef } from "react";
import ChatHeader from "@/components/ChatHeader";
import ChatInput from "@/components/ChatInput";
import ChatMessages from "@/components/ChatMessages";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  type Message = { role: string; content: string };
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

  const { data } = useSWR("http://localhost:11434/api/tags", fetcher);

  type Model = { name: string };
  const models =
    data?.models?.map((m: Model) => ({ id: m.name, name: m.name })) || [];

  if (!selectedModel && models.length > 0) {
    setSelectedModel(models[0].id);
  }

const handleSend = async () => {
  if (!input.trim() || !selectedModel) return;
  const userMessage = { role: "user", content: input };
  setMessages((prev) => [...prev, userMessage]);
  setInput("");

  try {
    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: selectedModel,
        messages: [...messages, userMessage],
        stream: true,
      }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    let fullContent = "";

    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Process line by line
      const lines = buffer.split("\n");
      buffer = lines.pop() || ""; // Save any incomplete line

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const parsed = JSON.parse(line);
          const delta = parsed.message?.content || "";
          fullContent += delta;

          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1].content = fullContent;
            return updated;
          });
        } catch (e) {
          console.warn("Failed to parse stream chunk:", line, e);
        }
      }
    }
  } catch (error) {
    console.error("Streaming error:", error);
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "Error: Could not get response" },
    ]);
  }
};


  return (
    <div className="flex flex-col h-screen bg-gray-100 max-w-full">
      <div className="flex flex-col flex-1 w-full mx-auto shadow-lg bg-white rounded-lg my-0 md:my-6 md:mb-8 md:mt-6 p-2 sm:p-4 md:p-6 lg:p-8">
        <ChatHeader
          models={models}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
        />
        <div className="flex-1 overflow-y-auto">
          <ChatMessages messages={messages} messagesEndRef={messagesEndRef} />
        </div>
        <div className="mt-2">
          <ChatInput
            input={input}
            setInput={setInput}
            handleSend={handleSend}
          />
        </div>
      </div>
    </div>
  );
}
