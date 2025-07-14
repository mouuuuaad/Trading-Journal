
"use client";

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { TradeVisionIcon } from '@/components/icons';
import { FilePenLine, PieChart, TrendingUp } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const titleGroupRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
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
      titleGroupRef.current,
      { y: 0, scale: 0, opacity: 0, rotation: -90 },
      { y: 0, scale: 1, opacity: 1, rotation: 0, duration: 1.2, ease: 'power3.out' }
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
    tl.to(titleGroupRef.current, {
      y: () => -(containerRef.current!.clientHeight / 2 - 80), // Move to top
      scale: 0.7,
      duration: 1.5,
      ease: 'power2.inOut',
    });
     tl.to(subtitleRef.current, {
      y: () => (containerRef.current!.clientHeight / 2 - 120), // Move to bottom
      opacity: 0.5,
      scale: 0.9,
      duration: 1.5,
      ease: 'power2.inOut',
    }, "<"); // The "<" ensures this animation runs at the same time as the one above


    // 4. Animate in the icons and their labels
    const icons = gsap.utils.toArray('.feature-icon');
    const labels = gsap.utils.toArray('.feature-label');

    tl.fromTo(icons, {
        opacity: 0,
        scale: 0,
        y: (i) => (i % 2 === 0 ? -100 : 100),
        x: (i) => (i === 1 ? 0 : (i === 0 ? -150 : 150))
    }, {
        opacity: 1,
        scale: 1,
        y: 0,
        x: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.2
    }, "-=1");

    tl.fromTo(labels, {
        opacity: 0,
        y: 20,
    }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2
    }, "-=0.5");


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
        <div ref={titleGroupRef} className="absolute flex flex-col items-center gap-2 opacity-0">
            <TradeVisionIcon className="h-24 w-24" />
            <h1
            className="font-headline text-5xl sm:text-7xl font-bold tracking-tighter text-foreground"
            >
            TradeVision
            </h1>
        </div>

        <p ref={subtitleRef} className="absolute text-lg text-muted-foreground max-w-md opacity-0">
            Your Personal Trading Journal, Reimagined.
        </p>

        <div ref={featuresRef} className="absolute flex w-full justify-center items-start gap-12 sm:gap-20">
            <div className="flex flex-col items-center gap-3">
                <FilePenLine className="feature-icon h-12 w-12 text-primary opacity-0" />
                <p className="feature-label text-sm font-medium text-muted-foreground opacity-0">Log</p>
            </div>
             <div className="flex flex-col items-center gap-3">
                <PieChart className="feature-icon h-12 w-12 text-accent opacity-0" />
                <p className="feature-label text-sm font-medium text-muted-foreground opacity-0">Analyze</p>
            </div>
             <div className="flex flex-col items-center gap-3">
                <TrendingUp className="feature-icon h-12 w-12 text-primary opacity-0" />
                <p className="feature-label text-sm font-medium text-muted-foreground opacity-0">Visualize</p>
            </div>
        </div>

        <p ref={finalCtaRef} className="absolute opacity-0 font-headline text-2xl text-foreground">
            Your Journey Starts Now
        </p>

    </div>
  );
}
