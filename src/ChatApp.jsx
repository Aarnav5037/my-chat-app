import { useState, useRef, useEffect } from "react";

export default function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Clear chat function
  const clearChat = () => {
    setMessages([]);
  };

  // Emoji reactions
  const addReaction = (idx, emoji) => {
    setMessages((prev) =>
      prev.map((msg, i) =>
        i === idx
          ? { ...msg, text: msg.text + " " + emoji }
          : msg
      )
    );
  };

  // Send message to backend
  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: "You", text: input, time: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Simulate typing effect
      const res = await fetch(
        "https://chat-backend-five-amber.vercel.app/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: input }),
        }
      );
      const data = await res.json();

      // Animate AI typing
      const fullText = data.reply;
      let currentText = "";
      setMessages((prev) => [
        ...prev,
        { sender: "AI", text: "", time: new Date() },
      ]);

      for (let i = 0; i < fullText.length; i++) {
        await new Promise((r) => setTimeout(r, 25));
        currentText += fullText[i];
        setMessages((prev) =>
          prev.map((msg, idx) =>
            idx === prev.length - 1 ? { ...msg, text: currentText } : msg
          )
        );
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "AI", text: "❌ Error contacting server.", time: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-indigo-50 flex flex-col items-center p-4 font-sans">
      {/* Header & Intro */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-indigo-600 mb-2">
          💬 My Smart Chat Assistant
        </h1>
        <p className="text-gray-700 max-w-md mx-auto">
          This AI-powered chat assistant can answer your questions, give
          recommendations, and help you with quick insights. Type your message
          below to start chatting!
        </p>
      </div>

      {/* Chat Box */}
      <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl p-6 flex flex-col flex-1">
        <div className="flex-1 overflow-y-auto mb-4 space-y-2">
          {messages.map((msg, idx) => (
            <div key={idx} className="relative">
              <div
                className={`p-3 rounded-xl max-w-[75%] break-words ${
                  msg.sender === "You"
                    ? "bg-gradient-to-r from-indigo-400 to-purple-500 text-white self-end ml-auto"
                    : "bg-gradient-to-r from-green-200 to-teal-300 text-gray-900 mr-auto"
                }`}
              >
                <p>{msg.text}</p>
                <span className="block text-xs mt-1 opacity-80">
                  {msg.time.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {/* Emoji reactions (only for AI messages) */}
              {msg.sender === "AI" && (
                <div className="absolute -bottom-5 flex space-x-1">
                  {["👍", "❤️", "😂", "🤔"].map((emoji) => (
                    <button
                      key={emoji}
                      className="text-xs"
                      onClick={() => addReaction(idx, emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          {loading && (
            <p className="text-sm text-gray-500 italic">AI is typing… 🤖</p>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="submit"
            className="bg-indigo-500 text-white px-4 py-2 rounded-xl hover:bg-indigo-600 transition-all"
          >
            Send
          </button>
        </form>

        {/* Quick Actions */}
        <div className="mt-4 flex justify-between text-sm text-gray-500">
          <button
            type="button"
            className="hover:underline"
            onClick={clearChat}
          >
            🗑 Clear Chat
          </button>
          <span>💡 Tip: Try asking about anything!</span>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-4 text-gray-400 text-xs">
        Made with ❤️ using React and Vercel
      </p>
    </div>
  );
}
