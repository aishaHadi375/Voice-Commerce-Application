import axios from 'axios';

const GROQ_API_URL = 'https://api.groq.com/v1/stt'; // Replace with the actual Groq API endpoint
const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export const transcribeWithGroq = async (audioBase64: string, mimeType: string): Promise<string> => {
  try {
    const response = await axios.post(
      GROQ_API_URL,
      { audio: audioBase64, mimeType },
      { headers: { Authorization: `Bearer ${API_KEY}` } }
    );
    return response.data.transcription;
  } catch (error) {
    console.error('Groq API error:', error);
    throw new Error('Failed to transcribe audio with Groq API.');
  }
};