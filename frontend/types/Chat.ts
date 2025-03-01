/**
 * Represents the possible actors in a chat conversation.
 */
export enum Type {
  /** Represents a human user in the conversation */
  Human = 'human',
  /** Represents an AI assistant in the conversation */
  AI = 'ai',
}

/**
 * Represents a chat message in the conversation.
 */
export interface Message {
  /** Unique identifier for the message */
  id: string;
  /** The text content of the message */
  content: string;
  /** The actor (human or AI) who sent the message */
  type: Type;
  /** Any error that occurred while processing the message */
  error: unknown;
}

/**
 * Represents the chat history containing an array of messages.
 */
export interface History {
  /** Array of chat messages in chronological order */
  messages: Message[];
}

/**
 * Represents a chat session with identifying information.
 */
export interface Session {
  /** Unique identifier for the session */
  id: string;
  /** Title or name of the chat session */
  title: string;
}
