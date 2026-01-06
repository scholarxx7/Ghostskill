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
}

interface PersonaResponse {
    personaId: string;
    personaName: string;
    response: string;
    color: string;
}

const personasData: Record<string, any> = {
    chanakya: {
        name: "Chanakya",
        color: "from-amber-500 to-orange-600",
        approach: "strategic and calculated",
    },
    bose: {
        name: "Subhas Chandra Bose",
        color: "from-emerald-500 to-teal-600",
        approach: "bold and revolutionary",
    },
    aurelius: {
        name: "Marcus Aurelius",
        color: "from-blue-500 to-indigo-600",
        approach: "philosophical and disciplined",
    },
    napoleon: {
        name: "Napoleon Bonaparte",
        color: "from-purple-500 to-violet-600",
        approach: "tactical and decisive",
    },
};

// Mock AI responses (in real app, this would call an AI API)
const generateMockResponse = (personaId: string, question: string): string => {
    const responses: Record<string, string[]> = {
        chanakya: [
            "Before making any decision, consider the long-term consequences. What appears beneficial today may prove harmful tomorrow. Study all sides carefully.",
            "The wise leader prepares for every outcome. Your challenge requires strategic analysis. What resources do you have, and who are your real allies?",
            "In matters of strategy, patience is your greatest weapon. Do not rush to action until you understand all variables at play.",
        ],
        bose: [
            "This situation demands courage and immediate action. Fear is the only enemy. What bold step have you been avoiding?",
            "Freedom requires sacrifice. What are you willing to give up to achieve your goal? Hesitation is the enemy of progress.",
            "Lead from the front. Show others the way through your actions, not just your words. Inspire through example.",
        ],
        aurelius: [
            "What aspect of this situation can you control? Focus your energy there. Release what lies beyond your influence.",
            "Your perception shapes your reality. How would you view this challenge if you saw it as an opportunity for growth?",
            "Discipline your mind first. External circumstances matter less than your internal response to them.",
        ],
        napoleon: [
            "Analyze the terrain of your situation. Where are the weak points? Where can you concentrate your force for maximum impact?",
            "Speed and decisiveness win battles. Once you have sufficient information, act boldly. Hesitation creates vulnerability.",
            "Every challenge is a battlefield. What is your objective? What are your resources? Now execute with precision.",
        ],
    };

    const personaResponses = responses[personaId] || ["I will consider your question carefully."];
    return personaResponses[Math.floor(Math.random() * personaResponses.length)];
};

