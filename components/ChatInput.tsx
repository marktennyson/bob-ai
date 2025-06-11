"use client";

import { Send, Square } from "lucide-react"; // Add Square for stop icon
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  input: string;
  setInput: (val: string) => void;
  handleSend: () => void;
  isPrinting?: boolean; // Add this prop to control icon
  handleStop?: () => void; // Optional: handler for stop
}

export default function ChatInput({
  input,
  setInput,
  handleSend,
  isPrinting = false,
  handleStop,
}: Props) {
  return (
    <div className="p-2 sm:p-4 bg-gradient-to-t from-white via-white/80 to-transparent border-t">
      <div className="relative max-w-full sm:max-w-2xl md:max-w-3xl mx-auto">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !isPrinting) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type your message..."
          className="flex-1 resize-none min-h-[48px] max-h-40 pr-12 rounded-2xl border border-gray-200 bg-white shadow focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition text-base"
          rows={1}
          disabled={isPrinting}
        />
        <Button
          onClick={isPrinting ? handleStop : handleSend}
          size="icon"
          disabled={isPrinting ? false : !input.trim()}
          type="button"
          className={`absolute bottom-2 right-2 rounded-full shadow-md transition ${
            isPrinting
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
          aria-label={isPrinting ? "Stop generating" : "Send message"}
        >
          {isPrinting ? <Square size={20} /> : <Send size={20} />}
        </Button>
      </div>
    </div>
  );
}
