"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Reflection() {
    const [mistake, setMistake] = useState("");
    const [newRule, setNewRule] = useState("");
    const [nextAction, setNextAction] = useState("");
    const [isSaved, setIsSaved] = useState(false);
    const router = useRouter();

    const handleSave = () => {
        // In real app, this would save to database
        const reflection = {
            mistake,
            newRule,
            nextAction,
            timestamp: new Date().toISOString(),
        };

        // Save to localStorage for now
        const existing = JSON.parse(localStorage.getItem("reflections") || "[]");
        existing.push(reflection);
        localStorage.setItem("reflections", JSON.stringify(existing));

        setIsSaved(true);

        setTimeout(() => {
            router.push("/dashboard");
        }, 1500);
    };

    const isFormComplete = mistake.trim() && newRule.trim() && nextAction.trim();

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            {/* Animated background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-indigo-900/20 via-transparent to-transparent blur-3xl animate-float" />
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-violet-900/20 via-transparent to-transparent blur-3xl animate-float" style={{ animationDelay: "1s" }} />
            </div>

            {/* Navigation */}
            <nav className="relative z-10 px-6 py-6 lg:px-12">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold gradient-text">
                        GhostSkill
                    </Link>
                    <div className="flex gap-4">
                        <Link
                            href="/training"
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all text-sm"
                        >
                            Back to Training
                        </Link>
                        <Link
                            href="/dashboard"
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all text-sm"
                        >
                            Dashboard
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="relative z-10 px-6 py-12 lg:px-12">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-5xl md:text-6xl font-bold mb-4">
                            <span className="gradient-text">Reflection</span> Time
                        </h1>
                        <p className="text-xl text-gray-400">
                            Transform insights into action. Reflect on what you learned.
                        </p>
                    </div>

                    {/* Reflection Form */}
                    <div className="space-y-8">
                        {/* Your Mistake */}
                        <div className="card-gradient p-8 rounded-2xl">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-2xl">
                                    ⚠️
                                </div>
                                <h2 className="text-2xl font-bold">Your Mistake</h2>
                            </div>
                            <p className="text-gray-400 mb-4">
                                What did you realize you were doing wrong? What blind spot did you discover?
                            </p>
                            <textarea
                                value={mistake}
                                onChange={(e) => setMistake(e.target.value)}
                                placeholder="I was focused on short-term gains and didn't consider the long-term consequences..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 resize-none focus:outline-none focus:border-indigo-500 transition-colors min-h-[120px]"
                            />
                        </div>

                        {/* Your New Rule */}
                        <div className="card-gradient p-8 rounded-2xl">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-2xl">
                                    📜
                                </div>
                                <h2 className="text-2xl font-bold">Your New Rule</h2>
                            </div>
                            <p className="text-gray-400 mb-4">
                                What principle or rule will you adopt from this session? Make it specific.
                            </p>
                            <textarea
                                value={newRule}
                                onChange={(e) => setNewRule(e.target.value)}
                                placeholder="Before making any important decision, I will consider at least 3 potential outcomes..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 resize-none focus:outline-none focus:border-indigo-500 transition-colors min-h-[120px]"
                            />
                        </div>

                        {/* Your Next Action */}
                        <div className="card-gradient p-8 rounded-2xl">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-2xl">
                                    🎯
                                </div>
                                <h2 className="text-2xl font-bold">Your Next Action</h2>
                            </div>
                            <p className="text-gray-400 mb-4">
                                What specific action will you take in the next 24 hours to apply this learning?
                            </p>
                            <textarea
                                value={nextAction}
                                onChange={(e) => setNextAction(e.target.value)}
                                placeholder="Tomorrow morning, I will review my current project and identify 3 long-term risks..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 resize-none focus:outline-none focus:border-indigo-500 transition-colors min-h-[120px]"
                            />
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-12 text-center">
                        {isSaved ? (
                            <div className="inline-flex items-center gap-3 px-12 py-5 bg-emerald-600 rounded-xl text-lg font-semibold">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Reflection Saved! Redirecting...
                            </div>
                        ) : (
                            <button
                                onClick={handleSave}
                                disabled={!isFormComplete}
                                className={`px-12 py-5 text-lg font-semibold rounded-xl transition-all duration-300 ${isFormComplete
                                        ? "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-2xl hover:scale-105"
                                        : "bg-gray-800 text-gray-500 cursor-not-allowed"
                                    }`}
                            >
                                Save Reflection & Continue
                            </button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
