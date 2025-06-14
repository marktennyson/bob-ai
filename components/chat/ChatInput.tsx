"use client";

import { Send, Square, Plus } from "lucide-react"; // Add Square for stop icon
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
    <div className="px-2 sm:px-4">
      <div className="relative mx-auto">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !isPrinting) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask anything."
          autoFocus
          className="flex-1 resize-none min-h-22 max-h-40 pr-12 rounded-2xl bg-white shadow transition text-base w-full backdrop-blur"
          rows={1}
          disabled={isPrinting}
        />
        {/* Plus button at bottom left */}
        <Button
          type="button"
          size="icon"
          // disabled
          className="absolute left-2 bottom-2 rounded-full transition bg-transparent hover:bg-muted cursor-pointer"
        >
          <Plus className="text-white" />
        </Button>
        {/* Send/Stop button at bottom right */}
        <Button
          onClick={isPrinting ? handleStop : handleSend}
          size="icon"
          disabled={isPrinting ? false : !input.trim()}
          type="button"
          className={`absolute right-2 bottom-2 -mb-0.5 rounded-full shadow-md transition cursor-pointer ${
            isPrinting
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
          aria-label={isPrinting ? "Stop generating" : "Send message"}
        >
          {isPrinting ? <Square size={20} /> : <Send size={20} />}
        </Button>
      </div>
    </div>
  );
}
