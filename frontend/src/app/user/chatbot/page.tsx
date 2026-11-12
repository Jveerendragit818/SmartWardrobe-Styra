
"use client";

import {
  useState,
  useEffect,
  useRef,
  type FormEvent,
} from "react";

import Link from "next/link";

import {
  ArrowLeft,
  Bot,
  Send,
  Sparkles,
  User,
  Loader2,
  AlertCircle,
  Trash2,
  Shirt,
} from "lucide-react";

import Button from "@/components/shared/Button";
import { apiRequest } from "@/lib/api";

// Chat message type
type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  usedItemIds?: string[];
  source?: string;
};

// Backend chatbot response
type ChatbotResponse = {
  data: {
    reply: string;
    used_item_ids: string[];
    source: string;
  } | null;
  error: string | null;
};

// Initial welcome message
const initialMessages: Message[] = [
  {
    id: "welcome",
    role: "assistant",
    text:
      "Hello! I'm Styra, your SmartWardrobe Fashion Assistant. Ask me about outfit ideas, color combinations, styling or packing for a trip!",
  },
];

// Suggested questions
const suggestedQuestions = [
  "What can I wear to college?",
  "Suggest a casual outfit from my wardrobe.",
  "What colors go well with blue jeans?",
  "What should I pack for a trip?",
];