export default function TrainingRoom() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [selectedPersonas, setSelectedPersonas] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [personaResponses, setPersonaResponses] = useState<PersonaResponse[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        // Get selected personas from localStorage
        const stored = localStorage.getItem("selectedPersonas");
        if (stored) {
            setSelectedPersonas(JSON.parse(stored));
        } else {
            // Default to Chanakya if none selected
            setSelectedPersonas(["chanakya"]);
        }
    }, []);

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
            // Call the real backend API
            const response = await fetch('http://localhost:5000/api/chat/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: currentInput,
                    personaIds: selectedPersonas
                })
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();

            if (data.success && data.data.aiResponses) {
                const responses: PersonaResponse[] = data.data.aiResponses.map((resp: any) => ({
                    personaId: resp.personaId,
                    personaName: resp.personaName,
                    response: resp.response,
                    color: personasData[resp.personaId]?.color || "from-gray-500 to-gray-600",
                }));

                setPersonaResponses(responses);

                // Add AI responses to messages with stagger
                responses.forEach((resp, index) => {
                    setTimeout(() => {
                        const aiMessage: Message = {
                            id: `${Date.now()}-${index}`,
                            type: "ai",
                            content: resp.response,
                            persona: resp.personaName,
                            timestamp: new Date(),
                        };
                        setMessages((prev) => [...prev, aiMessage]);
                    }, index * 300);
                });
            }
        } catch (error) {
            console.error('Error calling API:', error);

            // Fallback to mock responses if API fails
            const responses: PersonaResponse[] = selectedPersonas.map((personaId) => ({
                personaId,
                personaName: personasData[personaId].name,
                response: generateMockResponse(personaId, currentInput),
                color: personasData[personaId].color,
            }));

            setPersonaResponses(responses);

            responses.forEach((resp, index) => {
                setTimeout(() => {
                    const aiMessage: Message = {
                        id: `${Date.now()}-${index}`,
                        type: "ai",
                        content: resp.response,
                        persona: resp.personaName,
                        timestamp: new Date(),
                    };
                    setMessages((prev) => [...prev, aiMessage]);
                }, index * 300);
            });
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
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            {/* Animated background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-indigo-900/20 via-transparent to-transparent blur-3xl animate-float" />
            </div>

            {/* Navigation */}
            <nav className="relative z-10 px-6 py-4 lg:px-8 border-b border-white/10">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="text-xl font-bold gradient-text">
                        GhostSkill
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/persona-selection"
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all text-sm"
                        >
                            Change Personas
                        </Link>
                        <Link
                            href="/reflection"
                            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-lg transition-all text-sm"
                        >
                            Reflect
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Main Content - Two Column Layout */}
            <div className="relative z-10 h-[calc(100vh-100px)] flex flex-col lg:flex-row">
                {/* Left: Chat Interface */}
                <div className="flex-1 flex flex-col border-r border-white/10">
                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
                        {messages.length === 0 && (
                            <div className="h-full flex items-center justify-center">
                                <div className="text-center max-w-md">
                                    <h3 className="text-2xl font-bold mb-3">Training Room</h3>
                                    <p className="text-gray-400 mb-6">
                                        Ask your challenge, dilemma, or strategic question. Your selected mentors will guide you.
                                    </p>
                                    <div className="flex flex-wrap gap-2 justify-center mb-6">
                                        {selectedPersonas.map((id) => (
                                            <span
                                                key={id}
                                                className={`px-3 py-1 bg-gradient-to-r ${personasData[id].color} rounded-lg text-sm font-semibold`}
                                            >
                                                {personasData[id].name}
                                            </span>
                                        ))}
                                    </div>
                                    {/* Gemini AI Badge */}
                                    <div className="flex items-center justify-center gap-2 text-sm">
                                        <div className="px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-400/30 flex items-center gap-2">
                                            <span className="text-xl">🤖</span>
                                            <span className="text-blue-300">Powered by Google Gemini AI</span>
                                        </div>
                                        <span className="text-gray-500">+</span>
                                        <div className="px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full border border-amber-400/30 flex items-center gap-2">
                                            <span className="text-lg">📚</span>
                                            <span className="text-amber-300">Ancient Wisdom</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[70%] px-5 py-3 rounded-2xl ${message.type === "user"
                                        ? "bg-gradient-to-r from-indigo-600 to-violet-600"
                                        : "card-gradient"
                                        }`}
                                >
                                    {message.persona && (
                                        <div className="text-xs font-semibold text-indigo-400 mb-1">
                                            {message.persona}
                                        </div>
                                    )}
                                    <p className="leading-relaxed">{message.content}</p>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="card-gradient px-5 py-3 rounded-2xl">
                                    <div className="flex gap-2">
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
                                        <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-6 border-t border-white/10">
                        <div className="flex gap-3">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Describe your challenge or ask a strategic question..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 resize-none focus:outline-none focus:border-indigo-500 transition-colors"
                                rows={3}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!input.trim() || isLoading}
                                className="px-6 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                            >
                                Send
                            </button>
                        </div>
                        {/* AI Status Indicator */}
                        <div className="mt-3 flex items-center justify-center gap-3 text-xs text-gray-500">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                <span>AI Active</span>
                            </div>
                            <span>•</span>
                            <span>🤖 Google Gemini</span>
                            <span>•</span>
                            <span>📚 {selectedPersonas.length} Wisdom {selectedPersonas.length === 1 ? 'Source' : 'Sources'}</span>
                        </div>
                    </div>
                </div>

                {/* Right: Mindset Switch Panel */}
                <div className="lg:w-96 bg-[#13131a]/50 backdrop-blur-sm p-6 overflow-y-auto">
                    <div className="mb-6">
                        <h3 className="text-2xl font-bold gradient-text mb-2">Mindset Perspectives</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
                                📚 Real Ancient Wisdom
                            </span>
                            <span className="text-xs text-gray-500">
                                From {selectedPersonas.length} {selectedPersonas.length === 1 ? 'source' : 'sources'}
                            </span>
                        </div>
                    </div>

                    {personaResponses.length === 0 ? (
                        <div className="text-center text-gray-500 py-12">
                            <p>Persona responses will appear here after you send a message</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {personaResponses.map((resp) => (
                                <div key={resp.personaId} className="card-gradient p-4 rounded-xl">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${resp.color} flex items-center justify-center font-bold text-sm`}>
                                            {resp.personaName.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-semibold">{resp.personaName}</div>
                                            <div className="text-xs text-gray-500">Ancient Wisdom</div>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 text-sm leading-relaxed">{resp.response}</p>
                                </div>
                            ))}

                            {/* Key Insight Summary */}
                            <div className="mt-6 p-5 bg-gradient-to-r from-indigo-600/20 to-violet-600/20 rounded-xl border border-indigo-500/30">
                                <h4 className="font-bold text-indigo-400 mb-2">🔑 Key Insight</h4>
                                <p className="text-sm text-gray-300 mb-3">
                                    Compare these different perspectives. What common themes emerge? What unique approaches stand out?
                                </p>
                                <div className="text-xs text-indigo-300/70">
                                    💡 These responses incorporate wisdom from 7 traditional texts spanning 2,300+ years
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
