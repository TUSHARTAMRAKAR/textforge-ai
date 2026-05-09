import { create } from "zustand";
import type { Tone, Length, Language } from "./api";

// ─────────────────────────────────────────────────────────────
//  store.ts — Zustand global state
//
//  The generator state needs to be shared between
//  PromptBuilder (triggers generation) and
//  OutputPanel (displays the result + refine/share/export).
// ─────────────────────────────────────────────────────────────

interface GenerateStore {
  // Form state
  topic: string;
  tone: Tone;
  length: Length;
  language: Language;
  keywords: string[];
  templateId?: string;

  // Output state
  output: string;
  isStreaming: boolean;
  isDone: boolean;
  wordCount: number;
  error: string | null;
  savedId?: string;

  // Form actions
  setTopic: (v: string) => void;
  setTone: (v: Tone) => void;
  setLength: (v: Length) => void;
  setLanguage: (v: Language) => void;
  setKeywords: (v: string[]) => void;
  setTemplateId: (v?: string) => void;
  applyTemplate: (t: { id: string; tone: Tone; length: Length; language?: Language; topicPrefix?: string }) => void;

  // Output actions
  appendOutput: (text: string) => void;
  setIsStreaming: (v: boolean) => void;
  setIsDone: (v: boolean) => void;
  setError: (v: string | null) => void;
  setSavedId: (v?: string) => void;
  resetOutput: () => void;
}

export const useGenerateStore = create<GenerateStore>((set) => ({
  topic: "",
  tone: "formal",
  length: "medium",
  language: "en",
  keywords: [],
  templateId: undefined,

  output: "",
  isStreaming: false,
  isDone: false,
  wordCount: 0,
  error: null,
  savedId: undefined,

  setTopic: (topic) => set({ topic }),
  setTone: (tone) => set({ tone }),
  setLength: (length) => set({ length }),
  setLanguage: (language) => set({ language }),
  setKeywords: (keywords) => set({ keywords }),
  setTemplateId: (templateId) => set({ templateId }),

  applyTemplate: (t) =>
    set((state) => ({
      templateId: t.id,
      tone: t.tone,
      length: t.length,
      language: t.language ?? state.language,
      topic: t.topicPrefix ? `${t.topicPrefix}${state.topic}` : state.topic,
    })),

  appendOutput: (text) =>
    set((state) => {
      const newOutput = state.output + text;
      return {
        output: newOutput,
        wordCount: newOutput.split(/\s+/).filter(Boolean).length,
      };
    }),

  setIsStreaming: (isStreaming) => set({ isStreaming }),
  setIsDone: (isDone) => set({ isDone }),
  setError: (error) => set({ error }),
  setSavedId: (savedId) => set({ savedId }),

  resetOutput: () =>
    set({
      output: "",
      isStreaming: false,
      isDone: false,
      error: null,
      wordCount: 0,
      savedId: undefined,
    }),
}));
