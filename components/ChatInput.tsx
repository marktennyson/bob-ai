"use client";

import { Send } from "lucide-react";

interface Props {
  input: string;
  setInput: (val: string) => void;
  handleSend: () => void;
}

export default function ChatInput({ input, setInput, handleSend }: Props) {
  return (
    <div className="p-2 sm:p-4 bg-white border-t">
      <div className="flex gap-2 max-w-full sm:max-w-2xl md:max-w-3xl mx-auto">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your message..."
          className="flex-1 p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
        />
        <button
          onClick={handleSend}
          className="p-2 sm:p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
