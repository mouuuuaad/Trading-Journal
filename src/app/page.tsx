
"use client";

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { HsebliTradeIcon } from '@/components/icons';
import { FilePenLine, PieChart, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const titleGroupRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);
  const titleTextRef = useRef<HTMLHeadingElement>(null);

  const subtitleRef = useRef<HTMLParagraphElement>(null);

  const featuresRef = useRef<HTMLDivElement>(null);
  const feature1Ref = useRef<HTMLDivElement>(null);
  const feature2Ref = useRef<HTMLDivElement>(null);
  const feature3Ref = useRef<HTMLDivElement>(null);

  const finalCtaRef = useRef<HTMLParagraphElement>(null);
  const creatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.set(containerRef.current, { opacity: 1 });

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

    tl.fromTo(
      titleGroupRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.5, ease: 'power3.out' }
    )
    .fromTo(
        iconRef.current,
        { rotation: -360, scale: 0 },
        { rotation: 0, scale: 1, duration: 1, ease: 'back.out(1.7)'},
        "<"
    )
    .fromTo(
        titleTextRef.current,
        { y: 30, opacity: 0},
        { y: 0, opacity: 1, duration: 1, ease: 'power2.out'},
        "-=0.7"
    );

    tl.to({}, { duration: 1 });

    tl.to(titleGroupRef.current, {
        y: () => -(containerRef.current!.clientHeight / 2) + (titleGroupRef.current!.clientHeight / 2) + 40,
        scale: 0.7,
        duration: 1.5,
        ease: 'power2.inOut',
    });

    tl.fromTo(subtitleRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: 'power1.inOut' },
        "<+0.5"
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


    tl.to({}, { duration: 1.5 });

    tl.to([featuresRef.current, subtitleRef.current], {
        opacity: 0,
        y: -30,
        duration: 0.7,
        ease: 'power2.in',
        stagger: 0.1
    });

    tl.fromTo(
        finalCtaRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1.2, ease: 'elastic.out(1, 0.5)'}
    );
     tl.fromTo(
        creatorRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out'},
        "-=0.5"
    );


    tl.to({}, { duration: 2 });

  }, [router]);

  return (
    <div
      ref={containerRef}
      className="flex min-h-screen w-full flex-col items-center justify-center bg-background text-center overflow-hidden p-4 opacity-0"
    >
        <div ref={titleGroupRef} className="absolute flex flex-col items-center gap-4 opacity-0">
            <HsebliTradeIcon ref={iconRef} className="h-24 w-24" />
            <h1 ref={titleTextRef}
            className="font-headline text-5xl sm:text-7xl font-bold tracking-tighter text-foreground"
            >
            HsebliTrade
            </h1>
        </div>

        <p ref={subtitleRef} className="absolute text-lg text-muted-foreground max-w-md opacity-0" style={{top: 'calc(50% - 20px)'}}>
            Your Personal Trading Journal, Reimagined.
        </p>

        <div ref={featuresRef} className="absolute flex w-full justify-center items-start gap-12 sm:gap-20" style={{top: 'calc(50% + 40px)'}}>
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

         <div ref={creatorRef} className="absolute bottom-8 opacity-0">
            <Link href="https://www.instagram.com/mouuuuaad_dev" target="_blank" className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
                <HsebliTradeIcon className="h-5 w-5" />
                <span>Created by Mouaad Idoufkir</span>
            </Link>
        </div>
    </div>
  );
}
