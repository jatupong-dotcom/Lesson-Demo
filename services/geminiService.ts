import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

const createClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please set process.env.API_KEY");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateQuiz = async (count: number): Promise<Question[]> => {
  const ai = createClient();

  // Schema definition for structured JSON output
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      questions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            word: { type: Type.STRING, description: "The English name of the animal (e.g., 'Lion')." },
            thai: { type: Type.STRING, description: "The Thai translation of the animal name." },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "An array containing the correct 'word' and 3 other distinct incorrect animal names, randomly shuffled."
            }
          },
          required: ["word", "thai", "options"],
        },
      },
    },
    required: ["questions"],
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a list of ${count} distinct animal vocabulary questions for a children's game. 
      Each question should have an English animal name, its Thai translation, and a list of options. 
      The options list MUST include the correct English name and 3 other random incorrect animal names as distractors.
      Ensure the animals are common and suitable for children (e.g., Cat, Dog, Elephant, Lion, Bird, Ant).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
      },
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      return parsed.questions;
    } else {
      throw new Error("No content received from Gemini.");
    }
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw error;
  }
};