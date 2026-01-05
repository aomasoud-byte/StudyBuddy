import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private anthropic: Anthropic | null = null;
  private openai: OpenAI | null = null;
  private provider: 'anthropic' | 'openai' | null = null;

  constructor(private config: ConfigService) {
    const anthropicKey = this.config.get<string>('ANTHROPIC_API_KEY');
    const openaiKey = this.config.get<string>('OPENAI_API_KEY');

    if (anthropicKey) {
      this.anthropic = new Anthropic({ apiKey: anthropicKey });
      this.provider = 'anthropic';
      console.log('✨ AI Service initialized with Anthropic');
    } else if (openaiKey) {
      this.openai = new OpenAI({ apiKey: openaiKey });
      this.provider = 'openai';
      console.log('✨ AI Service initialized with OpenAI');
    } else {
      console.warn('⚠️  No AI API keys found. AI features will be limited.');
    }
  }

  /**
   * Generate flashcards from notes
   */
  async generateFlashcards(notes: string, subject: string): Promise<any[]> {
    const prompt = `You are an expert educator. Generate high-quality flashcards from the following study notes for ${subject}.

Notes:
${notes}

Generate 5-10 flashcards. For each flashcard:
- Front: A clear, specific question
- Back: A concise, accurate answer
- Difficulty: EASY, MEDIUM, or HARD
- Tags: 2-3 relevant topic tags

Return ONLY valid JSON array in this exact format:
[
  {
    "front": "Question here?",
    "back": "Answer here",
    "difficulty": "MEDIUM",
    "tags": ["topic1", "topic2"]
  }
]`;

    const response = await this.complete(prompt);
    return this.parseJSONResponse(response);
  }

  /**
   * Generate quiz questions
   */
  async generateQuiz(topic: string, subject: string, count: number = 5): Promise<any[]> {
    const prompt = `You are an expert educator. Generate ${count} quiz questions about ${topic} for ${subject}.

Create a mix of multiple-choice (MCQ) and short-answer questions.

Return ONLY valid JSON array in this exact format:
[
  {
    "question": "Question text?",
    "type": "MCQ",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option B",
    "explanation": "Brief explanation of the answer",
    "difficulty": "MEDIUM",
    "topics": ["topic1", "topic2"]
  },
  {
    "question": "Short answer question?",
    "type": "SHORT_ANSWER",
    "correctAnswer": "Expected answer",
    "explanation": "Explanation",
    "difficulty": "EASY",
    "topics": ["topic1"]
  }
]`;

    const response = await this.complete(prompt);
    return this.parseJSONResponse(response);
  }

  /**
   * AI Tutor chat
   */
  async tutorChat(messages: Array<{ role: string; content: string }>, subject: string): Promise<string> {
    const systemMessage = `You are an expert tutor for ${subject}. Your teaching style:
- Start with simple explanations, then add detail
- Use analogies and examples
- Ask check questions to test understanding
- Be encouraging and patient
- After explaining, offer to generate practice questions or flashcards

Keep responses concise (2-3 paragraphs max).`;

    const fullMessages = [
      { role: 'system', content: systemMessage },
      ...messages.map(m => ({ role: m.role === 'USER' ? 'user' : 'assistant', content: m.content })),
    ];

    return this.chat(fullMessages);
  }

  /**
   * Complete a prompt (single turn)
   */
  private async complete(prompt: string): Promise<string> {
    if (!this.provider) {
      throw new BadRequestException('AI service not configured. Please add an API key.');
    }

    if (this.provider === 'anthropic' && this.anthropic) {
      const message = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }],
      });

      const content = message.content[0];
      return content.type === 'text' ? content.text : '';
    } else if (this.provider === 'openai' && this.openai) {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2048,
      });

      return completion.choices[0]?.message?.content || '';
    }

    throw new BadRequestException('AI provider not available');
  }

  /**
   * Chat completion (multi-turn)
   */
  private async chat(messages: Array<{ role: string; content: string }>): Promise<string> {
    if (!this.provider) {
      throw new BadRequestException('AI service not configured. Please add an API key.');
    }

    if (this.provider === 'anthropic' && this.anthropic) {
      // Extract system message
      const systemMsg = messages.find(m => m.role === 'system');
      const userMessages = messages.filter(m => m.role !== 'system');

      const message = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        system: systemMsg?.content,
        messages: userMessages as any,
      });

      const content = message.content[0];
      return content.type === 'text' ? content.text : '';
    } else if (this.provider === 'openai' && this.openai) {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: messages as any,
        max_tokens: 1024,
      });

      return completion.choices[0]?.message?.content || '';
    }

    throw new BadRequestException('AI provider not available');
  }

  /**
   * Parse JSON response from AI
   */
  private parseJSONResponse(response: string): any {
    try {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1]);
      }

      // Try to extract JSON array directly
      const arrayMatch = response.match(/\[[\s\S]*\]/);
      if (arrayMatch) {
        return JSON.parse(arrayMatch[0]);
      }

      // Try parsing the whole response
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      console.error('Response:', response);
      throw new BadRequestException('Failed to parse AI response. Please try again.');
    }
  }

  /**
   * Check if AI is available
   */
  isAvailable(): boolean {
    return this.provider !== null;
  }
}
