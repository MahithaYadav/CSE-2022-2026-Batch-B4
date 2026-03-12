import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Bot, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { GoogleGenerativeAI } from "@google/generative-ai";
console.log("My API Key is:", import.meta.env.VITE_GEMINI_API_KEY);

type Msg = { role: "user" | "assistant"; content: string };

// Initialize Gemini (Ensure your .env file has VITE_GEMINI_API_KEY)
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export default function HealthChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "What are common symptoms of Jaundice?",
    "How to manage high blood pressure?",
    "Diet for Diabetes patients",
  ];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || isLoading) return;
    
    const userMsg: Msg = { role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      if (!API_KEY) throw new Error("API Key missing");

      // 1. Configure the model with a system instruction to keep it in character
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: "You are HealthHint AI, a helpful, empathetic medical assistant. Provide concise, easy-to-understand answers. Format using markdown. Always include a brief disclaimer that you are an AI and the user should consult a doctor for serious issues.",
      });

      // 2. Format our local state history into Gemini's required format
      const formattedHistory = messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

      // 3. Start the chat session with the formatted history
      const chat = model.startChat({
        history: formattedHistory,
      });

      // 4. Send the new message and await the stream/response
      const result = await chat.sendMessage(text.trim());
      const responseText = result.response.text();
      
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: responseText },
      ]);
    } catch (err) {
      console.error("Gemini API Error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Connection error or missing API key. Please check your .env file." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) {
    return (
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 rounded-2xl h-14 w-14 shadow-2xl gradient-medical text-white p-0 hover:scale-110 transition-transform"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[350px] sm:w-[400px] h-[550px] rounded-[2rem] border border-slate-200 bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-300">
      {/* Header */}
      <div className="gradient-medical text-white p-5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold">HealthHint AI</h3>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <p className="text-[10px] opacity-80 font-medium">Powered by Gemini</p>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white hover:bg-white/10 rounded-full"
          onClick={() => setOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 custom-scrollbar">
        {messages.length === 0 && (
          <div className="space-y-4 pt-4">
            <div className="bg-white border rounded-2xl p-4 shadow-sm">
              <p className="text-sm text-slate-600 leading-relaxed">
                Hello! I'm your **HealthHint AI**. I can help explain medical terms, suggest diets, or give general health tips. What's on your mind?
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Suggestions</p>
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="block w-full text-left text-xs px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-primary hover:text-primary transition-all shadow-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 mt-1">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                msg.role === "user"
                  ? "bg-primary text-white rounded-br-sm"
                  : "bg-white border border-slate-200 text-slate-700 rounded-bl-sm"
              }`}
            >
              {msg.role === "assistant" ? (
                <div className="prose prose-sm max-w-none dark:prose-invert prose-p:leading-relaxed prose-pre:bg-slate-800">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
             </div>
             <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 text-sm text-slate-400 flex items-center">
               Thinking...
             </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        className="p-4 bg-white border-t flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          className="flex-1 bg-slate-100 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
        />
        <Button type="submit" className="rounded-xl px-4 gradient-medical" disabled={!input.trim() || isLoading}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}