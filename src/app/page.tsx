
"use client";

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { TradeVisionIcon } from '@/components/icons';
import { FilePenLine, PieChart, TrendingUp } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Refs for each element to be animated
  const titleGroupRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);
  const titleTextRef = useRef<HTMLHeadingElement>(null);

  const subtitleRef = useRef<HTMLParagraphElement>(null);
  
  const featuresRef = useRef<HTMLDivElement>(null);
  const feature1Ref = useRef<HTMLDivElement>(null);
  const feature2Ref = useRef<HTMLDivElement>(null);
  const feature3Ref = useRef<HTMLDivElement>(null);

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

    // --- ACT I: THE BLUEPRINT ---
    // The icon is "drawn" and the title is "typed"
    tl.fromTo(
      titleGroupRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.5, ease: 'power3.out' }
    )
    .fromTo(
        iconRef.current,
        { rotation: -360, scale: 0 },
        { rotation: 0, scale: 1, duration: 1, ease: 'back.out(1.7)'},
        "<" // at the same time as the group fades in
    )
    .fromTo(
        titleTextRef.current,
        { y: 30, opacity: 0},
        { y: 0, opacity: 1, duration: 1, ease: 'power2.out'},
        "-=0.7"
    );

    tl.to({}, { duration: 1 }); // Pause to let the title sink in

    // --- ACT II: THE VISION UNFOLDS ---
    // Title moves up, subtitle fades in, features appear
    tl.to(titleGroupRef.current, {
        y: () => -(containerRef.current!.clientHeight / 2 - 80), // Move to top
        scale: 0.7,
        duration: 1.5,
        ease: 'power2.inOut',
    });

    tl.fromTo(subtitleRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: 'power1.inOut' },
        "<+0.5" // Start slightly after the title starts moving
    );

    const features = [feature1Ref.current, feature2Ref.current, feature3Ref.current];
    tl.fromTo(features, {
        opacity: 0,
        y: 50,
        scale: 0.5,
    }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.3
    }, "-=1");


    tl.to({}, { duration: 1.5 }); // Another pause to show the features

    // --- ACT III: THE TRANSFORMATION ---
    // Features and subtitle fade out
    tl.to([featuresRef.current, subtitleRef.current], {
        opacity: 0,
        y: -30,
        duration: 0.7,
        ease: 'power2.in',
        stagger: 0.1
    });

    // --- ACT IV: THE MOTIVATIONAL CLIMAX ---
    // Final CTA appears with impact
    tl.fromTo(
        finalCtaRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1.2, ease: 'elastic.out(1, 0.5)'}
    );

    tl.to({}, { duration: 2 }); // Final hold before the main fadeout begins

  }, [router]);

  return (
    <div
      ref={containerRef}
      className="flex min-h-screen w-full flex-col items-center justify-center bg-background text-center overflow-hidden p-4 opacity-0"
    >
        {/* All animated elements are absolutely positioned for full layout control by GSAP */}
        <div ref={titleGroupRef} className="absolute flex flex-col items-center gap-2 opacity-0">
            <TradeVisionIcon ref={iconRef} className="h-24 w-24" />
            <h1 ref={titleTextRef}
            className="font-headline text-5xl sm:text-7xl font-bold tracking-tighter text-foreground"
            >
            TradeVision
            </h1>
        </div>

        <p ref={subtitleRef} className="absolute bottom-24 text-lg text-muted-foreground max-w-md opacity-0">
            Your Personal Trading Journal, Reimagined.
        </p>

        <div ref={featuresRef} className="absolute flex w-full justify-center items-start gap-12 sm:gap-20">
            <div ref={feature1Ref} className="flex flex-col items-center gap-3 opacity-0">
                <FilePenLine className="h-12 w-12 text-primary" />
                <p className="text-sm font-medium text-muted-foreground">Log</p>
            </div>
             <div ref={feature2Ref} className="flex flex-col items-center gap-3 opacity-0">
                <PieChart className="h-12 w-12 text-accent" />
                <p className="text-sm font-medium text-muted-foreground">Analyze</p>
            </div>
             <div ref={feature3Ref} className="flex flex-col items-center gap-3 opacity-0">
                <TrendingUp className="h-12 w-12 text-primary" />
                <p className="text-sm font-medium text-muted-foreground">Visualize</p>
            </div>
        </div>

        <p ref={finalCtaRef} className="absolute opacity-0 font-headline text-2xl text-foreground">
            Your Journey Starts Now
        </p>

    </div>
  );
}
