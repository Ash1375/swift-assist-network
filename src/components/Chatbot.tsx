
import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { MessageCircle, HelpCircle } from "lucide-react";

type Message = {
  sender: "user" | "bot";
  text: string;
};

function getLocalBotResponse(input: string): string {
  const lower = input.toLowerCase();
  // Very basic keyword matching. Expand as desired!
  if (lower.includes("terms") || lower.includes("conditions")) {
    return "Our terms and conditions ensure fair service and transparent billing. You can view the detailed terms on our website or ask for specifics.";
  }
  if (lower.includes("availability") || lower.includes("working hours") || lower.includes("open")) {
    return "We're available 24/7 for roadside assistance! You can request help at any time.";
  }
  if (lower.match(/track/i) || lower.includes("status") || lower.includes("request id") || lower.includes("follow")) {
    return "To track your request, please provide your request ID or visit the Request Tracking page from the main menu.";
  }
  if (lower.includes("contact")) {
    return "You can contact our customer support via the Contact page or call our helpline at 1800-123-4567.";
  }
  if (lower.includes("pricing") || lower.includes("cost") || lower.includes("charge") || lower.includes("fee")) {
    return "Our pricing varies by service type and location. Get an instant quote on the website or ask about a specific service!";
  }
  if (lower.includes("privacy")) {
    return "We respect your privacy and only use your data to provide our services. Check our Privacy Policy for details.";
  }
  if (lower.includes("help") || lower.includes("assist")) {
    return "How can I help you today? You can ask me about service availability, getting help, terms & conditions, pricing, or tracking your request.";
  }
  if (lower.includes("insurance")) {
    return "We work with several insurance partners. If your coverage includes roadside assistance, let us know and we’ll coordinate directly!";
  }
  if (
    lower.includes("subscription") ||
    lower.includes("plan") ||
    lower.includes("member") ||
    lower.includes("join")
  ) {
    return "You can subscribe to our membership plans for extra savings and priority support. Visit the Subscription page or ask for more info!";
  }
  if (lower.match(/(thank you|thanks|ty|thx)/i)) {
    return "You're welcome! If you have any other questions, just ask.";
  }
  if (lower.match(/hi|hello|hey|greetings/)) {
    return "Hello! How can I assist you today?";
  }
  // Fallback answer
  return "I'm here to help with any questions about our services, terms, tracking, or support. Could you please clarify your question?";
}

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
    const newMessages: Message[] = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const answer = getLocalBotResponse(input);
      setMessages([...newMessages, { sender: "bot", text: answer }]);
      setLoading(false);
    }, 800); // Simulate response delay for realism
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
