import { create } from "zustand";

// ─────────────────────────────────────────────────────────────
//  store.ts — Zustand global state
//
//  Why Zustand? Simpler than Redux, no boilerplate.
//  The generator state needs to be shared between
//  PromptBuilder (triggers generation) and
//  OutputPanel (displays the result) — so it lives here.
// ─────────────────────────────────────────────────────────────

interface GenerateStore {
  // Form state
  topic:  string;
  tone:   "formal" | "casual" | "creative" | "academic";
  length: "short" | "medium" | "long";

  // Output state
  output:      string;
  isStreaming: boolean;
  isDone:      boolean;
  wordCount:   number;
  error:       string | null;

  // Actions
  setTopic:  (v: string)  => void;
  setTone:   (v: "formal" | "casual" | "creative" | "academic") => void;
  setLength: (v: "short" | "medium" | "long") => void;

  appendOutput:  (text: string) => void;
  setIsStreaming: (v: boolean) => void;
  setIsDone:      (v: boolean) => void;
  setError:       (v: string | null) => void;
  resetOutput:    () => void;
}

export const useGenerateStore = create<GenerateStore>((set) => ({
  topic:      "",
  tone:       "formal",
  length:     "medium",
  output:     "",
  isStreaming: false,
  isDone:      false,
  wordCount:   0,
  error:       null,

  setTopic:  (topic)  => set({ topic }),
  setTone:   (tone)   => set({ tone }),
  setLength: (length) => set({ length }),

  appendOutput: (text) =>
    set((state) => {
      const newOutput = state.output + text;
      return {
        output:    newOutput,
        wordCount: newOutput.split(/\s+/).filter(Boolean).length,
      };
    }),

  setIsStreaming: (isStreaming) => set({ isStreaming }),
  setIsDone:      (isDone)      => set({ isDone }),
  setError:       (error)       => set({ error }),

  resetOutput: () => set({ output: "", isStreaming: false, isDone: false, error: null, wordCount: 0 }),
}));
