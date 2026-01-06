"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface DatasetStats {
    total_verses: number;
    datasets: Record<string, any>;
    global_keywords: Record<string, number>;
    global_topics: Record<string, number>;
}

const datasetInfo = [
    {
        id: "chanakya",
        name: "Chanakya Niti",
        icon: "🏛️",
        color: "from-amber-500 to-orange-600",
        description: "Ancient Indian treatise on politics, ethics, and strategy",
        author: "Chanakya (Kautilya)",
        period: "~300 BCE",
        chapters: 17,
        language: "Sanskrit (translated)",
        source: "Traditional Indian Texts Repository"
    },
    {
        id: "gita",
        name: "Bhagavad Gita",
        icon: "📿",
        color: "from-indigo-500 to-purple-600",
        description: "Sacred Hindu scripture on duty, devotion, and wisdom",
        author: "Vyasa",
        period: "~400 BCE - 400 CE",
        chapters: "Selected verses",
        language: "Sanskrit (translated)",
        source: "Public domain translations"
    },
    {
        id: "arthashastra",
        name: "Arthashastra",
        icon: "⚔️",
        color: "from-red-500 to-orange-600",
        description: "Ancient treatise on statecraft, military strategy, and economics",
        author: "Chanakya (Kautilya)",
        period: "~300 BCE",
        chapters: "Key teachings",
        language: "Sanskrit (translated)",
        source: "Historical texts"
    },
    {
        id: "meditations",
        name: "Meditations",
        icon: "🏛️",
        color: "from-blue-500 to-cyan-600",
        description: "Personal philosophical writings on Stoic principles",
        author: "Marcus Aurelius",
        period: "170-180 CE",
        chapters: "Selected entries",
        language: "Greek (translated)",
        source: "Public domain translations"
    },
    {
        id: "napoleon",
        name: "Napoleon's Maxims",
        icon: "⚡",
        color: "from-purple-500 to-pink-600",
        description: "Military strategy and leadership principles",
        author: "Napoleon Bonaparte",
        period: "1769-1821",
        chapters: "Military maxims",
        language: "French (translated)",
        source: "Historical military texts"
    },
    {
        id: "bhagavatam",
        name: "Srimad Bhagavatam",
        icon: "🕉️",
        color: "from-yellow-500 to-amber-600",
        description: "Ancient Hindu Purana text on devotion and philosophy",
        author: "Vyasa",
        period: "~500-1000 CE",
        chapters: "12 Cantos (1163 files)",
        language: "Sanskrit (translated)",
        source: "Vedabase.io"
    },
    {
        id: "ayurveda",
        name: "Charak Samhita (Ayurveda)",
        icon: "🌿",
        color: "from-green-500 to-emerald-600",
        description: "Foundational text of Ayurvedic medicine",
        author: "Charaka",
        period: "~100 BCE - 200 CE",
        chapters: "8 Sections (142 texts)",
        language: "Sanskrit (translated)",
        source: "Wisdomlib.org"
    }
];

