
"use client";

import { ArrowRight, BarChart, Cpu, Search, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { HsebliTradeIcon } from "@/components/icons";

const AppleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
    <path d="M10 2c1 .5 2 2 2 5" />
  </svg>
);

const WindowsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21.5 2.5H12v9h9.5z" />
    <path d="M2.5 2.5H11v9H2.5z" />
    <path d="M2.5 13H11v9H2.5z" />
    <path d="M12 13H21.5v9H12z" />
  </svg>
);

const VisualizerIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 14.25L9.75 10.5L13.5 14.25L18 9.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
const TrendsAIIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.25 10.75L12 5.5L6.75 10.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 18.5V5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
const TradeTrackerIcon = (props: React.SVGProps<SVGSVGElement>) => (
     <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.25 7.5L12 11.25L15.75 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8.25 16.5L12 12.75L15.75 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


export default function LandingPage() {
  return (
    <div className="w-full bg-[#050505] text-white overflow-x-hidden">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <HsebliTradeIcon className="w-8 h-8" />
            <span className="text-xl font-bold">HsebliTrade</span>
        </div>
        <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Login</Link>
            <Link href="/signup" className="text-sm font-medium bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 transition-colors">Sign Up</Link>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-20 pb-10 sm:pt-32 sm:pb-20">
          <div className="absolute inset-0 bottom-1/3 bg-grid-pattern opacity-5"></div>
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-green-500/10 to-transparent"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                <span>Trusted by 20,000+ traders</span>
                <span className="text-gray-600">|</span>
                <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400"/> 4.8 rating</span>
            </div>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight max-w-4xl mx-auto">
              All you need to stay ahead in the market.
            </h1>
            <div className="mt-8">
              <Link href="/signup">
                <button className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold text-black bg-green-400 rounded-lg transition-transform transform hover:scale-105">
                  <span className="absolute inset-0 bg-green-300 rounded-lg blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></span>
                  <span className="relative">Get started for free</span>
                  <ArrowRight className="relative w-5 h-5"/>
                </button>
              </Link>
            </div>
             <div className="mt-8 flex items-center justify-center gap-4 text-sm text-gray-400">
                <span>Also available on:</span>
                <AppleIcon className="w-5 h-5"/>
                <WindowsIcon className="w-5 h-5"/>
            </div>
          </div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-16">
            <div className="relative">
                <Image
                    src="https://placehold.co/1200x600.png"
                    alt="HsebliTrade Dashboard"
                    width={1200}
                    height={600}
                    className="rounded-xl shadow-2xl shadow-green-500/10"
                    data-ai-hint="trading dashboard finance"
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
            </div>
          </div>
        </section>

        {/* Feature Sections */}
        <div className="py-20 space-y-28">
            <FeatureSection
                icon={VisualizerIcon}
                title="Visualizer"
                headline="All-in-one Superchart"
                description="Real-time stock and options data straight from the exchange - with news, watchlists, and our proprietary options chart that outperforms the competition, all in one view."
                imageUrl="https://placehold.co/600x400.png"
                imageHint="financial chart graph"
            />
             <FeatureSection
                icon={TrendsAIIcon}
                title="TrendsAI"
                headline="Smarter entries, clearer exits"
                description="Built on thousands of backtests to help you catch trends, spot breakouts, and avoid sitting through the chop."
                imageUrl="https://placehold.co/600x400.png"
                imageHint="ai analytics data"
                reverse
            />
             <FeatureSection
                icon={TradeTrackerIcon}
                title="Trade Tracker"
                headline="Stay on top of every trade"
                description="Your full trading history, automatically organized. Real-time stock and options data, intelligent strategy grouping, and cross-broker support."
                imageUrl="https://placehold.co/600x400.png"
                imageHint="trade history log"
            />
        </div>
      </main>

      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-t border-gray-800 pt-8">
            <div className="flex items-center gap-2">
                <HsebliTradeIcon className="w-7 h-7" />
                <span className="font-semibold">HsebliTrade</span>
            </div>
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} HsebliTrade. Created by Mouaad Idoufkir.</p>
        </div>
      </footer>
    </div>
  );
}


interface FeatureSectionProps {
    icon: React.ElementType;
    title: string;
    headline: string;
    description: string;
    imageUrl: string;
    imageHint: string;
    reverse?: boolean;
}

function FeatureSection({ icon: Icon, title, headline, description, imageUrl, imageHint, reverse = false }: FeatureSectionProps) {
    return (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${reverse ? 'lg:flex-row-reverse' : ''}`}>
                <div className="lg:w-1/2 text-center lg:text-left">
                    <div className="inline-flex items-center gap-3 bg-green-900/50 border border-green-500/30 text-green-300 rounded-lg px-4 py-2">
                        <Icon className="w-8 h-8 p-1 bg-green-500/20 rounded-md" />
                        <span className="font-medium">{title}</span>
                    </div>
                    <h2 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight">
                        {headline}
                    </h2>
                    <p className="mt-4 text-lg text-gray-400">
                        {description}
                    </p>
                </div>
                <div className="lg:w-1/2">
                    <Image
                        src={imageUrl}
                        alt={headline}
                        width={600}
                        height={400}
                        className="rounded-xl shadow-2xl shadow-green-500/10 w-full"
                        data-ai-hint={imageHint}
                    />
                </div>
            </div>
        </section>
    )
}
