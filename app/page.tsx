"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

// Persona data
const personas = [
    {
        id: "chanakya",
        name: "Chanakya",
        tagline: "Strategy & Statecraft",
        description: "Ancient Indian philosopher and strategist",
        color: "from-amber-500 to-orange-600",
    },
    {
        id: "bose",
        name: "Subhas Chandra Bose",
        tagline: "Courage & Revolution",
        description: "Indian revolutionary and freedom fighter",
        color: "from-emerald-500 to-teal-600",
    },
    {
        id: "aurelius",
        name: "Marcus Aurelius",
        tagline: "Discipline & Inner Strength",
        description: "Roman emperor and Stoic philosopher",
        color: "from-blue-500 to-indigo-600",
    },
    {
        id: "napoleon",
        name: "Napoleon Bonaparte",
        tagline: "Execution & War Strategy",
        description: "French military genius and emperor",
        color: "from-purple-500 to-violet-600",
    },
];

const steps = [
    {
        number: "01",
        title: "Select Persona",
        description: "Choose one or more historical figures to guide your thinking",
    },
    {
        number: "02",
        title: "Ask Your Challenge",
        description: "Present your real-world problem or decision",
    },
    {
        number: "03",
        title: "Switch Mindsets & Learn",
        description: "Compare perspectives and build mental frameworks",
    },
];

export default function Home() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
            {/* Animated background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-indigo-900/20 via-transparent to-transparent blur-3xl animate-float" />
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-violet-900/20 via-transparent to-transparent blur-3xl animate-float" style={{ animationDelay: "1s" }} />
            </div>

            {/* Navigation */}
            <nav className="relative z-10 px-6 py-6 lg:px-12">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="text-2xl font-bold gradient-text">GhostSkill</div>
                    <div className="flex gap-4">
                        <Link
                            href="/datasets"
                            className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all duration-300 hover:border-white/20"
                        >
                            Datasets
                        </Link>
                        <Link
                            href="/dashboard"
                            className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all duration-300 hover:border-white/20"
                        >
                            Dashboard
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 px-6 py-20 lg:py-32 lg:px-12">
                <div className="max-w-6xl mx-auto text-center">
                    <h1
                        className={`text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight transition-opacity duration-1000 ${mounted ? "opacity-100" : "opacity-0"
                            }`}
                    >
                        Train Your Mind With{" "}
                        <span className="gradient-text">History's Greatest Thinkers</span>
                    </h1>

                    <p className={`text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        }`}>
                        We don't teach information. We train thinking.
                    </p>

                    <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center transition-all duration-1000 delay-400 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        }`}>
                        <Link href="/persona-selection" className="btn-primary">
                            Start Training
                        </Link>
                        <Link href="/training" className="btn-secondary">
                            Try Demo
                        </Link>
                    </div>
                </div>
            </section>

            {/* Personas Section */}
            <section className="relative z-10 px-6 py-20 lg:px-12">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
                        Meet Your <span className="gradient-text">AI Mentors</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {personas.map((persona, index) => (
                            <div
                                key={persona.id}
                                className={`group relative p-8 rounded-2xl card-gradient hover:scale-105 transition-all duration-500 cursor-pointer ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                                    }`}
                                style={{
                                    transitionDelay: `${index * 100 + 600}ms`,
                                }}
                            >
                                {/* Persona Avatar Placeholder */}
                                <div className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br ${persona.color} flex items-center justify-center text-3xl font-bold shadow-lg group-hover:shadow-2xl transition-shadow duration-300`}>
                                    {persona.name.charAt(0)}
                                </div>

                                <h3 className="text-2xl font-bold mb-2 text-center">{persona.name}</h3>
                                <p className={`text-center bg-gradient-to-r ${persona.color} bg-clip-text text-transparent font-semibold mb-3`}>
                                    {persona.tagline}
                                </p>
                                <p className="text-gray-400 text-center text-sm">{persona.description}</p>

                                {/* Glow effect on hover */}
                                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${persona.color} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500`} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="relative z-10 px-6 py-20 lg:px-12">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
                        How It <span className="gradient-text">Works</span>
                    </h2>

                    <div className="space-y-12">
                        {steps.map((step, index) => (
                            <div
                                key={step.number}
                                className={`flex flex-col md:flex-row items-center gap-8 transition-all duration-1000 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                                    }`}
                                style={{ transitionDelay: `${index * 200 + 1000}ms` }}
                            >
                                <div className="flex-shrink-0">
                                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-2xl">
                                        <span className="text-4xl font-bold">{step.number}</span>
                                    </div>
                                </div>

                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="text-3xl font-bold mb-3">{step.title}</h3>
                                    <p className="text-gray-400 text-lg">{step.description}</p>
                                </div>

                                {index < steps.length - 1 && (
                                    <div className="hidden md:block w-24 h-1 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full" />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-16">
                        <Link href="/persona-selection" className="btn-primary">
                            Begin Your Journey
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 px-6 py-12 border-t border-white/10 mt-20">
                <div className="max-w-7xl mx-auto text-center text-gray-500">
                    <p className="mb-2">© 2025 GhostSkill. All rights reserved.</p>
                    <p className="text-sm">This is a mockup and not a real product.</p>
                </div>
            </footer>
        </div>
    );
}
