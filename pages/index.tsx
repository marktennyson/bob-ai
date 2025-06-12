import { useState, useRef } from "react";
import ChatHeader from "@/components/Header";
import ChatInput from "@/components/ChatInput";
import ChatMessages from "@/components/ChatMessages";
import useSWR from "swr";
import type { NextPage } from "next";
import type { Message, Model } from "@/interfaces";
import Sidebar from "@/components/Sidebar";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Home: NextPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState(true); // Sidebar toggle state
  const messagesEndRef = useRef<HTMLDivElement>(
    null
  ) as React.RefObject<HTMLDivElement>;
  const abortControllerRef = useRef<AbortController | null>(null);

  const { data } = useSWR(
    `${process.env.NEXT_PUBLIC_BASE_OLLAMA_URL}/api/tags`,
    fetcher
  );

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
        <header className="w-full border-b border-border bg-background/80 backdrop-blur sticky top-0 z-20 flex items-center">
          {/* Sidebar toggle button */}
          <button
            className="p-2 m-2 rounded hover:bg-accent focus:outline-none focus:ring-2 focus:ring-accent md:hidden"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
          >
            {/* Hamburger icon */}
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              {sidebarOpen ? (
                // X icon
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                // Hamburger icon
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
          <div className="flex-1">
            <ChatHeader
              models={models}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
            />
          </div>
        </header>
        <main className="flex-1 w-full max-w-3xl xl:max-w-5xl 2xl:max-w-7xl mx-auto flex flex-col px-2 sm:px-4 md:px-6 py-2">
          <ChatMessages messages={messages} messagesEndRef={messagesEndRef} />
        </main>
        {/* Conditional rendering for ChatInput position */}
        {messages.length === 0 ? (
          // Centered ChatInput when no messages
          <div className="flex flex-1 items-center justify-center absolute inset-0 pointer-events-none z-20">
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
          <footer className="w-full bg-background/80 backdrop-blur border-t border-border sticky bottom-0 z-10">
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
// export const dynamic = "force-dynamic"; // Ensure this page is always fresh
// export const revalidate = 0; // Disable static generation for this page
// export const fetchCache = "force-no-store"; // Disable caching for this page
// export const runtime = "edge"; // Use edge runtime for better performance
// export const preferredRegion = "auto"; // Automatically select the best region
// export const tags = ["chat", "ollama", "ai", "assistant"]; // Tags for this page
// export const metadata = {
//   title: "BOB - Ollama AI Chat",
//   keywords: ["Ollama", "AI", "Chat", "Assistant", "Real-time"],
//   description: "A real-time chat interface powered by Ollama AI.",
// }
