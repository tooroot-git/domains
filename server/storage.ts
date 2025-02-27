import { ChatMessage, InsertChatMessage, RateLimit } from "@shared/schema";

export interface IStorage {
  getChatMessages(sessionId: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getRateLimit(sessionId: string): Promise<RateLimit | undefined>;
  incrementRateLimit(sessionId: string): Promise<RateLimit>;
}

export class MemStorage implements IStorage {
  private messages: Map<number, ChatMessage>;
  private rateLimits: Map<string, RateLimit>;
  private currentMessageId: number;
  private currentRateLimitId: number;

  constructor() {
    this.messages = new Map();
    this.rateLimits = new Map();
    this.currentMessageId = 1;
    this.currentRateLimitId = 1;
  }

  async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    return Array.from(this.messages.values()).filter(
      (msg) => msg.sessionId === sessionId
    );
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const id = this.currentMessageId++;
    const chatMessage: ChatMessage = {
      ...message,
      id,
      createdAt: new Date(),
    };
    this.messages.set(id, chatMessage);
    return chatMessage;
  }

  async getRateLimit(sessionId: string): Promise<RateLimit | undefined> {
    return Array.from(this.rateLimits.values()).find(
      (limit) => limit.sessionId === sessionId
    );
  }

  async incrementRateLimit(sessionId: string): Promise<RateLimit> {
    const existing = await this.getRateLimit(sessionId);
    const id = existing?.id ?? this.currentRateLimitId++;
    const rateLimit: RateLimit = {
      id,
      sessionId,
      messageCount: (existing?.messageCount ?? 0) + 1,
      lastMessageAt: new Date(),
    };
    this.rateLimits.set(id, rateLimit);
    return rateLimit;
  }
}

export const storage = new MemStorage();
