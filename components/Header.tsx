"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";
import type { Model } from "@/interfaces";

interface Props {
  models: Model[];
  selectedModel: string;
  setSelectedModel: (id: string) => void;
}

export default function ChatHeader({
  models,
  selectedModel,
  setSelectedModel,
}: Props) {
  return (
    <div className="px-2 py-1 sm:p-4 bg-neutral-500 border-b relative flex items-start justify-between gap-2 sm:gap-0">
      <h1 className="text-lg sm:text-xl font-bold text-white pt-1 sm:pt-0">
        <span className="text-blue-400">BOB</span> AI - Ollama Chat
      </h1>
      <div className="relative w-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="flex items-center justify-between gap-2 w-full sm:w-56 px-4 py-2 bg-white border border-gray-300 
              rounded-lg shadow-sm hover:border-gray-400 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              type="button"
            >
              <span className="truncate text-gray-800 font-medium flex-1 text-left">
                {models.find((m) => m.id === selectedModel)?.name ||
                  "Select Model"}
              </span>
              <ChevronDown size={20} className="text-gray-500 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full sm:w-56 mt-2 rounded-lg shadow-lg border border-gray-200 bg-white">
            {models.map((model) => (
              <DropdownMenuItem
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                className={
                  selectedModel === model.id
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "hover:bg-gray-100 text-black"
                }
              >
                {model.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
