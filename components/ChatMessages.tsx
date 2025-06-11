"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import oneDark from "react-syntax-highlighter/dist/cjs/styles/prism/one-dark";
import { Copy, Check } from "lucide-react"; // Changed to lucide-react

interface Message {
  role: string;
  content: string;
}

interface Props {
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
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 z-10 p-1 rounded bg-background hover:bg-muted transition"
        aria-label="Copy code"
        type="button"
      >
        {copied ? <Check className="text-green-500" /> : <Copy />}
      </button>
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

export default function ChatMessages({ messages, messagesEndRef }: Props) {
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
            msg.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`relative max-w-[90vw] sm:max-w-2xl px-4 py-3 rounded-2xl text-base whitespace-pre-wrap break-words shadow-sm
              ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-background border border-border text-foreground rounded-bl-md"
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
}
