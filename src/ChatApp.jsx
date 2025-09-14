import { useState } from "react";

export default function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Call your backend API
  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message to chat
    const newMessages = [...messages, { sender: "You", text: input }];
    setMessages(newMessages);
    setInput("");

    try {
      // Replace URL with your backend endpoint
      const response = await fetch("https://chat-backend-five-amber.vercel.app/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();

      // Add assistant reply
      setMessages([...newMessages, { sender: "AI", text: data.reply }]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { sender: "AI", text: "Error contacting server." },
      ]);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>My Chat Assistant</h1>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "1rem",
          height: 300,
          overflowY: "auto",
          marginBottom: "1rem",
        }}
      >
        {messages.map((msg, idx) => (
          <p key={idx}>
            <strong>{msg.sender}: </strong>
            {msg.text}
          </p>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{ width: "80%", padding: "0.5rem" }}
        />
        <button type="submit" style={{ padding: "0.5rem 1rem", marginLeft: 8 }}>
          Send
        </button>
      </form>
    </div>
  );
}
