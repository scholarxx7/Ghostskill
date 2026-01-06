import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "GhostSkill - Train Your Mind With History's Greatest Thinkers",
    description: "We don't teach information. We train thinking. Learn decision-making, leadership, and life strategy from AI personas of historical figures like Chanakya, Marcus Aurelius, Napoleon Bonaparte, and Subhas Chandra Bose.",
    keywords: ["AI training", "leadership", "strategy", "historical figures", "decision making", "personal development"],
    authors: [{ name: "GhostSkill" }],
    openGraph: {
        title: "GhostSkill - Train Your Mind With History's Greatest Thinkers",
        description: "We don't teach information. We train thinking.",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>{children}</body>
        </html>
    );
}
