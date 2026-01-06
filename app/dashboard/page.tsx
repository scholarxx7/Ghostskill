"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Reflection {
    mistake: string;
    newRule: string;
    nextAction: string;
    timestamp: string;
}

interface MetricCard {
    title: string;
    value: number | string;
    icon: string;
    color: string;
    description: string;
}

export default function Dashboard() {
    const [reflections, setReflections] = useState<Reflection[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Load reflections from localStorage
        const stored = localStorage.getItem("reflections");
        if (stored) {
            setReflections(JSON.parse(stored));
        }
    }, []);

    const sessionsCompleted = reflections.length;
    const mindsetsTrainedCount = reflections.length * 2; // Assuming average of 2 personas per session
    const streakDays = Math.min(reflections.length, 7); // Simplified streak calculation

    const metrics: MetricCard[] = [
        {
            title: "Sessions Completed",
            value: sessionsCompleted,
            icon: "🎯",
            color: "from-indigo-500 to-violet-600",
            description: "Training sessions finished",
        },
        {
            title: "Mindsets Trained",
            value: mindsetsTrainedCount,
            icon: "🧠",
            color: "from-purple-500 to-pink-600",
            description: "Different perspectives explored",
        },
        {
            title: "Decision Clarity",
            value: `${Math.min(sessionsCompleted * 15, 100)}%`,
            icon: "💡",
            color: "from-emerald-500 to-teal-600",
            description: "Improvement in decision-making",
        },
        {
            title: "Discipline Streak",
            value: `${streakDays} days`,
            icon: "🔥",
            color: "from-orange-500 to-red-600",
            description: "Consecutive days of training",
        },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            {/* Animated background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-indigo-900/20 via-transparent to-transparent blur-3xl animate-float" />
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-violet-900/20 via-transparent to-transparent blur-3xl animate-float" style={{ animationDelay: "1s" }} />
            </div>

            {/* Navigation */}
            <nav className="relative z-10 px-6 py-6 lg:px-12 border-b border-white/10">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold gradient-text">
                        GhostSkill
                    </Link>
                    <div className="flex gap-4">
                        <Link
                            href="/persona-selection"
                            className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-lg transition-all font-semibold"
                        >
                            New Training Session
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="relative z-10 px-6 py-12 lg:px-12">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-12">
                        <h1 className="text-5xl md:text-6xl font-bold mb-4">
                            Your <span className="gradient-text">Growth</span> Dashboard
                        </h1>
                        <p className="text-xl text-gray-400">
                            Track your mental training progress and insights
                        </p>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {metrics.map((metric, index) => (
                            <div
                                key={metric.title}
                                className={`card-gradient p-6 rounded-2xl transition-all duration-500 hover:scale-105 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                                    }`}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center text-3xl shadow-lg`}>
                                        {metric.icon}
                                    </div>
                                </div>
                                <div className="text-4xl font-bold mb-2">{metric.value}</div>
                                <div className="text-lg font-semibold mb-1">{metric.title}</div>
                                <div className="text-sm text-gray-400">{metric.description}</div>
                            </div>
                        ))}
                    </div>

                    {/* Recent Reflections */}
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold mb-6">
                            Recent <span className="gradient-text">Reflections</span>
                        </h2>

                        {reflections.length === 0 ? (
                            <div className="card-gradient p-12 rounded-2xl text-center">
                                <div className="text-6xl mb-4">📝</div>
                                <h3 className="text-2xl font-bold mb-3">No Reflections Yet</h3>
                                <p className="text-gray-400 mb-6">
                                    Complete your first training session to start tracking your growth
                                </p>
                                <Link
                                    href="/persona-selection"
                                    className="inline-block btn-primary"
                                >
                                    Start Training
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {reflections.slice(-5).reverse().map((reflection, index) => (
                                    <div
                                        key={index}
                                        className={`card-gradient p-6 rounded-2xl transition-all duration-500 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                                            }`}
                                        style={{ transitionDelay: `${(index + 4) * 100}ms` }}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="text-sm text-gray-500">
                                                {new Date(reflection.timestamp).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-3 gap-6">
                                            <div>
                                                <h4 className="font-semibold text-red-400 mb-2 flex items-center gap-2">
                                                    <span>⚠️</span> Mistake
                                                </h4>
                                                <p className="text-gray-300 text-sm">{reflection.mistake}</p>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold text-indigo-400 mb-2 flex items-center gap-2">
                                                    <span>📜</span> New Rule
                                                </h4>
                                                <p className="text-gray-300 text-sm">{reflection.newRule}</p>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold text-emerald-400 mb-2 flex items-center gap-2">
                                                    <span>🎯</span> Next Action
                                                </h4>
                                                <p className="text-gray-300 text-sm">{reflection.nextAction}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Action Cards */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <Link
                            href="/persona-selection"
                            className="card-gradient p-8 rounded-2xl hover:scale-105 transition-all group"
                        >
                            <div className="text-4xl mb-4">🚀</div>
                            <h3 className="text-2xl font-bold mb-2 group-hover:gradient-text transition-all">
                                Continue Training
                            </h3>
                            <p className="text-gray-400">
                                Start a new session with your AI mentors
                            </p>
                        </Link>

                        <Link
                            href="/training"
                            className="card-gradient p-8 rounded-2xl hover:scale-105 transition-all group"
                        >
                            <div className="text-4xl mb-4">💬</div>
                            <h3 className="text-2xl font-bold mb-2 group-hover:gradient-text transition-all">
                                Quick Demo
                            </h3>
                            <p className="text-gray-400">
                                Try the training room with default personas
                            </p>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
