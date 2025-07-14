
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

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            router.push('/signup');
          },
        });
      },
    });

    tl.fromTo(
      iconRef.current,
      { scale: 0, opacity: 0, rotation: -180 },
      { scale: 1, opacity: 1, rotation: 0, duration: 1, ease: 'power3.out' }
    )
      .fromTo(
        titleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
        '-=0.5'
      )
      .fromTo(
        subtitleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        '-=0.4'
      )
      .to({}, { duration: 1.5 }); // Hold the final state for a moment

  }, [router]);

  return (
    <div
      ref={containerRef}
      className="flex min-h-screen w-full flex-col items-center justify-center bg-background text-center overflow-hidden"
    >
      <div className="flex flex-col items-center gap-4">
        <TradeVisionIcon ref={iconRef} className="h-24 w-24" />
        <h1
          ref={titleRef}
          className="font-headline text-5xl sm:text-7xl font-bold tracking-tighter text-foreground"
        >
          TradeVision
        </h1>
        <p ref={subtitleRef} className="text-lg text-muted-foreground">
          Your Personal Trading Journal, Reimagined.
        </p>
      </div>
    </div>
  );
}
