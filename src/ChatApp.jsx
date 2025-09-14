import { useState, useRef, useEffect } from "react";

export default function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const quickSuggestions = [
    "Hello!",
    "Give me optimization recommendations based on the above data",
    "How can I reduce query execution time for a table with frequent writes?",
    "What are the best practices for indexing a large MySQL table",
    "Should I use denormalization to improve performance?",
    "How can I monitor and tune database performance over time?"
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const clearChat = () => setMessages([]);

  async function sendMessage(e, messageText = null) {
    e?.preventDefault();
    const text = messageText || input;
    if (!text.trim()) return;

    const userMessage = { sender: "YOU", text, time: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://chat-backend-five-amber.vercel.app/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();

      const fullText = data.reply;
      let currentText = "";
      setMessages((prev) => [...prev, { sender: "AI", text: "", time: new Date() }]);

      for (let i = 0; i < fullText.length; i++) {
        await new Promise((r) => setTimeout(r, 20));
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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMessages((prev) => [
      ...prev,
      { sender: "YOU", text: `📁 Uploaded file: ${file.name}`, time: new Date() },
    ]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 flex flex-col items-center justify-center p-6 font-sans">
      <h1 className="text-4xl font-bold text-indigo-700 mb-2 text-center">
        💾 Database Optimization Recommender System
      </h1>
      <p className="text-gray-700 max-w-lg text-center mb-6">
        Ask questions, upload files, or click a suggested prompt to see AI recommendations instantly!
      </p>

      <div className="w-full max-w-xl bg-white shadow-2xl rounded-2xl flex flex-col p-6">
        {/* Quick Suggestions */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {quickSuggestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(null, q)}
              className="bg-indigo-200 hover:bg-indigo-300 text-indigo-900 px-3 py-1 rounded-full text-sm transition"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-4 max-h-[400px]">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === "YOU" ? "justify-end" : "justify-start"}`}>
              <div className="flex flex-col max-w-[75%]">
                <span className={`font-semibold mb-1 ${msg.sender === "YOU" ? "text-indigo-600 text-right" : "text-green-600 text-left"}`}>
                  {msg.sender}
                </span>
                <div
                  className={`px-4 py-2 rounded-2xl break-words shadow-sm ${msg.sender === "YOU" ? "bg-indigo-500 text-white rounded-br-none" : "bg-green-200 text-gray-900 rounded-bl-none"}`}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          {loading && <p className="text-gray-500 italic text-sm text-center">AI is typing... 🤖</p>}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={sendMessage} className="flex gap-2 mb-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-all"
          >
            Send
          </button>
        </form>

        {/* File Upload & Clear Chat */}
        <div className="flex gap-4 items-center justify-center mb-1">
          <label className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-xl cursor-pointer transition">
            📁 Upload File
            <input type="file" className="hidden" onChange={handleFileUpload} />
          </label>
          <button type="button" onClick={clearChat} className="text-gray-500 hover:underline">
            🗑 Clear Chat
          </button>
        </div>

        <p className="text-gray-400 text-xs mt-2 text-center">Made with ❤️ for Hackathon Presentation</p>
      </div>
    </div>
  );
}
