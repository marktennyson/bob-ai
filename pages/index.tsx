import { useState, useRef, useEffect } from "react";
import ChatHeader from "@/components/skeleton/Header";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessages from "@/components/chat/ChatMessages";
import useSWR from "swr";
import type { NextPage } from "next";
import type { Message, Model } from "@/interfaces";
import Sidebar from "@/components/skeleton/Sidebar";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Home: NextPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(
    null
  ) as React.RefObject<HTMLDivElement>;
  const abortControllerRef = useRef<AbortController | null>(null);

  const { data: modelsData } = useSWR(
    `${process.env.NEXT_PUBLIC_BASE_OLLAMA_URL}/api/tags`,
    fetcher
  );

  const models =
    modelsData?.models?.map((m: Model) => ({
      id: m.name,
      name: m.name.split(":")[0],
    })) || [];

  if (!selectedModel && models.length > 0) {
    setSelectedModel(models[0].id);
  }

  const handleSend = async () => {
    if (!input.trim() || !selectedModel) return;
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsPrinting(true);
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    try {
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_OLLAMA_URL}/api/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: selectedModel,
            messages: [...messages, userMessage],
            stream: true,
          }),
          signal: abortController.signal,
        }
      );

      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";
      let fullContent = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      while (true) {
        const { done, value } = await reader!.read();
        if (done) {
          setIsPrinting(false);
          break;
        }

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
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "name" in error &&
        (error as { name?: string }).name === "AbortError"
      ) {
        setMessages((prev) => {
          // Optionally, you can show a message that generation was stopped
          const updated = [...prev];
          if (
            updated.length &&
            updated[updated.length - 1].role === "assistant"
          ) {
            updated[updated.length - 1].content += "\n\n[Stopped by user]";
          }
          return updated;
        });
      } else {
        console.error("Streaming error:", error);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Error: Could not get response" },
        ]);
      }
      setIsPrinting(false);
    } finally {
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsPrinting(false);
  };

  // Auto-hide sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-muted dark:bg-none">
      {/* Sidebar */}
      <aside
        className={`transition-all duration-200 bg-background border-r border-border h-screen fixed md:static z-30 ${
          sidebarOpen ? "w-64" : "w-0 md:w-16"
        } overflow-hidden flex flex-col`}
        style={{ minWidth: sidebarOpen ? "16rem" : "0" }}
      >
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </aside>
      {/* Main content */}
      <div
        className={`flex flex-col flex-1 min-h-screen transition-all duration-200 ${
          sidebarOpen ? "md" : "md"
        }`}
      >
        <header className="w-full border-b border-border backdrop-blur sticky top-0 z-20 flex items-center">
          <Button
            className="p-2 m-2 rounded hover:bg-accent focus:outline-none focus:ring-2 focus:ring-accent md:hidden bg-transparent"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
          >
            {sidebarOpen ? (
              <X size={32} />
            ) : (
              <Menu size={32} className="text-white brightness-250" />
            )}
          </Button>
          <div className="flex-1">
            <ChatHeader
              models={models}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
            />
          </div>
        </header>
        {messages.length > 0 && (
          <main
            id="chat-messages"
            className="flex-1 w-full max-w-3xl xl:max-w-5xl 2xl:max-w-7xl mx-auto flex flex-col px-2 sm:px-4 md:px-6 py-2"
          >
            <ChatMessages messages={messages} messagesEndRef={messagesEndRef} />
          </main>
        )}
        {/* Conditional rendering for ChatInput position */}
        {messages.length === 0 ? (
          // Centered ChatInput when no messages
          <div
            id="chat-input"
            className="flex flex-1 items-center justify-center inset-0 pointer-events-none z-20"
          >
            <div className="w-full max-w-2xl pointer-events-auto">
              <ChatInput
                input={input}
                setInput={setInput}
                handleSend={handleSend}
                isPrinting={isPrinting}
                handleStop={handleStop}
              />
            </div>
          </div>
        ) : (
          // Footer ChatInput when messages exist
          <footer className="w-full backdrop-blur border-t border-border sticky bottom-0 z-10">
            <div className="max-w-3xl mx-auto px-4">
              <ChatInput
                input={input}
                setInput={setInput}
                handleSend={handleSend}
                isPrinting={isPrinting}
                handleStop={handleStop}
              />
            </div>
          </footer>
        )}
      </div>
    </div>
  );
};

export default Home;
