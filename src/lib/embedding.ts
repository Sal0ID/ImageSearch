import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  }
  return ai;
}

export async function embedQuery(query: string): Promise<number[]> {
  const response = await getAI().models.embedContent({
    model: "gemini-embedding-2",
    contents: query,
  });

  const values = response.embeddings?.[0]?.values;
  if (!values) {
    throw new Error("Failed to generate embedding");
  }

  return values;
}

export async function embedImage(
  base64Data: string,
  mimeType: string
): Promise<number[]> {
  const response = await getAI().models.embedContent({
    model: "gemini-embedding-2",
    contents: [
      {
        inlineData: {
          data: base64Data,
          mimeType,
        },
      },
    ],
  });

  const values = response.embeddings?.[0]?.values;
  if (!values) {
    throw new Error("Failed to generate embedding from image");
  }

  return values;
}
