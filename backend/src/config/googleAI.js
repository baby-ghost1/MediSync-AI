import { GoogleGenAI } from "@google/genai";

const apiKey =
  process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

const createAI = () => {
  if (!apiKey) {
    return null;
  }

  return new GoogleGenAI({ apiKey });
};

const ai = createAI();

export default ai;