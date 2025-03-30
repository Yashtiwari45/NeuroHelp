import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { generateContent } from "../lib/gemini";
import { MessageSquare, Send, Sparkles } from "lucide-react";

const SAMPLE_QUESTIONS = [
  "What are the early signs of Alzheimer's disease?",
  "How accurate is brain scan analysis for Alzheimer's detection?",
  "What lifestyle changes can help prevent Alzheimer's?",
  "What's the difference between mild and moderate dementia?",
  "When should I consult a doctor about memory problems?",
  "How can I support a family member with Alzheimer's?",
];

function ChatbotPage() {
  const [messages, setMessages] = useState(
    [] as Array<{ role: "user" | "assistant"; content: string }>
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSampleQuestion = (question: string) => {
    setInput(question);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setLoading(true);

    try {
      const request = {
        subject: "Neurology",
        topic: input.trim(),
        ageGroup: "N/A",
        language: "English",
        additionalInfo: "Answer as a neuro specialist.",
        generateVideo: false,
      };

      const result = await generateContent(request);

      const lines: string[] = [];
      if (result.introduction) lines.push(`**Introduction:** ${result.introduction}`);
      if (result.keyPoints && result.keyPoints.length > 0)
        lines.push(`**Key Points:** ${result.keyPoints.join(", ")}`);
      if (result.activities && result.activities.length > 0)
        lines.push(`**Activities:** ${result.activities.join(", ")}`);
      if (result.resources && result.resources.length > 0)
        lines.push(`**Resources:** ${result.resources.join(", ")}`);
      if (result.videoScript) lines.push(`**Video Script:** ${result.videoScript}`);
      if (result.codeSnippet && result.codeSnippet !== "N/A")
        lines.push(`**Code Snippet:** ${result.codeSnippet}`);
      if (result.videoUrl && result.videoUrl !== "N/A")
        lines.push(`**Video URL:** ${result.videoUrl}`);

      const assistantReply = lines.join("\n\n").trim();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: assistantReply },
      ]);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, there was an error. Please try again.",
        },
      ]);
    } finally {
      setInput("");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-blue-400" />
          AI Assistant
        </h1>
        <p className="text-gray-400">
          Ask questions about Alzheimer's disease, early detection, or get help interpreting results.
        </p>
      </div>

      <div className="bg-gray-800/50 rounded-xl h-[500px] flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-400">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <p>Try asking one of these questions:</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {SAMPLE_QUESTIONS.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSampleQuestion(question)}
                    className="text-left p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors text-gray-300 hover:text-white active:bg-blue-500 active:text-white"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${message.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 text-gray-200"
                  }`}
              >
                {message.role === "assistant" ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                  </ReactMarkdown>
                ) : (
                  message.content
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-700 text-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatbotPage;