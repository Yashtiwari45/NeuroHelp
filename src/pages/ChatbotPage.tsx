import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
// This import now matches the new gemini.ts
import { generateContent } from "../lib/gemini"; 
import { MessageSquare, Send, Sparkles, Bot, User } from "lucide-react";

// --- INTERFACES ---
interface ChatContent {
  title: string;
  introduction: string;
  keyPoints: string[];
  activities: string[];
  resources: string[];
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string | ChatContent; // Content can be simple string (user) or object (AI)
}

const SAMPLE_QUESTIONS = [
  "What are the early signs of Alzheimer's disease?",
  "How accurate is brain scan analysis for Alzheimer's detection?",
  "What lifestyle changes can help prevent Alzheimer's?",
  "What's the difference between mild and moderate dementia?",
  "When should I consult a doctor about memory problems?",
  "How can I support a family member with Alzheimer's?",
];

function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSampleQuestion = (question: string) => {
    setInput(question);
    handleSubmit(null, question);
  };

  const handleSubmit = async (e: React.FormEvent | null, sampleQuestion?: string) => {
    if (e) e.preventDefault();
    
    const userInput = sampleQuestion || input;
    if (!userInput.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userInput,
    };
    
    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");
    setLoading(true);
    setShowTypingIndicator(true);

    try {
      // API call now returns the ChatContent object directly
      const parsedContent: ChatContent = await generateContent({
        topic: userInput,
        language: "en",
      });

      setShowTypingIndicator(false);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: parsedContent,
      };
      
      setMessages((prev) => [...prev, assistantMessage]);

    } catch (error: any) {
      setShowTypingIndicator(false);
      // This error handler prevents the white screen crash
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: {
          title: "Error",
          introduction: `Sorry, there was an error: ${error.message || 'Please try again.'}`,
          keyPoints: [],
          activities: [],
          resources: [],
        }
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // --- RENDERER COMPONENT ---
  const AssistantMessage = ({ content }: { content: ChatContent }) => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-blue-300">{content.title}</h3>
      
      {/* ========================================================== */}
      {/* --- FIX: TYPESCRIPT ERROR --- */}
      {/* We apply the 'prose' classes to a wrapper div, */}
      {/* not to ReactMarkdown itself. */}
      {/* ========================================================== */}
      <div className="prose prose-invert prose-p:text-gray-200">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content.introduction}
        </ReactMarkdown>
      </div>

      {content.keyPoints && content.keyPoints.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-200 mb-2">Key Points:</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-300">
            {content.keyPoints.map((point, i) => <li key={i}>{point}</li>)}
          </ul>
        </div>
      )}
      
      {content.activities && content.activities.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-200 mb-2">Suggested Activities:</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-300">
            {content.activities.map((activity, i) => <li key={i}>{activity}</li>)}
          </ul>
        </div>
      )}

      {content.resources && content.resources.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-200 mb-2">Helpful Resources:</h4>
          <ul className="list-disc list-inside space-y-1 text-blue-400">
            {content.resources.map((link, i) => (
              <li key={i}><a href={link} target="_blank" rel="noopener noreferrer" className="hover:underline">{link}</a></li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-w-4xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="text-center mb-8">
        <MessageSquare className="mx-auto h-12 w-12 text-blue-400" />
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Neuro-Sage Chatbot
        </h1>
        <p className="mt-4 text-lg text-gray-300">
          Ask me anything about Alzheimer's disease and cognitive health.
        </p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-6 p-6 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-xl custom-scrollbar">
        {messages.length === 0 && !loading && (
          <div className="text-center text-gray-400">
            <Sparkles className="mx-auto h-8 w-8 mb-2" />
            <h3 className="font-semibold">Start a conversation</h3>
            <p className="text-sm">Or try one of these sample questions:</p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {SAMPLE_QUESTIONS.slice(0, 3).map((q) => (
                <button
                  key={q}
                  onClick={() => handleSampleQuestion(q)}
                  className="bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm px-3 py-1.5 rounded-lg transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="flex-shrink-0 bg-blue-500 w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
                <Bot className="w-5 h-5" />
              </div>
            )}
            
            <div className={`max-w-xl p-4 rounded-xl shadow-md ${
              msg.role === 'user'
                ? 'bg-blue-600'
                : 'bg-gray-700'
            }`}>
              {/* This logic now correctly handles both user strings and AI objects */}
              {typeof msg.content === 'string' ? (
                <p>{msg.content}</p>
              ) : (
                <AssistantMessage content={msg.content as ChatContent} />
              )}
            </div>
            
            {msg.role === 'user' && (
              <div className="flex-shrink-0 bg-gray-600 w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-5 h-5" />
              </div>
            )}
          </div>
        ))}

        {showTypingIndicator && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0 bg-blue-500 w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
              <Bot className="w-5 h-5" />
            </div>
            <div className="max-w-xl p-4 rounded-xl shadow-md bg-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="mt-6">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-inner placeholder-gray-400"
              disabled={loading}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  handleSubmit(null);
                  e.preventDefault(); // Prevent newline on Enter
                }
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:shadow-blue-500/20 transform hover:scale-105"
            >
              <Send className={`w-5 h-5 ${loading ? 'animate-pulse' : ''}`} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatbotPage;
