
import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { MessageCircle, HelpCircle } from "lucide-react";

type Message = {
  sender: "user" | "bot";
  text: string;
};

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hi there! 👋 How can I assist you today? You can ask me about service availability, terms, tracking your request, or any other query.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const answer = await fetchChatbotAnswer(newMessages);
      setMessages([...newMessages, { sender: "bot", text: answer }]);
    } catch (e) {
      setMessages([
        ...newMessages,
        { sender: "bot", text: "Sorry, I'm having trouble answering right now." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchChatbotAnswer = async (msgs: Message[]): Promise<string> => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) return "Chatbot error: API key not set.";
    const userMessages = msgs.map((m) => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text,
    }));

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful website assistant for an online roadside assistance and service provider. Respond informatively to questions about terms, how to get help, query tracking, and general doubts. If asked about privacy, pricing, or contacting support, explain helpfully. Always use concise, clear language.",
          },
          ...userMessages,
        ],
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      return "Sorry, I'm having trouble connecting right now.";
    }
    const data = await response.json();
    return (
      data.choices?.[0]?.message?.content ||
      "Sorry, I couldn't find an answer to your question."
    );
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          className="fixed bottom-6 right-6 z-50 bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg flex items-center transition-all"
          aria-label="Open Chatbot"
          onClick={() => setOpen(true)}
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}
      {/* Chat window */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-80 max-w-[90vw] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col animate-fade-in">
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <span className="flex items-center gap-2 font-bold">
              <HelpCircle className="h-5 w-5 text-red-600" /> Chatbot Assistant
            </span>
            <button
              className="text-gray-500 hover:text-red-600"
              onClick={() => setOpen(false)}
              aria-label="Close Chatbot"
            >
              ×
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2" style={{ minHeight: 200, maxHeight: 300 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`rounded-lg px-3 py-2 max-w-[80%] text-sm ${
                    m.sender === "user"
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-600 rounded-lg px-3 py-2 text-sm animate-pulse">
                  Typing...
                </div>
              </div>
            )}
          </div>
          <form
            className="flex gap-2 p-3 border-t"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
              inputRef.current?.focus();
            }}
          >
            <Input
              ref={inputRef}
              type="text"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              autoFocus
              className="flex-1"
            />
            <Button
              type="submit"
              className="bg-red-600 hover:bg-red-700"
              disabled={loading || !input.trim()}
            >
              Send
            </Button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
