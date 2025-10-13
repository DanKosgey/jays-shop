"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { Bot, MessageSquare, Send, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { aiChatbot } from "@/ai/flows/ai-chatbot-customer-support";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const sessionId = useRef(crypto.randomUUID());
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsLoading(true);
      setTimeout(() => {
        setMessages([
          {
            role: "assistant",
            content: "Hello! I'm RepairBot. How can I assist you today? You can ask about repair status, pricing, or our services.",
          },
        ]);
        setIsLoading(false);
      }, 1000);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const result = await aiChatbot({
        message: input,
        sessionId: sessionId.current,
      });
      const assistantMessage: Message = {
        role: "assistant",
        content: result.message,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("AI chat error:", error);
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: "There was a problem with the AI chat service. Please try again.",
      });
       const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I'm having a little trouble right now. Please try again in a moment.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="icon"
          className="rounded-full w-16 h-16 shadow-lg"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle chat widget"
        >
          {isOpen ? <X className="h-8 w-8" /> : <MessageSquare className="h-8 w-8" />}
        </Button>
      </div>
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-full max-w-sm">
          <Card className="flex flex-col h-[60vh] shadow-2xl">
            <CardHeader className="flex flex-row items-center gap-3">
               <Avatar>
                <AvatarFallback>
                  <Bot />
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-0.5">
                <CardTitle className="text-lg font-headline">RepairBot</CardTitle>
                <CardDescription>AI Customer Support</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-full" ref={scrollAreaRef}>
                <div className="p-6 space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex gap-3 text-sm",
                        message.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      {message.role === "assistant" && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>
                            <Bot className="w-5 h-5" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <p
                        className={cn(
                          "rounded-lg px-4 py-2 max-w-[80%]",
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
                      >
                        {message.content}
                      </p>
                       {message.role === "user" && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>
                            U
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                     <div className="flex gap-3 text-sm justify-start">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>
                            <Bot className="w-5 h-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="rounded-lg px-4 py-2 bg-muted flex items-center">
                            <Loader2 className="h-5 w-5 animate-spin"/>
                        </div>
                     </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="pt-4">
              <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
                <Input
                  id="message"
                  placeholder="Type your message..."
                  className="flex-1"
                  autoComplete="off"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading}>
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}
