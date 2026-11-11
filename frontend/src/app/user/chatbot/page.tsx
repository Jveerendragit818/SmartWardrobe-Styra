
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Bot, Send, Sparkles, User } from "lucide-react";

type Message = {
  id: number;
  role: "user" | "assistant";
  text: string;
};

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    text: "Hello! I'm your SmartWardrobe Fashion Assistant. Ask me about outfit ideas, colors, styling or packing for a trip!",
  },
];

function getDemoReply(question: string): string {
  const text = question.toLowerCase();

  if (text.includes("college") || text.includes("casual")) {
    return "For a casual college outfit, try a comfortable T-shirt, jeans and sneakers. Add a light jacket if needed.";
  }

  if (text.includes("party")) {
    return "For a party, choose an outfit you feel comfortable in. You can add a jacket, matching shoes or accessories.";
  }

  if (text.includes("color") || text.includes("colour")) {
    return "Navy, white, beige and lavender can work well in many outfit combinations. Try experimenting with your favorite colors!";
  }

  if (text.includes("trip") || text.includes("pack")) {
    return "For a trip, pack comfortable outfits, suitable footwear, toiletries and weather-appropriate layers. Visit the Trip Planner for a packing checklist!";
  }

  if (text.includes("office") || text.includes("formal")) {
    return "For an office look, try a neat shirt with trousers or a comfortable formal outfit and matching shoes.";
  }

  return "I can help with casual outfits, party styling, color combinations, office wear and travel packing. What would you like to explore?";
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");

  function handleSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const question = input.trim();
    if (!question) return;

    const timestamp = Date.now();

    setMessages((previous) => [
      ...previous,
      { id: timestamp, role: "user", text: question },
      {
        id: timestamp + 1,
        role: "assistant",
        text: getDemoReply(question),
      },
    ]);

    setInput("");
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/user/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#172A4B] hover:underline"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="mb-6">
          <h1 className="flex items-center gap-3 text-3xl font-bold text-[#172A4B]">
            <Sparkles className="text-[#8170C4]" />
            AI Fashion Chatbot
          </h1>
          <p className="mt-2 text-gray-600">
            Chat about fashion, outfit ideas and travel packing.
          </p>
        </div>

        <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b p-5">
            <div className="rounded-xl bg-[#EEE9FA] p-3">
              <Bot size={24} className="text-[#8170C4]" />
            </div>

            <div>
              <h2 className="font-semibold text-[#172A4B]">
                SmartWardrobe Assistant
              </h2>
              <p className="text-xs text-gray-500">
                Demo fashion assistant
              </p>
            </div>
          </div>

          <div
            aria-label="Chat messages"
            aria-live="polite"
            className="flex h-[420px] flex-col gap-4 overflow-y-auto bg-gray-50 p-5"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <Bot size={20} className="mt-2 shrink-0 text-[#8170C4]" />
                )}

                <div
                  className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-[#172A4B] text-white"
                      : "border border-gray-100 bg-white text-gray-700"
                  }`}
                >
                  {message.text}
                </div>

                {message.role === "user" && (
                  <User size={20} className="mt-2 shrink-0 text-[#172A4B]" />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="flex gap-3 border-t p-4">
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask me about fashion..."
              aria-label="Your fashion question"
              className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm text-[#172A4B] outline-none focus:border-[#8170C4]"
            />

            <button
              type="submit"
              disabled={!input.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-[#172A4B] px-5 py-3 text-white hover:bg-[#283F65] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send size={18} />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </section>

        <p className="mt-4 text-xs text-gray-500">
          This is a frontend demo with predefined replies. A real AI
          chatbot backend will be integrated later.
        </p>
      </div>
    </main>
  );
}
