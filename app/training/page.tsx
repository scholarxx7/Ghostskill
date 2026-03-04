"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Message {
    id: string;
    type: "user" | "ai";
    content: string;
    persona?: string;
    timestamp: Date;
    wisdomSource?: string; // We can attach wisdom context if we want UI to reflect it
}

// Single Persona Data
const theFriend = {
    id: "friend",
    name: "The Friend",
    color: "from-blue-500 to-purple-600",
    approach: "strategic, bold, disciplined, and decisive",
};

// Mock AI responses for fallback
const generateMockResponse = (question: string): string => {
    const responses = [
        "Draw upon your discipline. You must plan ten steps ahead, but execute the very next step with overwhelming force.",
        "Fear is the only enemy here. Release what you cannot control, and attack the decisive point immediately.",
        "Your strategic foresight is required. Understand the terrain, control your mind, and the victory is yours.",
        "Before making a move, consider: Are you acting out of emotion or logic? Emulate the stoics, but strike like a conqueror."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
};

export default function TrainingRoom() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [aiEngine, setAiEngine] = useState<'gemini' | 'ollama' | 'nlp'>('ollama');
    const [ollamaModel, setOllamaModel] = useState<string>('llama3.2:latest');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            type: "user",
            content: input,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        const currentInput = input;
        setInput("");
        setIsLoading(true);

        try {
            // Call the real backend API, targeting 'friend'
            const response = await fetch('http://localhost:5000/api/chat/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: currentInput,
                    personaIds: ['friend'],
                    aiEngine,
                    ollamaModel: aiEngine === 'ollama' ? ollamaModel : undefined
                })
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();

            if (data.success && data.data.aiResponses && data.data.aiResponses.length > 0) {
                const resp = data.data.aiResponses[0];

                setTimeout(() => {
                    const aiMessage: Message = {
                        id: `ai-${Date.now()}`,
                        type: "ai",
                        content: resp.response,
                        persona: resp.personaName,
                        timestamp: new Date(),
                    };
                    setMessages((prev) => [...prev, aiMessage]);
                }, 400); // slight stagger for realism
            }
        } catch (error) {
            console.error('Error calling API:', error);

            // Fallback to mock responses if API fails
            setTimeout(() => {
                const aiMessage: Message = {
                    id: `ai-${Date.now()}`,
                    type: "ai",
                    content: generateMockResponse(currentInput),
                    persona: "The Friend",
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, aiMessage]);
            }, 500);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="min-h-screen bg-[#06060a] text-white font-sans flex flex-col">
            {/* Ambient Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '10s' }} />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '12s', animationDelay: '1s' }} />
            </div>

            {/* Navigation */}
            <nav className="relative z-10 px-6 py-4 lg:px-8 border-b border-white/5 backdrop-blur-md">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                            <span className="font-bold text-sm">G</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white group-hover:text-indigo-200 transition-colors">GhostSkill</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-[#0a0a0f]/80 p-1.5 rounded-full border border-white/5 backdrop-blur-md">
                            <div className="relative">
                                <select
                                    value={aiEngine}
                                    onChange={(e) => setAiEngine(e.target.value as 'gemini' | 'ollama' | 'nlp')}
                                    className="bg-transparent border-none pl-4 pr-8 py-1.5 text-sm focus:outline-none appearance-none cursor-pointer font-medium hover:text-indigo-300 transition-colors"
                                >
                                    <option value="ollama" className="bg-[#0a0a0f]">🤖 Local Ollama</option>
                                    <option value="gemini" className="bg-[#0a0a0f]">⚡ Google Gemini</option>
                                    <option value="nlp" className="bg-[#0a0a0f]">📚 Wisdom Only (NLP)</option>
                                </select>
                                <svg className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>

                            {aiEngine === 'ollama' && (
                                <>
                                    <div className="w-[1px] h-4 bg-white/20"></div>
                                    <div className="relative">
                                        <select
                                            value={ollamaModel}
                                            onChange={(e) => setOllamaModel(e.target.value)}
                                            className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-full pl-3 pr-8 py-1 text-xs focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer transition-colors text-indigo-200"
                                        >
                                            <option value="llama3.2:latest" className="bg-[#0a0a0f]">llama3.2</option>
                                            <option value="phi3:latest" className="bg-[#0a0a0f]">phi3</option>
                                            <option value="gemma3:4b" className="bg-[#0a0a0f]">gemma3:4b</option>
                                            <option value="qwen3:4b" className="bg-[#0a0a0f]">qwen3:4b</option>
                                        </select>
                                        <svg className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </>
                            )}
                        </div>
                        <Link
                            href="/reflection"
                            className="hidden sm:inline-flex px-5 py-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/5 transition-all text-sm font-medium hover:border-white/20"
                        >
                            Reflection Journal
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Main Chat Area */}
            <main className="relative z-10 flex-1 flex flex-col max-w-4xl mx-auto w-full pt-6 pb-2">
                <div className="flex-1 overflow-y-auto px-4 sm:px-6 space-y-6 fancy-scrollbar">

                    {messages.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-center px-4 animate-in fade-in duration-700 slide-in-from-bottom-8">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-[1px] mb-8 shadow-[0_0_50px_rgba(99,102,241,0.3)]">
                                <div className="w-full h-full rounded-full bg-[#06060a] flex items-center justify-center text-4xl font-bold">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">F</span>
                                </div>
                            </div>
                            <h2 className="text-3xl font-bold mb-3 tracking-tight">The Training Room</h2>
                            <p className="text-gray-400 max-w-lg mx-auto text-lg leading-relaxed mb-10">
                                You are consulting with <span className="text-indigo-300 font-medium">The Friend</span>. State your challenge clearly, and receive synthesized wisdom from history's most brilliant strategists.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl text-left">
                                {[
                                    "I need to make a highly risky career pivot.",
                                    "My team lacks discipline and motivation.",
                                    "I feel overwhelmed by circumstances I can't control.",
                                    "How do I outmaneuver a well-funded competitor?"
                                ].map((suggestion, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setInput(suggestion)}
                                        className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-indigo-500/30 transition-all text-sm text-gray-300 hover:text-white"
                                    >
                                        <span className="opacity-50 mr-2">→</span> {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.type === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-4 duration-500`}
                        >
                            <div className={`flex max-w-[85%] sm:max-w-[75%] ${message.type === "ai" ? "gap-4" : ""}`}>
                                {message.type === "ai" && (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0 flex items-center justify-center text-sm font-bold shadow-lg mt-1">
                                        F
                                    </div>
                                )}
                                <div
                                    className={`px-5 py-4 rounded-3xl ${message.type === "user"
                                        ? "bg-indigo-600 text-white rounded-tr-sm shadow-[0_4px_20px_rgba(79,70,229,0.3)]"
                                        : "bg-white/5 border border-white/10 rounded-tl-sm backdrop-blur-md"
                                        }`}
                                >
                                    {message.type === "ai" && (
                                        <div className="text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-1.5 flex items-center gap-2">
                                            The Friend
                                            <span className="text-gray-500 font-normal text-[10px]">Historical Synthesis</span>
                                        </div>
                                    )}
                                    <p className="leading-relaxed whitespace-pre-wrap text-[15px]">{message.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start animate-in fade-in duration-300">
                            <div className="flex gap-4 max-w-[80%]">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0 flex items-center justify-center text-sm font-bold shadow-lg mt-1 opacity-50">
                                    F
                                </div>
                                <div className="bg-white/5 border border-white/10 px-5 py-4 rounded-3xl rounded-tl-sm backdrop-blur-md flex items-center h-[52px]">
                                    <div className="flex gap-1.5">
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                                        <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} className="h-4" />
                </div>

                {/* Input Area */}
                <div className="px-4 sm:px-6 py-4 bg-gradient-to-t from-[#06060a] to-transparent sticky bottom-0">
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-20 group-focus-within:opacity-40 transition-opacity duration-500"></div>
                        <div className="relative flex items-end gap-2 bg-[#0a0a0f] border border-white/10 rounded-3xl py-2 px-3 focus-within:border-indigo-500/50 transition-colors shadow-2xl">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Consult The Friend..."
                                className="flex-1 bg-transparent px-3 py-3 resize-none focus:outline-none max-h-32 min-h-[52px] text-[15px] placeholder:text-gray-600 fancy-scrollbar"
                                rows={1}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!input.trim() || isLoading}
                                className="mb-1 p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all disabled:opacity-30 disabled:cursor-not-allowed group/btn"
                                aria-label="Send message"
                            >
                                <svg className="w-5 h-5 text-indigo-300 group-hover/btn:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                            </button>
                        </div>
                    </div>

                    {/* Status Footer */}
                    <div className="mt-4 flex items-center justify-center gap-3 text-[11px] font-medium text-gray-500">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                            <span>Engine: {aiEngine.toUpperCase()} {aiEngine === 'ollama' ? `(${ollamaModel})` : ''}</span>
                        </div>
                        <span className="opacity-40">•</span>
                        <span>4 Minds Synthesized</span>
                    </div>
                </div>
            </main>

            {/* Custom Styles for this page */}
            <style jsx global>{`
                .fancy-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .fancy-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .fancy-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .fancy-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>
    );
}
