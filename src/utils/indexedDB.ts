import Dexie from "dexie";

// Define the schema for IndexedDB
class ChatAppDB extends Dexie {
  chats;
  messages;

  constructor() {
    super("ChatAppDB");
    this.version(1).stores({
      chats: "id, user1, user2",
      messages: "id, chat_id, sender_id, created_at",
    });

    this.chats = this.table("chats");
    this.messages = this.table("messages");
  }
}

export const db = new ChatAppDB();
