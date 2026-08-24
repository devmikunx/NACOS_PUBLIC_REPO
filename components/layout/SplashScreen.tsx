"use client";

import { useState, useEffect, useMemo } from "react";

const TYPING_TEXTS = [
  "Initializing NACOS FUNAAB...",
  "Loading computing resources...",
  "Connecting to the future...",
  "Welcome to innovation!",
];

const SYMBOLS = ["</>", "{}", "[]", "()", "&&", "||", "=>", "++"];

export default function SplashScreen({
  children,
  minDelay = 2000,
}: {
  children: React.ReactNode;
  minDelay?: number;
}) {
  // Always start "true" on both server and client so the very first
  // render matches (no hydration mismatch) and the splash is present in
  // the initial HTML — that's what makes it actually show up instead of
  // the real page flashing in first. Whether it should be skipped (seen
  // already today/this session) was already decided synchronously by the
  // beforeInteractive script in app/layout.tsx, which hides it via the
  // `no-splash` class before anything paints. We just sync React state to
  // that decision on mount below.
  const [showSplash, setShowSplash] = useState(true);

  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  // Stable particles calculation
  const particles = useMemo(() => 
    Array.from({ length: 20 }, (_, i) => ({
      left: `${(i * 37 + 11) % 100}%`,
      top: `${(i * 53 + 7) % 100}%`,
      delay: `${(i * 0.3) % 3}s`,
    })), []);

  // On mount, check whether the beforeInteractive script already decided
  // to skip the splash (already seen it today/this session). If so, drop
  // it immediately — it was already invisible via CSS the whole time, so
  // this causes no visible change. Otherwise, run the normal dismissal
  // timer.
  useEffect(() => {
    const skip = document.documentElement.classList.contains("no-splash");
    // Skip case: 0ms so it's dismissed as soon as possible — it was
    // already invisible via CSS this whole time, so there's nothing to
    // see. Either way the setState happens inside the timer callback
    // (async), not synchronously in the effect body.
    const delay = skip ? 0 : minDelay;

    const timer = setTimeout(() => {
      setShowSplash(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [minDelay]);

  // Typing animation loop
  useEffect(() => {
    if (!showSplash) return;

    const currentText = TYPING_TEXTS[textIndex];
    if (!currentText) return;

    let timer: NodeJS.Timeout;

    if (displayText.length < currentText.length) {
      timer = setTimeout(() => {
        setDisplayText(currentText.slice(0, displayText.length + 1));
      }, 50);
    } else if (textIndex < TYPING_TEXTS.length - 1) {
      timer = setTimeout(() => {
        setDisplayText("");
        setTextIndex((i) => i + 1);
      }, 800);
    }

    return () => clearTimeout(timer);
  }, [displayText, textIndex, showSplash]);

  // Cursor blink loop
  useEffect(() => {
    if (!showSplash) return;
    const id = setInterval(() => setShowCursor((p) => !p), 500);
    return () => clearTimeout(id);
  }, [showSplash]);

  return (
    <>
      {/* The main website content */}
      <div aria-hidden={showSplash}>{children}</div>

      {/* The Splash Overlay */}
      {showSplash && (
        <div
          id="app-splash"
          className="fixed inset-0 bg-zinc-950 flex items-center justify-center z-[9999]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-emerald-950 to-emerald-900 overflow-hidden">
            {particles.map((p, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-emerald-400/20 rounded-full animate-pulse"
                style={{ left: p.left, top: p.top, animationDelay: p.delay }}
              />
            ))}
          </div>

          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
            {SYMBOLS.map((symbol, i) => (
              <div
                key={i}
                className="absolute text-emerald-500 font-mono text-base sm:text-xl animate-bounce"
                style={{
                  left: `${(i * 18) % 90}%`,
                  top: `${(i * 14) % 80}%`,
                  animationDelay: `${i * 0.2}s`,
                }}
              >
                {symbol}
              </div>
            ))}
          </div>

          <div className="relative z-10 w-[88%] max-w-sm sm:max-w-md md:max-w-xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 sm:mb-12">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600">
                NACOS
              </h1>
              <p className="text-emerald-500/60 font-mono tracking-[0.2em] sm:tracking-[0.3em] text-xs sm:text-sm mt-2 uppercase">
                Funaab Chapter
              </p>
            </div>

            <div className="bg-black/40 backdrop-blur-md border border-emerald-500/20 rounded-xl p-4 sm:p-6 shadow-2xl">
              <div className="flex gap-2 mb-3 sm:mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
              </div>
              <div className="font-mono text-emerald-400 text-xs sm:text-sm md:text-base break-words">
                <span className="opacity-50 mr-2">$</span>
                {displayText}
                <span className={showCursor ? "opacity-100" : "opacity-0"}>_</span>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 px-1 sm:px-2">
              <div className="h-1 w-full bg-emerald-950 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500" 
                  style={{ animation: `loadBar ${minDelay}ms linear forwards` }} 
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes loadBar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </>
  );
}