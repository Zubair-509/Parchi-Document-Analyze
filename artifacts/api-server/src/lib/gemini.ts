import { GoogleGenAI } from "@google/genai";

function getAI(): GoogleGenAI {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("GEMINI_API_KEY environment variable is not set. Add it in your Railway Variables tab.");
  }
  return new GoogleGenAI({ apiKey: key });
}

let _ai: GoogleGenAI | null = null;

export const ai = {
  get models() {
    if (!_ai) _ai = getAI();
    return _ai.models;
  },
};
