"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface Model {
  id: string;
  name: string;
}

interface Props {
  models: Model[];
  selectedModel: string;
  setSelectedModel: (id: string) => void;
}

export default function ChatHeader({ models, selectedModel, setSelectedModel }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-2 sm:p-4 bg-white border-b relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
      <h1 className="text-lg sm:text-xl font-bold text-gray-700">Ollama Chat</h1>
      <div className="relative w-full sm:w-auto">
        <button
          className="flex items-center gap-2 w-full sm:w-auto px-3 sm:px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="truncate">{selectedModel || "Select Model"}</span>
          <ChevronDown size={20} />
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-full sm:w-48 bg-white border rounded shadow z-50">
            {models.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  setSelectedModel(model.id);
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                {model.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
