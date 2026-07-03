import BaseRepository from "./base.repository.js";
import { Chat } from "../models/index.js";

class ChatRepository extends BaseRepository {
  constructor() {
    super(Chat);
  }

  async getOrCreate(userId) {
    let chat = await this.model.findOne({ user: userId });
    if (!chat) {
      chat = await this.model.create({ user: userId, messages: [] });
    }
    return chat;
  }

  async addMessage(userId, role, content) {
    return this.model.findOneAndUpdate(
      { user: userId },
      { $push: { messages: { role, content } } },
      { new: true, upsert: true }
    );
  }

  async clearChat(userId) {
    return this.model.findOneAndUpdate(
      { user: userId },
      { $set: { messages: [] } },
      { new: true }
    );
  }

  async getChatHistory(userId) {
    const chat = await this.model.findOne({ user: userId });
    return chat?.messages || [];
  }
}

export default new ChatRepository();
