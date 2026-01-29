import { GoogleGenAI, Type } from "@google/genai";
import type { SearchFilters } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const schema = {
  type: Type.OBJECT,
  properties: {
    brand: { type: Type.STRING, description: "The shoe brand, e.g., Nike, Adidas.", nullable: true },
    color: { type: Type.STRING, description: "The primary color of the shoe.", nullable: true },
    gender: { type: Type.STRING, enum: ["Men", "Women", "Unisex", "Kids"], description: "The target gender.", nullable: true },
    size: { type: Type.NUMBER, description: "The shoe size (US sizing).", nullable: true },
    priceMin: { type: Type.NUMBER, description: "The minimum price.", nullable: true },
    priceMax: { type: Type.NUMBER, description: "The maximum price.", nullable: true },
    category: { type: Type.STRING, description: "The type of shoe, e.g., Running, Basketball, Lifestyle.", nullable: true },
  },
};

export async function extractFiltersFromText(text: string): Promise<SearchFilters> {
    try {
        const prompt = `
            Extract shoe search filters from the following user query.
            The current year is ${new Date().getFullYear()}.
            If the user doesn't specify a filter, leave its value as null.
            Do not make up any information.
            User Query: "${text}"
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);

        // Basic validation
        if (typeof parsedJson !== 'object' || parsedJson === null) {
            throw new Error("Invalid JSON structure from Gemini API");
        }
        
        return parsedJson as SearchFilters;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Could not understand your request. Please try rephrasing.");
    }
}

export async function transcribeAudioFile(base64Audio: string, mimeType: string): Promise<string> {
    try {
        const audioPart = {
            inlineData: {
                data: base64Audio,
                mimeType: mimeType,
            },
        };

        const textPart = {
            text: "Transcribe the following audio recording of a user describing the shoes they want to buy. Only return the transcribed text, without any introductory phrases.",
        };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [textPart, audioPart] },
        });
        
        const transcript = response.text;
        if (!transcript) {
            throw new Error("Gemini could not transcribe the audio.");
        }
        return transcript.trim();

    } catch (error) {
        console.error("Error calling Gemini API for transcription:", error);
        throw new Error("Could not transcribe the audio file. Please try again or use voice input.");
    }
}