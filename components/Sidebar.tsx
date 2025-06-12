"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusIcon, X } from "lucide-react";
import { useState } from "react";

interface ChatItem {
  id: string;
  title: string;
}

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const [chats, setChats] = useState<ChatItem[]>([
    { id: "1", title: "Trip plan with AI" },
    { id: "2", title: "Website feedback" },
    { id: "3", title: "Meme generation ideas" },
  ]);

  const handleNewChat = () => {
    const newChat = {
      id: `${Date.now()}`,
      title: `New Chat ${chats.length + 1}`,
    };
    setChats([newChat, ...chats]);
  };

  return (
    <aside
      className={`
        flex flex-col h-full bg-background border-r border-border transition-all duration-200
        fixed z-30 top-0 left-0
        ${sidebarOpen ? "w-64" : "w-0"}
        md:static md:w-64
        overflow-hidden
      `}
      style={{ minWidth: sidebarOpen ? "16rem" : "0" }}
    >
      {/* Header with close button on mobile */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-700 text-xl font-bold">
        <span>ChatGPT</span>
        <button
          className="md:hidden p-1 rounded hover:bg-accent"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <Button
          variant="outline"
          className="w-full justify-start gap-2 text-white border-zinc-600"
          onClick={handleNewChat}
        >
          <PlusIcon size={16} />
          New Chat
        </Button>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-2">
          {chats.length === 0 ? (
            <div className="text-muted-foreground text-sm mt-4">
              No conversations yet.
            </div>
          ) : (
            chats.map((chat) => (
              <Button
                key={chat.id}
                variant="ghost"
                className="w-full justify-start text-left text-sm hover:bg-zinc-700"
              >
                {chat.title}
              </Button>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-zinc-700 text-sm text-zinc-400">
        Logged in as: <span className="text-white">you@example.com</span>
      </div>
    </aside>
  );
}
