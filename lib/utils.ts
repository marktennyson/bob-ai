import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

let speechBuffer = "";
let speechTimeout: NodeJS.Timeout | null = null;

export const speakBuffered = (newText: string) => {
  const delta = newText.slice(speechBuffer.length);
  if (!delta.trim()) return;

  speechBuffer = newText;

  // Delay speaking by 500ms — debounce-style
  if (speechTimeout) clearTimeout(speechTimeout);
  speechTimeout = setTimeout(() => {
    const utterance = new SpeechSynthesisUtterance(speechBuffer);
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  }, 500);
};

export const cancelSpeech = () => {
  if (speechTimeout) clearTimeout(speechTimeout);
  speechSynthesis.cancel();
  speechBuffer = "";
};
