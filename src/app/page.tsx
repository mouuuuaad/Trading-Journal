
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
    // Ensure container is visible before starting animations
    gsap.set(containerRef.current, { opacity: 1 }); 

    const tl = gsap.timeline({
      delay: 0.5,
      onComplete: () => {
        // Final fade out of the entire scene before redirecting
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

    // 1. Initial Intro Animation in the center
    tl.fromTo(
      [iconRef.current, titleRef.current],
      { y: 0, scale: 0, opacity: 0, rotation: -90 },
      { y: 0, scale: 1, opacity: 1, rotation: 0, duration: 1.2, ease: 'power3.out', stagger: 0.2 }
    );

    // 2. Subtitle appears below the title
    tl.fromTo(
        subtitleRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
        "-=0.5" // Overlap with previous animation for smoother transition
      );

    tl.to({}, { duration: 1 }); // Pause to let the user read

    // 3. Main elements move to new positions (top and bottom)
    tl.to([iconRef.current, titleRef.current], {
      y: () => -(containerRef.current!.clientHeight / 2 - 80), // Move to top
      scale: 0.6,
      duration: 1.5,
      ease: 'power2.inOut',
    });
     tl.to(subtitleRef.current, {
      y: () => (containerRef.current!.clientHeight / 2 - 120), // Move to bottom
      opacity: 0.5,
      scale: 0.8,
      duration: 1.5,
      ease: 'power2.inOut',
    }, "<"); // The "<" ensures this animation runs at the same time as the one above


    // 4. Unfold feature list from alternating sides
    tl.fromTo(
      featuresRef.current,
      { opacity: 0, x: (index) => (index % 2 === 0 ? -100 : 100) },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.3
      },
      "-=1" // Overlap for a smooth flow
    );

    tl.to({}, { duration: 1.5 }); // Another pause

    // 5. Fade out features and subtitle to clear the stage
    tl.to([featuresRef.current, subtitleRef.current], {
        opacity: 0,
        duration: 0.7,
        ease: 'power2.in'
    });

    // 6. Final CTA appears in the center
    tl.fromTo(
        finalCtaRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1, ease: 'power3.out'}
    );

    tl.to({}, { duration: 2 }); // Final hold before the main fadeout begins

  }, [router]);

  return (
    <div
      ref={containerRef}
      className="flex min-h-screen w-full flex-col items-center justify-center bg-background text-center overflow-hidden p-4 opacity-0"
    >
        {/* All animated elements are absolutely positioned for full layout control by GSAP */}
        <div className="absolute flex flex-col items-center gap-2">
            <TradeVisionIcon ref={iconRef} className="h-24 w-24 opacity-0" />
            <h1
            ref={titleRef}
            className="font-headline text-5xl sm:text-7xl font-bold tracking-tighter text-foreground opacity-0"
            >
            TradeVision
            </h1>
        </div>

        <p ref={subtitleRef} className="absolute text-lg text-muted-foreground max-w-md opacity-0">
            Your Personal Trading Journal, Reimagined.
        </p>

        <div className="absolute flex flex-col gap-8 text-center">
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

        <p ref={finalCtaRef} className="absolute opacity-0 font-headline text-2xl text-foreground">
            Your Journey Starts Now
        </p>

    </div>
  );
}
