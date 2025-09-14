import { useState, useRef, useEffect } from "react";

export default function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const quickSuggestions = [
    "Hello!",
    "Give me optimization recommendations",
    "Explain reinforcement learning simply",
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const clearChat = () => setMessages([]);

  async function sendMessage(e, messageText = null) {
    e?.preventDefault();
    const text = messageText || input;
    if (!text.trim()) return;

    const userMessage = { sender: "You", text, time: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        "https://chat-backend-five-amber.vercel.app/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text }),
        }
      );
      const data = await res.json();

      const fullText = data.reply;
      let currentText = "";
      setMessages((prev) => [...prev, userMessage, { sender: "AI", text: "", time: new Date() }]);

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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    // Just display the uploaded file name in chat
    setMessages((prev) => [
      ...prev,
      { sender: "You", text: `📁 Uploaded file: ${file.name}`, time: new Date() },
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-6 font-sans">
      <h1 className="text-3xl font-bold text-indigo-600 mb-2 text-center">
        💬 My Smart Chat Assistant
      </h1>
      <p className="text-gray-700 max-w-md text-center mb-6">
        Ask questions, upload files, or click a suggested prompt to see AI responses instantly!
      </p>

      <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl flex flex-col p-6">
        {/* Quick Suggestions */}
        <div className="flex flex-wrap gap-2 mb-4">
          {quickSuggestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(null, q)}
              className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 px-3 py-1 rounded-full text-sm transition"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-4 max-h-[400px]">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`relative max-w-[70%] px-4 py-2 rounded-xl break-words
                  ${msg.sender === "You"
                    ? "bg-indigo-500 text-white rounded-br-none"
                    : "bg-green-200 text-gray-900 rounded-bl-none"
                }`}
              >
                <span className="block text-xs opacity-70 mb-1">{msg.sender}</span>
                {msg.text}
                <span className="block text-[10px] mt-1 opacity-50 text-right">
                  {msg.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          ))}
          {loading && <p className="text-gray-500 italic text-sm">AI is typing... 🤖</p>}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={sendMessage} className="flex gap-2 mb-2">
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

        {/* File Upload */}
        <div className="flex gap-2 items-center mb-3">
          <label className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-xl cursor-pointer transition">
            📁 Upload File
            <input type="file" className="hidden" onChange={handleFileUpload} />
          </label>
          <button type="button" onClick={clearChat} className="text-gray-500 hover:underline">
            🗑 Clear Chat
          </button>
        </div>

        <p className="text-gray-400 text-xs mt-1">Made with ❤️ using React & Vercel</p>
      </div>
    </div>
  );
}
