// TypeScript types for SpeechRecognition and SpeechRecognitionEvent
// These are not available in the DOM lib by default, so we define minimal types here
export type SpeechRecognition = typeof window extends {
  webkitSpeechRecognition: infer T;
}
  ? T
  : never;

export interface SpeechRecognitionEventResult {
  readonly isFinal: boolean;
  readonly [index: number]: {
    transcript: string;
    confidence: number;
  };
}

export interface SpeechRecognitionEvent {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionEventResult[];
}
