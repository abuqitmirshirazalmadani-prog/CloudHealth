import { GoogleGenAI } from '@google/genai';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { prompt } = JSON.parse(event.body);
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-preview',
      contents: prompt,
      config: {
        systemInstruction: 'You are an AI health assistant for the CloudHealth app. Provide basic health guidance and advice based on the user\'s prompt. ALWAYS include a disclaimer that you are an AI and not a doctor, and that the user should consult a medical professional for serious issues or diagnosis. Keep responses concise, empathetic, and easy to read.',
      }
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: response.text || 'I am unable to provide guidance at this time.' })
    };
  } catch (error) {
    console.error('AI Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: error.message || 'Sorry, I encountered an error while processing your request.' })
    };
  }
};
