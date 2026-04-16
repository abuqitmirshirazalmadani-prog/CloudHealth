import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  constructor() {}

  async getHealthGuidance(prompt: string): Promise<string> {
    try {
      const response = await fetch('/api/ai/guidance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      return data.text || 'I am unable to provide guidance at this time.';
    } catch (error) {
      console.error('AI Error:', error);
      return 'Sorry, I encountered an error while processing your request.';
    }
  }
}
