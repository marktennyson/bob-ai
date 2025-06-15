"use client";
import { useRef } from "react";
import { Button } from "../ui/button";
import type { SpeechRecognitionEvent } from "@/lib/speech-types";

// Use a minimal custom type for SpeechRecognition
interface MinimalSpeechRecognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((err: unknown) => void) | null;
  start: () => void;
}

export default function VoiceInput({
  onResult,
}: {
  onResult: (text: string) => void;
}) {
  const recognitionRef = useRef<MinimalSpeechRecognition | null>(null);

  const start = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    // @ts-expect-error: webkitSpeechRecognition is not in the standard DOM types
    const r: MinimalSpeechRecognition = new window.webkitSpeechRecognition();
    r.lang = "en-US";
    r.continuous = false;
    r.interimResults = false;

    r.onstart = () => {};
    r.onend = () => {};
    r.onresult = (event: SpeechRecognitionEvent) => {
      const text = event.results[0][0].transcript;
      onResult(text);
    };
    r.onerror = (err: unknown) => console.error("Speech error", err);
    recognitionRef.current = r;
    r.start();
  };

  return (
    <Button
      onClick={start}
      size={"icon"}
      className="text-white absolute left-2 bottom-2 rounded-full transition bg-transparent hover:bg-muted cursor-pointer"
      type="button"
      aria-label="Start voice input"
    >
      🎤
    </Button>
  );
}
