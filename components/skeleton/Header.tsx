"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { LogOut, User, Settings, ChevronDown } from "lucide-react";
import type { Model } from "@/interfaces";
import type { UserSession } from "@/interfaces";
import { signOut } from "next-auth/react";

interface HeaderProps {
  models: Model[];
  selectedModel: string;
  setSelectedModel: (id: string) => void;
  userSession: UserSession; // Optional user session prop
}

const ChatHeader: React.FC<HeaderProps> = ({
  models,
  selectedModel,
  setSelectedModel,
  userSession,
}) => {
  return (
    <div className="px-2 py-1 sm:p-4 relative flex items-start justify-between gap-2 sm:gap-0">
      <div className="relative w-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-3 py-1.5 h-10 w-auto border border-transparent bg-transparent hover:bg-accent hover:border-accent transition-colors rounded-md shadow-none select-none cursor-pointer"
              type="button"
              aria-label="Select model"
            >
              <span className="truncate text-foreground font-medium flex-1 text-left">
                {models
                  .find((m) => m.id === selectedModel)
                  ?.name.toUpperCase() || "Select Model"}
              </span>
              <ChevronDown size={18} className="text-muted-foreground ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-auto mt-2 rounded-md shadow-lg border border-border bg-popover p-1"
            align="start"
          >
            {models.map((model) => (
              <DropdownMenuItem
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                className={
                  selectedModel === model.id
                    ? "text-accent-foreground font-semibold cursor-pointer rounded"
                    : "hover:bg-muted text-foreground cursor-pointer rounded"
                }
              >
                <span className="truncate">{model.name.toUpperCase()}</span>
                {selectedModel === model.id && (
                  <span className="ml-auto text-xs text-primary font-bold">
                    ✓
                  </span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="p-0 rounded-full select-none hover:ring-2 hover:ring-gray-500"
              aria-label="Open user menu"
            >
              <Avatar className="h-9 w-9 shadow-sm select-none cursor-pointer">
                <AvatarImage
                  src={userSession?.user?.image}
                  alt="@evilrabbit"
                  className="select-none"
                />
                <AvatarFallback className="select-none bg-blue-500">
                  {userSession?.user?.name
                    ?.split("")[0]
                    .charAt(0)
                    .toUpperCase() || "B"}{" "}
                  {userSession?.user?.name
                    ?.split("")[1]
                    .charAt(0)
                    .toUpperCase() || "B"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 mt-2 rounded-lg0">
            <DropdownMenuItem className="gap-2 text-white hover:bg-muted cursor-pointer">
              <User size={16} /> My Account
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 text-white hover:bg-muted cursor-pointer">
              <Settings size={16} /> Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2 text-red-600 hover:!bg-red-500/10 hover:!text-red-800 hover:brightness-200 cursor-pointer"
              onClick={() => signOut()}
            >
              <LogOut size={16} /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ChatHeader;
