/**
 * Represents the possible actors in a chat conversation.
 */
export enum Actor {
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
  role: Actor;
  /** Any error that occurred while processing the message */
  error: unknown;
}
