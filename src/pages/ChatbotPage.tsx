import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MessageSquare, Send, Sparkles } from 'lucide-react';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Validate API key
if (!GEMINI_API_KEY) {
  console.error('Gemini API key is not set. Please add VITE_GEMINI_API_KEY to your .env file');
}

const SAMPLE_QUESTIONS = [
  "What are the early signs of Alzheimer's disease?",
  "How accurate is brain scan analysis for Alzheimer's detection?",
  "What lifestyle changes can help prevent Alzheimer's?",
  "What's the difference between mild and moderate dementia?",
  "When should I consult a doctor about memory problems?",
  "How can I support a family member with Alzheimer's?"
];

function ChatbotPage() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSampleQuestion = (question: string) => {
    setInput(question);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    if (!GEMINI_API_KEY) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Error: Gemini API key is not configured. Please check your environment variables.'
      }]);
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      // Initialize Gemini API with environment variable
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      // Create a context-aware prompt
      const prompt = `You are an AI assistant specialized in Alzheimer's disease detection and early diagnosis. 
      You have access to a machine learning model that can analyze brain scans and classify them into four categories:
      - Non demented
      - Very mildly demented
      - Mildly demented
      - Moderately demented

      Your role is to:
      1. Help users understand their brain scan results
      2. Explain the different stages of Alzheimer's disease
      3. Provide information about early detection methods
      4. Suggest lifestyle changes and preventive measures
      5. Recommend when to consult healthcare professionals
      6. Answer general questions about Alzheimer's disease

      Important guidelines:
      - Always emphasize that your advice is for informational purposes only
      - Recommend consulting healthcare professionals for accurate diagnosis
      - Be empathetic and supportive in your responses
      - Use clear, simple language to explain medical concepts
      - Focus on evidence-based information

      User question: ${userMessage}

      Please provide a helpful, accurate, and empathetic response.`;

      console.log('Sending request to Gemini API...');
      const result = await model.generateContent(prompt);
      console.log('Received response from Gemini API');
      const response = await result.response;
      const text = response.text();
      console.log('Response text:', text);

      setMessages(prev => [...prev, { role: 'assistant', content: text }]);
    } catch (error) {
      console.error('Detailed error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `I apologize, but I'm having trouble processing your request at the moment. This could be due to:
        1. A temporary connection issue
        2. The complexity of your question
        3. A technical limitation

        Please try:
        1. Rephrasing your question
        2. Breaking it down into smaller parts
        3. Or try again in a few moments

        If the issue persists, you can also:
        - Consult our FAQ section
        - Contact our support team
        - Or speak with a healthcare professional for immediate concerns`
      }]);
    } finally {
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
                    className="text-left p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors text-gray-300 hover:text-white"
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
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-200'
                }`}
              >
                {message.content}
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