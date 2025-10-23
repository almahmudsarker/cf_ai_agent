// src/agents/Chat.ts
import { Agent, unstable_callable as callable } from "agents";

/**
 * Chat Agent — handles incoming messages and generates AI responses
 * using Workers AI (Llama 3.3 model). This is the server-side logic
 * your React frontend (App.tsx) communicates with.
 */
export class Chat extends Agent {
  // Runs when the agent starts up
  onStart() {
    // Initialize conversation history
    this.setState({ history: [] });
  }

  /**
   * Handles user chat messages and returns an AI-generated response.
   */
  @callable()
  async chat(input: string) {
    const messages = [
      {
        role: "system",
        content:
          "You are a helpful and friendly AI assistant. Your main goal is to help internship and job applicants — offering guidance, technical explanations, and support in a clear and positive way."
      },
      ...this.state.history,
      { role: "user", content: input }
    ];

    // 🔸 Use Workers AI — no API key required
    const ai = await this.env.AI.run("@cf/meta/llama-3.3-70b-instruct", {
      messages
    });

    const reply = ai.response;

    // 🧠 Save new message into state history
    this.setState({
      history: [...messages, { role: "assistant", content: reply }]
    });

    // 💬 Return the reply to the frontend
    return reply;
  }
}
