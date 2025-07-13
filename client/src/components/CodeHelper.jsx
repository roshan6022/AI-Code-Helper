import React, { useState, useRef, useEffect } from "react";
import { explainCode, fixCode, completeCode } from "../api";
import SyntaxRenderer from "./SyntaxRenderer"; // adjust the path as needed

const modes = {
  explain: explainCode,
  fix: fixCode,
  complete: completeCode,
};

export default function CodeHelper() {
  const [mode, setMode] = useState("explain");
  const [input, setInput] = useState("");
  const [issue, setIssue] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (mode === "fix" && !issue.trim()) {
      setError("Please describe the issue.");
      return;
    }

    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");
    setError("");

    try {
      const handler = modes[mode];
      const result =
        mode === "fix" ? await handler(input, issue) : await handler(input);

      setMessages((prev) => [...prev, { sender: "assistant", text: result }]);
      setIssue("");
    } catch (err) {
      setError(err.message || "An unknown error occurred.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="flex flex-col w-full max-w-6xl h-[95vh] border border-gray-300 rounded-2xl bg-white text-black text-xl px-16 shadow-lg">
        {/* Header */}
        <header className="border-b border-gray-300 py-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">AI Code Helper</h1>
          <div className="relative">
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="appearance-none bg-black text-white rounded-lg px-6 py-3 text-lg pr-12"
            >
              {Object.keys(modes).map((m) => (
                <option key={m} value={m}>
                  {m[0].toUpperCase() + m.slice(1)}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </header>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-100 text-red-800 py-4 text-center text-lg font-medium">
            {error}
          </div>
        )}

        {/* Messages */}
        <div className="flex-grow overflow-auto py-8 space-y-6">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 text-lg">
              Start by typing your code snippet above ⌨️
            </div>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-3 py-2 leading-relaxed text-lg ${
                  msg.sender === "user"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <SyntaxRenderer text={msg.text} />
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="border-t border-gray-300 py-6 flex gap-4 items-center"
        >
          <textarea
            rows={1}
            className="flex-grow rounded-xl px-5 py-4 text-lg bg-gray-100 text-black focus:outline-none resize-none"
            placeholder="Type your code or message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setError("")}
          />
          {mode === "fix" && (
            <input
              className="rounded-xl px-5 py-4 text-lg bg-gray-100 text-black focus:outline-none"
              placeholder="Describe the issue"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              onFocus={() => setError("")}
            />
          )}
          <button
            type="submit"
            className="bg-black hover:bg-gray-900 text-white px-9 py-4   rounded-xl text-lg font-semibold"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