export default function ChatbotPage() {
  const [messages, setMessages] =
    useState<Message[]>(initialMessages);

  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [lastQuestion, setLastQuestion] =
    useState("");

  const messagesEndRef =
    useRef<HTMLDivElement>(null);

  const requestInProgress =
    useRef(false);

  // Scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [messages, loading, error]);

  // Send message to the real backend
  async function sendMessage(
    question: string,
    addUserMessage = true
  ) {
    const cleanedQuestion =
      question.trim();

    if (
      !cleanedQuestion ||
      requestInProgress.current
    ) {
      return;
    }

    if (cleanedQuestion.length > 1000) {
      setError(
        "Please enter a message with 1000 characters or fewer."
      );
      return;
    }

    requestInProgress.current = true;

    setLoading(true);
    setError("");
    setLastQuestion(cleanedQuestion);

    // Add user message to the chat
    if (addUserMessage) {
      setMessages((previous) => [
        ...previous,
        {
          id: crypto.randomUUID(),
          role: "user",
          text: cleanedQuestion,
        },
      ]);
    }

    setInput("");

    try {
      const response =
        await apiRequest<ChatbotResponse>(
          "/chatbot/chat",
          {
            method: "POST",
            body: JSON.stringify({
              message: cleanedQuestion,
            }),
          }
        );

      if (response.error) {
        throw new Error(response.error);
      }

      if (
        !response.data ||
        typeof response.data.reply !== "string" ||
        !response.data.reply.trim()
      ) {
        throw new Error(
          "The chatbot returned an invalid response."
        );
      }

      const chatbotReply =
        response.data;

      // Add backend response to chat
      setMessages((previous) => [
        ...previous,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: chatbotReply.reply,
          usedItemIds: Array.isArray(
            chatbotReply.used_item_ids
          )
            ? chatbotReply.used_item_ids
            : [],
          source: chatbotReply.source,
        },
      ]);

    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to get a chatbot response. Please try again."
      );

    } finally {
      requestInProgress.current = false;
      setLoading(false);
    }
  }

  // Handle form submission
  function handleSend(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    void sendMessage(input);
  }

  // Retry failed request
  function retryMessage() {
    if (!lastQuestion || loading) {
      return;
    }

    void sendMessage(
      lastQuestion,
      false
    );
  }

  // Clear conversation
  function clearChat() {
    if (loading) return;

    setMessages(initialMessages);
    setInput("");
    setError("");
    setLastQuestion("");
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 text-[#172A4B] sm:p-6">

      <div className="mx-auto max-w-5xl">

        {/* Back to dashboard */}
        <Link
          href="/user/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#172A4B] hover:underline"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        {/* Page heading */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">

          <div>

            <h1 className="flex items-center gap-3 text-3xl font-bold text-[#172A4B]">

              <Sparkles
                className="text-[#8170C4]"
              />

              AI Fashion Chatbot

            </h1>

            <p className="mt-2 text-gray-600">
              Chat with Styra about fashion, outfit
              ideas and travel packing.
            </p>

          </div>

          <Link
            href="/user/wardrobe"
            className="inline-flex items-center gap-2 rounded-lg border border-[#172A4B] px-5 py-3 text-sm font-medium hover:bg-[#F3F0FA]"
          >
            <Shirt size={18} />
            My Wardrobe
          </Link>

        </div>

        {/* Chat container */}
        <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">

          {/* Chat header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 p-5">

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-[#EEE9FA] p-3">

                <Bot
                  size={26}
                  className="text-[#8170C4]"
                />

              </div>

              <div>

                <h2 className="font-semibold text-[#172A4B]">
                  Styra — Fashion Assistant
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Personalized wardrobe assistance
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={clearChat}
              disabled={
                loading ||
                messages.length === 1
              }
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >

              <Trash2 size={16} />

              Clear Chat

            </button>

          </div>

          {/* Chat messages */}
          <div
            aria-label="Chat messages"
            aria-live="polite"
            className="flex h-[450px] flex-col gap-5 overflow-y-auto bg-gray-50 p-4 sm:p-6"
          >

            {messages.map((message) => (

              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                {/* Assistant icon */}
                {message.role === "assistant" && (

                  <div className="shrink-0 rounded-full bg-[#EEE9FA] p-2">

                    <Bot
                      size={20}
                      className="text-[#8170C4]"
                    />

                  </div>

                )}

                {/* Message bubble */}
                <div
                  className={`max-w-[85%] break-words rounded-xl px-4 py-3 text-sm leading-relaxed sm:max-w-[80%] ${
                    message.role === "user"
                      ? "bg-[#172A4B] text-white"
                      : "border border-gray-100 bg-white text-gray-700 shadow-sm"
                  }`}
                >

                  <p className="whitespace-pre-wrap">
                    {message.text}
                  </p>

                  {/* Wardrobe context */}
                  {message.role === "assistant" &&
                    message.usedItemIds &&
                    message.usedItemIds.length > 0 && (

                      <div className="mt-3 border-t border-gray-100 pt-3">

                        <div className="flex items-center gap-2 text-xs font-medium text-[#8170C4]">

                          <Shirt size={15} />

                          Uses {message.usedItemIds.length}{" "}
                          item
                          {message.usedItemIds.length === 1
                            ? ""
                            : "s"}{" "}
                          from your wardrobe

                        </div>

                        <Link
                          href="/user/wardrobe"
                          className="mt-2 inline-block text-xs font-medium text-[#172A4B] underline"
                        >
                          View My Wardrobe
                        </Link>

                      </div>

                    )}

                </div>

                {/* User icon */}
                {message.role === "user" && (

                  <div className="shrink-0 rounded-full bg-[#E5E7EB] p-2">

                    <User
                      size={20}
                      className="text-[#172A4B]"
                    />

                  </div>

                )}

              </div>

            ))}

            {/* Suggested questions */}
            {messages.length === 1 &&
              !loading && (

                <div className="ml-0 mt-2 sm:ml-12">

                  <p className="mb-3 text-xs font-medium text-gray-500">
                    Try asking Styra:
                  </p>

                  <div className="flex flex-wrap gap-2">

                    {suggestedQuestions.map(
                      (question) => (

                        <button
                          key={question}
                          type="button"
                          onClick={() =>
                            void sendMessage(
                              question
                            )
                          }
                          className="rounded-full border border-[#DCD3EF] bg-white px-4 py-2 text-left text-xs text-[#172A4B] transition hover:bg-[#EEE9FA]"
                        >
                          {question}
                        </button>

                      )
                    )}

                  </div>

                </div>

              )}

            {/* Loading indicator */}
            {loading && (

              <div
                role="status"
                className="flex items-start gap-3"
              >

                <div className="rounded-full bg-[#EEE9FA] p-2">

                  <Bot
                    size={20}
                    className="text-[#8170C4]"
                  />

                </div>

                <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">

                  <Loader2
                    size={18}
                    className="animate-spin text-[#8170C4]"
                  />

                  <span className="text-sm text-gray-500">
                    Styra is thinking...
                  </span>

                </div>

              </div>

            )}

            {/* Error message */}
            {error && (

              <div
                role="alert"
                className="rounded-xl border border-red-100 bg-red-50 p-4"
              >

                <div className="flex items-start gap-2">

                  <AlertCircle
                    size={20}
                    className="shrink-0 text-red-600"
                  />

                  <div>

                    <p className="text-sm font-semibold text-red-700">
                      Unable to get a response
                    </p>

                    <p className="mt-1 text-sm text-red-600">
                      {error}
                    </p>

                    {lastQuestion && (

                      <button
                        type="button"
                        onClick={retryMessage}
                        disabled={loading}
                        className="mt-3 rounded-lg bg-red-100 px-4 py-2 text-xs font-medium text-red-700 hover:bg-red-200"
                      >
                        Try Again
                      </button>

                    )}

                  </div>

                </div>

              </div>

            )}

            {/* Scroll target */}
            <div ref={messagesEndRef} />

          </div>

          {/* Message input */}
          <form
            onSubmit={handleSend}
            className="border-t border-gray-100 bg-white p-4"
          >

            <div className="flex items-end gap-3">

              <textarea
                value={input}
                onChange={(event) =>
                  setInput(event.target.value)
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey &&
                    !event.nativeEvent.isComposing
                  ) {
                    event.preventDefault();

                    if (!loading) {
                      void sendMessage(input);
                    }
                  }
                }}
                placeholder="Ask Styra about fashion..."
                aria-label="Your fashion question"
                maxLength={1000}
                rows={2}
                disabled={loading}
                className="min-w-0 flex-1 resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm text-[#172A4B] outline-none focus:border-[#8170C4] disabled:bg-gray-50"
              />

              <Button
                type="submit"
                size="medium"
                disabled={
                  !input.trim() ||
                  loading
                }
              >

                <span className="inline-flex items-center gap-2">

                  {loading ? (

                    <Loader2
                      size={18}
                      className="animate-spin"
                    />

                  ) : (

                    <Send size={18} />

                  )}

                  <span className="hidden sm:inline">
                    {loading
                      ? "Sending..."
                      : "Send"}
                  </span>

                </span>

              </Button>

            </div>

            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">

              <p className="text-xs text-gray-400">
                Enter to send · Shift + Enter for a new line
              </p>

              <p className="text-xs text-gray-400">
                {input.length}/1000
              </p>

            </div>

          </form>

        </section>

        {/* Information card */}
        <div className="mt-6 rounded-xl border border-[#E5DDF4] bg-[#F3F0FA] p-5">

          <div className="flex items-center gap-2">

            <Sparkles
              size={20}
              className="text-[#8170C4]"
            />

            <h3 className="font-semibold text-[#172A4B]">
              Discover more with SmartWardrobe
            </h3>

          </div>

          <p className="mt-2 text-sm text-gray-600">
            Explore personalized outfit recommendations
            or plan clothing for your next trip.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">

            <Link
              href="/user/recommendation"
              className="inline-flex items-center gap-2 rounded-lg bg-[#172A4B] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#283F65]"
            >

              <Sparkles size={16} />

              Outfit Recommendations

            </Link>

            <Link
              href="/user/trip-planner"
              className="inline-flex items-center gap-2 rounded-lg border border-[#172A4B] px-4 py-2.5 text-sm font-medium hover:bg-white"
            >
              Trip Planner
            </Link>

          </div>

        </div>

        <p className="mt-4 text-xs text-gray-500">
          Styra provides fashion suggestions using
          available wardrobe information. Chat messages
          are kept on this page during your current
          session.
        </p>

      </div>

    </main>
  );
}
