"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const steps = [
    {
        number: "01",
        title: "Present Your Challenge",
        description: "Submit a real-world dilemma, strategy, or obstacle you are currently facing.",
    },
    {
        number: "02",
        title: "Engage the Ultimate Mind",
        description: "Your companion instantly combines the strategic foresight of Chanakya, the courage of Bose, the discipline of Aurelius, and the execution of Napoleon.",
    },
    {
        number: "03",
        title: "Achieve Unmatched Clarity",
        description: "Extract actionable, battle-tested wisdom from history's most brilliant minds.",
    },
];

export default function Home() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="min-h-screen bg-[#06060a] text-white selection:bg-indigo-500/30 overflow-hidden font-sans">
            {/* Ambient Background Glows */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute right-[-10%] bottom-[-20%] w-[50%] h-[50%] bg-violet-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
            </div>

            {/* Navigation */}
            <nav className="relative z-10 px-6 py-6 lg:px-12 backdrop-blur-md border-b border-white/5 sticky top-0">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <span className="font-bold text-sm">G</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">GhostSkill</span>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href="/dashboard"
                            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-full border border-white/5 hover:border-white/10 transition-all duration-300 text-sm font-medium"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/training"
                            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-full shadow-lg shadow-indigo-500/25 transition-all duration-300 text-sm font-medium"
                        >
                            Enter Room
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 px-6 py-24 lg:py-36 lg:px-12 flex flex-col items-center justify-center min-h-[80vh]">
                <div className="max-w-5xl mx-auto text-center">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-8 transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                        Powered by Advanced AI & Ancient Wisdom
                    </div>

                    <h1 className={`text-6xl md:text-8xl font-extrabold mb-8 tracking-tight transition-all duration-1000 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                        Think like a <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-violet-400">
                            Visionary.
                        </span>
                    </h1>

                    <p className={`text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed transition-all duration-1000 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                        A singular AI companion forged from the greatest strategic, stoic, and revolutionary minds in history.
                    </p>

                    <div className={`flex justify-center transition-all duration-1000 delay-300 ${mounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"}`}>
                        <Link
                            href="/training"
                            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-indigo-600 rounded-full overflow-hidden hover:bg-indigo-500"
                        >
                            <span className="relative flex items-center gap-2 z-10">
                                Initiate Training Session
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                            </span>
                            <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Ultimate Companion Showcase */}
            <section className="relative z-10 px-6 py-24 bg-black/40 border-y border-white/5 backdrop-blur-lg">
                <div className="max-w-6xl mx-auto flex flex-col items-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                        Meet Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Ultimate Companion</span>
                    </h2>

                    <div className={`relative w-full max-w-4xl p-[1px] rounded-3xl bg-gradient-to-b from-indigo-500/30 to-transparent transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
                        <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 to-violet-500/20 blur-2xl opacity-50 z-0 rounded-3xl"></div>

                        <div className="relative z-10 bg-[#0a0a0f] rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-12 overflow-hidden">
                            {/* Decorative background grid inside card */}
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

                            <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-indigo-600 to-purple-800 flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.4)] flex-shrink-0 group">
                                <span className="text-7xl font-bold text-white group-hover:scale-110 transition-transform duration-500">F</span>
                                <div className="absolute inset-0 border-[3px] border-white/10 rounded-full animate-[spin_10s_linear_infinite]"></div>
                                <div className="absolute inset-[-10px] border border-indigo-500/30 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                            </div>

                            <div className="flex-1 text-center md:text-left z-10">
                                <h3 className="text-4xl font-bold mb-2">The Friend</h3>
                                <p className="text-xl text-indigo-400 font-medium mb-6">Strategy, Courage, Discipline & Execution</p>
                                <p className="text-gray-400 text-lg leading-relaxed mb-8">
                                    No longer do you need to seek separate counsel. "The Friend" dynamically synthesizes the calculated strategy of Chanakya, the fearless charge of Subhas Chandra Bose, the unshakeable stoicism of Marcus Aurelius, and the battlefield dominance of Napoleon.
                                </p>

                                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                    {['Political Strategy', 'Revolutionary Thinking', 'Stoicism', 'Tactical Thinking'].map(skill => (
                                        <span key={skill} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-medium text-gray-300">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="relative z-10 px-6 py-32 lg:px-12">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-24">
                        The <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Process</span>
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {/* Connecting line for desktop */}
                        <div className="hidden md:block absolute top-[40px] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>

                        {steps.map((step, index) => (
                            <div
                                key={step.number}
                                className={`relative z-10 flex flex-col items-center text-center transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                                style={{ transitionDelay: `${index * 150 + 400}ms` }}
                            >
                                <div className="w-20 h-20 rounded-2xl bg-[#0a0a0f] border border-white/10 flex items-center justify-center shadow-xl shadow-indigo-500/10 mb-8 relative group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">{step.number}</span>
                                </div>

                                <h3 className="text-xl font-bold mb-3 text-white/90">{step.title}</h3>
                                <p className="text-gray-400 leading-relaxed text-sm">{step.description}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-20">
                        <Link href="/training" className="inline-flex items-center gap-2 group text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                            Ready to commence?
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 px-6 py-12 border-t border-white/5 bg-black/60">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-gray-500 text-sm">
                    <p>© 2026 GhostSkill. All rights reserved.</p>
                    <div className="flex gap-4 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
