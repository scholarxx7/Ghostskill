"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const personas = [
    {
        id: "chanakya",
        name: "Chanakya",
        tagline: "Strategy & Statecraft",
        description: "Master of political strategy and governance. Learn to think 10 steps ahead.",
        expertise: ["Political Strategy", "Diplomacy", "Long-term Planning", "Resource Management"],
        color: "from-amber-500 to-orange-600",
        quote: "Before you start a war, you must understand whose side the gods are on.",
    },
    {
        id: "bose",
        name: "Subhas Chandra Bose",
        tagline: "Courage & Revolution",
        description: "Revolutionary leader who fought for freedom. Learn courage under pressure.",
        expertise: ["Leadership", "Revolutionary Thinking", "Courage", "Movement Building"],
        color: "from-emerald-500 to-teal-600",
        quote: "Give me blood, and I shall give you freedom!",
    },
    {
        id: "aurelius",
        name: "Marcus Aurelius",
        tagline: "Discipline & Inner Strength",
        description: "Stoic philosopher-emperor. Learn to control what matters: your mind.",
        expertise: ["Stoicism", "Self-Discipline", "Emotional Control", "Philosophy"],
        color: "from-blue-500 to-indigo-600",
        quote: "You have power over your mind - not outside events. Realize this, and you will find strength.",
    },
    {
        id: "napoleon",
        name: "Napoleon Bonaparte",
        tagline: "Execution & War Strategy",
        description: "Military genius and emperor. Learn decisive action and battlefield tactics.",
        expertise: ["Military Strategy", "Decisive Action", "Resource Allocation", "Tactical Thinking"],
        color: "from-purple-500 to-violet-600",
        quote: "The battlefield is a scene of constant chaos. The winner will be the one who controls that chaos.",
    },
];

export default function PersonaSelection() {
    const [selectedPersonas, setSelectedPersonas] = useState<string[]>([]);
    const router = useRouter();

    const togglePersona = (id: string) => {
        setSelectedPersonas((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
        );
    };

    const handleEnterTraining = () => {
        if (selectedPersonas.length > 0) {
            // Store selected personas in localStorage for the training room
            localStorage.setItem("selectedPersonas", JSON.stringify(selectedPersonas));
            router.push("/training");
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            {/* Animated background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-indigo-900/20 via-transparent to-transparent blur-3xl animate-float" />
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-violet-900/20 via-transparent to-transparent blur-3xl animate-float" style={{ animationDelay: "1s" }} />
            </div>

            {/* Navigation */}
            <nav className="relative z-10 px-6 py-6 lg:px-12">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold gradient-text">
                        GhostSkill
                    </Link>
                    <Link
                        href="/"
                        className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all duration-300"
                    >
                        Back to Home
                    </Link>
                </div>
            </nav>

            {/* Main Content */}
            <main className="relative z-10 px-6 py-12 lg:px-12">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-5xl md:text-6xl font-bold mb-4">
                            Choose Your <span className="gradient-text">Mentors</span>
                        </h1>
                        <p className="text-xl text-gray-400 mb-6">
                            Select one or more personas to guide your thinking
                        </p>
                        {selectedPersonas.length > 0 && (
                            <p className="text-lg text-indigo-400">
                                {selectedPersonas.length} persona{selectedPersonas.length > 1 ? "s" : ""} selected
                            </p>
                        )}
                    </div>

                    {/* Persona Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                        {personas.map((persona) => {
                            const isSelected = selectedPersonas.includes(persona.id);

                            return (
                                <div
                                    key={persona.id}
                                    onClick={() => togglePersona(persona.id)}
                                    className={`group relative p-8 rounded-2xl cursor-pointer transition-all duration-500 ${isSelected
                                            ? "card-gradient scale-105 ring-2 ring-indigo-500"
                                            : "card-gradient hover:scale-102"
                                        }`}
                                >
                                    {/* Selection indicator */}
                                    {isSelected && (
                                        <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}

                                    <div className="flex flex-col md:flex-row gap-6">
                                        {/* Avatar */}
                                        <div className="flex-shrink-0">
                                            <div className={`w-32 h-32 rounded-2xl bg-gradient-to-br ${persona.color} flex items-center justify-center text-5xl font-bold shadow-2xl`}>
                                                {persona.name.charAt(0)}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <h3 className="text-3xl font-bold mb-2">{persona.name}</h3>
                                            <p className={`bg-gradient-to-r ${persona.color} bg-clip-text text-transparent font-semibold mb-3 text-lg`}>
                                                {persona.tagline}
                                            </p>
                                            <p className="text-gray-400 mb-4">{persona.description}</p>

                                            {/* Expertise tags */}
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {persona.expertise.map((skill) => (
                                                    <span
                                                        key={skill}
                                                        className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Quote */}
                                            <blockquote className="border-l-2 border-indigo-500 pl-4 italic text-gray-500 text-sm">
                                                "{persona.quote}"
                                            </blockquote>
                                        </div>
                                    </div>

                                    {/* Glow effect */}
                                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${persona.color} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500 ${isSelected ? "opacity-5" : ""}`} />
                                </div>
                            );
                        })}
                    </div>

                    {/* Action Button */}
                    <div className="text-center">
                        <button
                            onClick={handleEnterTraining}
                            disabled={selectedPersonas.length === 0}
                            className={`px-12 py-5 text-lg font-semibold rounded-xl transition-all duration-300 ${selectedPersonas.length > 0
                                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-2xl hover:scale-105"
                                    : "bg-gray-800 text-gray-500 cursor-not-allowed"
                                }`}
                        >
                            {selectedPersonas.length === 0
                                ? "Select at least one persona"
                                : `Enter Training Room →`}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
