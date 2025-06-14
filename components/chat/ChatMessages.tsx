"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import oneDark from "react-syntax-highlighter/dist/cjs/styles/prism/one-dark";
import { Copy, Check } from "lucide-react"; // Changed to lucide-react
import { Button } from "../ui/button";

interface Message {
  role: string;
  content: string;
}

interface ChatMessagesProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

// CodeBlock component for rendering code blocks with copy button
function CodeBlock({
  inline,
  className,
  children,
  ...props
}: {
  // node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  const match = /language-(\w+)/.exec(className || "");

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(String(children));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return !inline && match ? (
    <div className="relative group">
      <Button
        onClick={handleCopy}
        size={"icon"}
        className="absolute top-2 right-2 p-1 rounded bg-transparent hover:bg-muted transition"
        aria-label="Copy code"
        type="button"
      >
        {copied ? (
          <Check className="text-green-500" />
        ) : (
          <Copy className="text-white" />
        )}
      </Button>
      <SyntaxHighlighter
        style={oneDark}
        language={match[1]}
        PreTag="div"
        {...props}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    </div>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  messagesEndRef,
}) => {
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, messagesEndRef]);

  return (
    <div className="flex-1 flex flex-col gap-4 py-4 overflow-y-auto">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex ${
            msg.role === "user" ? "justify-end" : "justify-center"
          }`}
        >
          <div
            className={`relative px-4 py-3 rounded-2xl text-base whitespace-pre-wrap break-words
              ${
                msg.role === "user"
                  ? "bg-message-surface text-foreground rounded-br-md shadow-sm  max-w-[90vw] sm:max-w-2xl xl:max-w-4xl"
                  : "text-foreground rounded-bl-md w-[90vw] sm:w-2xl xl:w-4xl"
              }
            `}
          >
            <ReactMarkdown
              components={{
                code: CodeBlock,
              }}
            >
              {msg.content}
            </ReactMarkdown>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
// This component renders chat messages with syntax highlighting and copy functionality
