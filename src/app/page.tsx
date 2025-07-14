
"use client";

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { TradeVisionIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const featuresRef = useRef<(HTMLDivElement | null)[]>([]);
  const finalCtaRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      delay: 0.5,
      onComplete: () => {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 1,
          ease: 'power2.inOut',
          onComplete: () => {
            router.push('/signup');
          },
        });
      },
    });

    // Initial Intro
    tl.fromTo(
      iconRef.current,
      { scale: 0, opacity: 0, rotation: -270 },
      { scale: 1, opacity: 1, rotation: 0, duration: 1.2, ease: 'power3.out' }
    )
      .fromTo(
        titleRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
        "-=0.7"
      )
      .fromTo(
        subtitleRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
        "-=0.6"
      )
      .to({}, { duration: 1 }); // Pause for dramatic effect

    // Unfold features
    featuresRef.current.forEach((feature, index) => {
      tl.fromTo(
        feature,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'back.out(1.7)',
          delay: index * 0.2,
        },
        "-=0.5"
      );
    });

    tl.to({}, { duration: 1.5 }); // Another pause

    // Final CTA and fade
    tl.fromTo(
        finalCtaRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1, ease: 'power3.out'}
    )
    .to({}, { duration: 2 }); // Final hold before fadeout

  }, [router]);

  return (
    <div
      ref={containerRef}
      className="flex min-h-screen w-full flex-col items-center justify-center bg-background text-center overflow-hidden p-4"
    >
      <div className="flex flex-col items-center gap-4">
        <TradeVisionIcon ref={iconRef} className="h-24 w-24" />
        <h1
          ref={titleRef}
          className="font-headline text-5xl sm:text-7xl font-bold tracking-tighter text-foreground"
        >
          TradeVision
        </h1>
        <p ref={subtitleRef} className="text-lg text-muted-foreground max-w-md">
          Your Personal Trading Journal, Reimagined.
        </p>
      </div>

       <div className="mt-16 flex flex-col sm:flex-row gap-8">
            <div ref={el => featuresRef.current[0] = el} className="opacity-0">
                <h3 className="text-xl font-semibold text-primary">Log Every Detail</h3>
                <p className="text-muted-foreground mt-1">Capture assets, prices, and notes with ease.</p>
            </div>
             <div ref={el => featuresRef.current[1] = el} className="opacity-0">
                <h3 className="text-xl font-semibold text-accent">Analyze Your Performance</h3>
                <p className="text-muted-foreground mt-1">Track P/L, win rates, and key stats.</p>
            </div>
             <div ref={el => featuresRef.current[2] = el} className="opacity-0">
                <h3 className="text-xl font-semibold text-primary">Visualize Your Growth</h3>
                <p className="text-muted-foreground mt-1">Interactive charts show your progress.</p>
            </div>
        </div>

        <p ref={finalCtaRef} className="opacity-0 mt-16 font-headline text-2xl text-foreground">
            Your Journey Starts Now
        </p>

    </div>
  );
}
