import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY!;

const ai = new GoogleGenAI({ apiKey });

export async function embedQuery(query: string): Promise<number[]> {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-2",
    contents: query,
  });

  const values = response.embeddings?.[0]?.values;
  if (!values) {
    throw new Error("Failed to generate embedding");
  }

  return values;
}
