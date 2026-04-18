import { Injectable } from '@angular/core';
import { GoogleGenAI } from '@google/genai';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private ai: GoogleGenAI;

  constructor() {
    // Requires GEMINI_API_KEY exposed by Angular Build
    // Ensure you add GEMINI_API_KEY to your Vercel Environment Variables
    const apiKey = typeof GEMINI_API_KEY !== 'undefined' ? GEMINI_API_KEY : '';
    this.ai = new GoogleGenAI({ apiKey: apiKey });
  }

  async getHealthGuidance(prompt: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      
      return response.text || 'I am unable to provide guidance at this time.';
    } catch (error) {
      console.error('AI Error:', error);
      return 'Sorry, I encountered an error while processing your request. Please check your API key configuration.';
    }
  }
}
