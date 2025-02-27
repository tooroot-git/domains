import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { nanoid } from "nanoid";

interface Message {
  type: "user" | "assistant";
  content: string;
}

export function ChatWidget({ domain }: { domain: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sessionId] = useState(() => nanoid());
  const [isTyping, setIsTyping] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [hasInitialMessage, setHasInitialMessage] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat container to keep latest messages visible
  const scrollChatToBottom = () => {
    const chatContainer = document.querySelector('.chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  };

  // Keep chat scrolled to bottom during typing and when new messages appear
  useEffect(() => {
    scrollChatToBottom();
  }, [messages, currentText]);

  const formatMessageInRealTime = (text: string) => {
    return text.split('\n').map(line => {
      line = line.trim();
      // Format bullet points consistently
      if (line.startsWith('•')) {
        line = line.replace(/^•\s*/, '• ');
      }
      // Apply formatting in real-time
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Bold
      line = line.replace(/\n/g, '<br>'); // New lines
      return line;
    }).join('<br>');
  };

  const simulateTyping = async (text: string) => {
    setIsTyping(true);
    setCurrentText("");

    // Start typing without forcing scroll
    
    const words = text.split(/(\s+)/); // Split by whitespace but keep the spaces
    let currentIndex = 0;
    let formattedText = "";

    const typeWord = () => {
      return new Promise<void>((resolve) => {
        if (currentIndex < words.length) {
          const word = words[currentIndex];
          formattedText += word;
          setCurrentText(formatMessageInRealTime(formattedText));
          currentIndex++;

          // Natural typing speed with appropriate pauses
          const delay = word.includes('\n') ? 400 :
            word.trim().length <= 3 ? 80 :
            word.trim().length <= 6 ? 120 : 160;

          setTimeout(resolve, delay);
        } else {
          resolve();
        }
      });
    };

    while (currentIndex < words.length) {
      await typeWord();
    }

    setIsTyping(false);
    // Only add complete message when typing is finished
    setMessages(prev => [...prev, {
      type: "assistant",
      content: formatMessageInRealTime(text)
    }]);
    setCurrentText("");
  };

  useEffect(() => {
    if (!domain || hasInitialMessage) return;

    setHasInitialMessage(true);
    fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "",
        sessionId,
        domain
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (!data.message) throw new Error("No message received");
        simulateTyping(data.message);
      })
      .catch((error) => {
        console.error("Chat error:", error);
        toast({
          title: "Connection Error",
          description: "Unable to connect to chat service. Please try again.",
          variant: "destructive",
        });
      });
  }, [domain, sessionId, toast, hasInitialMessage]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { type: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          sessionId,
          domain
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          toast({
            title: "Chat limit reached",
            description: data.message,
            variant: "destructive",
          });
        } else {
          throw new Error(data.message || "Failed to send message");
        }
        return;
      }

      await simulateTyping(data.message);
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-[#1a1b26] rounded-lg shadow-xl border border-slate-700/50 w-full max-w-3xl mx-auto">
      <div className="border-b border-slate-700/50 p-2 flex justify-between items-center">
        <h2 className="text-sm font-medium text-center text-slate-200 flex-1">
          Speak with Our Domain Expert About {domain}
        </h2>
        <Button 
          onClick={() => {
            setMessages([]);
            setHasInitialMessage(false);
          }}
          size="sm"
          variant="ghost" 
          className="h-7 w-7 p-0 text-slate-400 hover:text-slate-100" 
          aria-label="Refresh chat"
          title="Refresh chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-cw"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
        </Button>
      </div>

      <div className="h-[300px] overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent chat-container">
        {messages.map((message, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${
              message.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.type === "user"
                  ? "bg-indigo-600 text-white text-right"
                  : "bg-[#24283b] text-slate-100 text-left"
              } shadow-md text-sm leading-relaxed whitespace-pre-wrap tracking-wide`}
              dangerouslySetInnerHTML={{
                __html: message.content
              }}
            />
          </motion.div>
        ))}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex justify-start typing-container"
          >
            <div 
              className="max-w-[80%] p-3 rounded-lg bg-[#24283b] text-slate-100 shadow-md text-sm leading-relaxed text-left"
            >
              <div dangerouslySetInnerHTML={{ 
                __html: currentText + '<span class="animate-pulse">▋</span>'
              }} />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-slate-700/50">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Ask about this domain..."
            className="bg-[#24283b] border-slate-700/50 text-slate-100 placeholder-slate-400 text-sm"
            aria-label={`Ask a question about ${domain}`}
            id="chat-input"
            autoComplete="off"
          />
          <Button
            onClick={sendMessage}
            className="shrink-0 bg-indigo-600 hover:bg-indigo-700"
            size="sm"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}