export default function DatasetsPage() {
    const [mounted, setMounted] = useState(false);
    const [stats, setStats] = useState<DatasetStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setMounted(true);
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch('http://localhost:8000/datasets/stats');
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const topKeywords = stats?.global_keywords
        ? Object.entries(stats.global_keywords).slice(0, 10)
        : [];

    const topTopics = stats?.global_topics
        ? Object.entries(stats.global_topics).slice(0, 7)
        : [];

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
                            className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all"
                        >
                            Start Training
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="relative z-10 px-6 py-12 lg:px-12">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-5xl md:text-6xl font-bold mb-4">
                            Wisdom <span className="gradient-text">Datasets</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                            Our AI personas draw from {stats?.total_verses || "250+"} authentic quotes spanning over
                            2,000 years of human wisdom across 7 traditional texts.
                        </p>

                        {/* Statistics Bar */}
                        {!loading && stats && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                                <div className="card-gradient p-4 rounded-xl">
                                    <div className="text-3xl font-bold gradient-text">{stats.total_verses}</div>
                                    <div className="text-sm text-gray-400">Total Quotes</div>
                                </div>
                                <div className="card-gradient p-4 rounded-xl">
                                    <div className="text-3xl font-bold gradient-text">7</div>
                                    <div className="text-sm text-gray-400">Ancient Texts</div>
                                </div>
                                <div className="card-gradient p-4 rounded-xl">
                                    <div className="text-3xl font-bold gradient-text">2,300+</div>
                                    <div className="text-sm text-gray-400">Years of Wisdom</div>
                                </div>
                                <div className="card-gradient p-4 rounded-xl">
                                    <div className="text-3xl font-bold gradient-text">1,300+</div>
                                    <div className="text-sm text-gray-400">Source Files</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Datasets Grid */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold mb-8 text-center">
                            Source <span className="gradient-text">Texts</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {datasetInfo.map((dataset, index) => (
                                <div
                                    key={dataset.id}
                                    className={`card-gradient p-6 rounded-2xl hover:scale-105 transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                                        }`}
                                    style={{ transitionDelay: `${index * 100}ms` }}
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${dataset.color} flex items-center justify-center text-2xl`}>
                                            {dataset.icon}
                                        </div>
                                        <h3 className="text-xl font-bold">{dataset.name}</h3>
                                    </div>

                                    <p className="text-gray-400 mb-4 text-sm">{dataset.description}</p>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Author:</span>
                                            <span className="text-gray-300">{dataset.author}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Period:</span>
                                            <span className="text-gray-300">{dataset.period}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Content:</span>
                                            <span className="text-gray-300">{dataset.chapters}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Language:</span>
                                            <span className="text-gray-300">{dataset.language}</span>
                                        </div>
                                    </div>

                                    <div className={`mt-4 pt-4 border-t border-white/10 text-xs text-gray-500`}>
                                        Source: {dataset.source}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Keywords & Topics */}
                    {!loading && stats && (
                        <div className="grid md:grid-cols-2 gap-8 mb-16">
                            {/* Top Keywords */}
                            <div className="card-gradient p-8 rounded-2xl">
                                <h3 className="text-2xl font-bold mb-6 gradient-text">Top Keywords</h3>
                                <div className="space-y-3">
                                    {topKeywords.map(([keyword, count], index) => (
                                        <div key={keyword} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="text-indigo-400 font-mono text-sm">#{index + 1}</span>
                                                <span className="capitalize">{keyword}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-32 bg-white/5 rounded-full h-2 overflow-hidden">
                                                    <div
                                                        className="bg-gradient-to-r from-indigo-600 to-violet-600 h-full rounded-full"
                                                        style={{ width: `${(count / topKeywords[0][1]) * 100}%` }}
                                                    />
                                                </div>
                                                <span className="text-gray-400 text-sm w-8 text-right">{count}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Top Topics */}
                            <div className="card-gradient p-8 rounded-2xl">
                                <h3 className="text-2xl font-bold mb-6 gradient-text">Top Topics</h3>
                                <div className="space-y-3">
                                    {topTopics.map(([topic, count], index) => (
                                        <div key={topic} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="text-violet-400 font-mono text-sm">#{index + 1}</span>
                                                <span className="capitalize">{topic}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-32 bg-white/5 rounded-full h-2 overflow-hidden">
                                                    <div
                                                        className="bg-gradient-to-r from-violet-600 to-purple-600 h-full rounded-full"
                                                        style={{ width: `${(count / topTopics[0][1]) * 100}%` }}
                                                    />
                                                </div>
                                                <span className="text-gray-400 text-sm w-8 text-right">{count}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Data Processing Info */}
                    <div className="card-gradient p-8 rounded-2xl mb-16">
                        <h3 className="text-2xl font-bold mb-6 gradient-text">Data Processing</h3>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="font-semibold text-lg mb-3">Preprocessing</h4>
                                <ul className="space-y-2 text-gray-400">
                                    <li className="flex items-center gap-2">
                                        <span className="text-emerald-400">✓</span> Text cleaning & normalization
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-emerald-400">✓</span> Duplicate detection & removal
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-emerald-400">✓</span> Metadata extraction
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-emerald-400">✓</span> JSON validation
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-lg mb-3">Post-processing</h4>
                                <ul className="space-y-2 text-gray-400">
                                    <li className="flex items-center gap-2">
                                        <span className="text-emerald-400">✓</span> Keyword extraction (10 categories)
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-emerald-400">✓</span> Topic identification
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-emerald-400">✓</span> Relevance scoring
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-emerald-400">✓</span> Search indexing
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center">
                        <h3 className="text-3xl font-bold mb-4">
                            Ready to Learn from <span className="gradient-text">Ancient Wisdom</span>?
                        </h3>
                        <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                            Experience authenticated quotes from history's greatest thinkers,
                            processed and categorized for optimal learning.
                        </p>
                        <Link
                            href="/persona-selection"
                            className="inline-block btn-primary"
                        >
                            Start Your Training →
                        </Link>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 px-6 py-12 border-t border-white/10 mt-20">
                <div className="max-w-7xl mx-auto text-center text-gray-500">
                    <p className="mb-2">© 2025 GhostSkill. All rights reserved.</p>
                    <p className="text-sm">Datasets sourced from public domain translations and traditional repositories.</p>
                    <p className="text-xs mt-2">This is a mockup and not a real product.</p>
                </div>
            </footer>
        </div>
    );
}
