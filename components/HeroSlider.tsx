"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

// Each slide tells one chapter of the Salty's story
const SLIDES = [
  {
    src: "/images/vitalii-kyktov-2xd9c6jQhGs-unsplash.jpg",
    position: "center 60%",
    tag: "Fresh Daily",
    headline: "The Ocean\non a Plate",
    sub: "Scallops, prawns, mussels — every morning's catch, cooked the moment you order.",
    kenBurns: "kenBurns",
  },
  {
    src: "/images/durenne-loris-aEHCeaGSgKA-unsplash.jpg",
    position: "center",
    tag: "Made to Order",
    headline: "Sizzling Hot.\nRight Now.",
    sub: "Nothing sits, nothing waits. Your order goes straight into the pan.",
    kenBurns: "kenBurnsAlt",
  },
  {
    src: "/images/daniel-hooper-0jGbplYqx5w-unsplash.jpg",
    position: "center 40%",
    tag: "Our Kitchen",
    headline: "Crafted\nBy Hand",
    sub: "Our chefs bring years of passion to every dish. You can taste the difference.",
    kenBurns: "kenBurns",
  },
  {
    src: "/images/mia-de-jesus-Oge2GRp4etE-unsplash.jpg",
    position: "center 50%",
    tag: "The Full Spread",
    headline: "A Feast\nWorthy of the Sea",
    sub: "Lobster, prawns, scallops — everything you love, nothing you don't.",
    kenBurns: "kenBurnsAlt",
  },
  {
    src: "/images/jay-wennington-N_Y88TWmGwA-unsplash.jpg",
    position: "center 50%",
    tag: "Pickup & Enjoy",
    headline: "Fine Seafood.\nTakeaway Prices.",
    sub: "Restaurant-quality food without the restaurant bill. Order online in seconds.",
    kenBurns: "kenBurns",
  },
  {
    src: "/images/the-now-time-i1rjJ1FAxRU-unsplash.jpg",
    position: "center 60%",
    tag: "Signature Dish",
    headline: "Crispy.\nLight. Perfect.",
    sub: "Our tempura prawns — golden, airy, and gone before you know it.",
    kenBurns: "kenBurnsAlt",
  },
];

const DURATION = 5800; // ms per slide

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [generation, setGeneration] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((idx: number) => {
    setCurrent(idx);
    setGeneration((g) => g + 1);
  }, []);

  const next = useCallback(
    () => goTo((current + 1) % SLIDES.length),
    [current, goTo]
  );
  const prev = useCallback(
    () => goTo((current - 1 + SLIDES.length) % SLIDES.length),
    [current, goTo]
  );

  // Auto-advance
  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, DURATION);
    return () => clearInterval(id);
  }, [next, paused]);

  return (
    <section
      className="relative overflow-hidden"
      style={{ height: "92vh", minHeight: "580px" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Slides ──────────────────────────────────────────── */}
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{
            opacity: i === current ? 1 : 0,
            transition: "opacity 1.3s ease-in-out",
            zIndex: i === current ? 1 : 0,
          }}
          aria-hidden={i !== current}
        >
          {/* Ken Burns image — remounts on activation to restart animation */}
          <div
            key={i === current ? `img-active-${i}-${generation}` : `img-idle-${i}`}
            className="absolute inset-0 bg-cover"
            style={{
              backgroundImage: `url(${slide.src})`,
              backgroundPosition: slide.position,
              animation:
                i === current
                  ? `${slide.kenBurns} 11s ease-out forwards`
                  : "none",
              willChange: "transform",
            }}
          />

          {/* Dark gradient — left heavy for text, bottom for mood */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(105deg, rgba(5,12,20,0.82) 0%, rgba(5,12,20,0.5) 45%, rgba(5,12,20,0.15) 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(5,12,20,0.75) 0%, rgba(5,12,20,0.05) 50%)",
            }}
          />

          {/* ── Story text — remounts on activation ───────────── */}
          <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-16 lg:px-24">
            <div
              key={
                i === current
                  ? `text-active-${i}-${generation}`
                  : `text-idle-${i}`
              }
            >
              {/* Tag line with decorative rule */}
              <div
                className="flex items-center gap-3 mb-5"
                style={{
                  animation:
                    i === current
                      ? "slideTextIn 0.6s ease-out 0.15s both"
                      : "none",
                }}
              >
                <div
                  className="h-px w-10"
                  style={{ background: "#e05c2a" }}
                />
                <span
                  className="text-[11px] font-bold tracking-[0.22em] uppercase"
                  style={{ color: "#f59e0b" }}
                >
                  {slide.tag}
                </span>
              </div>

              {/* Headline */}
              <h1
                className="font-extrabold text-white leading-none mb-5"
                style={{
                  fontSize: "clamp(2.4rem, 6vw, 5rem)",
                  whiteSpace: "pre-line",
                  textShadow: "0 3px 24px rgba(0,0,0,0.6)",
                  animation:
                    i === current
                      ? "slideTextIn 0.75s ease-out 0.35s both"
                      : "none",
                }}
              >
                {slide.headline}
              </h1>

              {/* Sub */}
              <p
                className="text-base sm:text-lg max-w-sm leading-relaxed mb-8"
                style={{
                  color: "rgba(255,255,255,0.55)",
                  animation:
                    i === current
                      ? "slideTextIn 0.75s ease-out 0.55s both"
                      : "none",
                }}
              >
                {slide.sub}
              </p>

              {/* CTAs */}
              <div
                className="flex flex-wrap gap-3"
                style={{
                  animation:
                    i === current
                      ? "slideTextIn 0.75s ease-out 0.75s both"
                      : "none",
                }}
              >
                <Link
                  href="/menu"
                  className="font-bold text-sm text-white px-7 py-3.5 rounded-full transition"
                  style={{
                    background: "#e05c2a",
                    boxShadow: "0 4px 24px rgba(224,92,42,0.45)",
                  }}
                >
                  Order Now →
                </Link>
                <Link
                  href="/menu"
                  className="font-semibold text-sm px-7 py-3.5 rounded-full transition"
                  style={{
                    border: "1.5px solid rgba(255,255,255,0.25)",
                    color: "rgba(255,255,255,0.75)",
                  }}
                >
                  View Menu
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* ── Slide counter (top right) ───────────────────────── */}
      <div
        className="absolute top-6 right-6 z-10 hidden sm:flex items-center gap-2"
        style={{ animation: "fadeInLeft 0.5s ease-out 1s both" }}
      >
        <span className="text-white font-extrabold text-2xl tabular-nums leading-none">
          {String(current + 1).padStart(2, "0")}
        </span>
        <div className="flex flex-col gap-1 ml-1">
          <div className="w-px h-3 bg-white/30 self-center" />
          <span className="text-white/30 text-xs tabular-nums">
            {String(SLIDES.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* ── Arrow navigation ────────────────────────────────── */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center transition"
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          border: "1.5px solid rgba(255,255,255,0.2)",
          background: "rgba(5,12,20,0.35)",
          backdropFilter: "blur(6px)",
          color: "white",
          fontSize: 22,
          lineHeight: 1,
        }}
      >
        ‹
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center transition"
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          border: "1.5px solid rgba(255,255,255,0.2)",
          background: "rgba(5,12,20,0.35)",
          backdropFilter: "blur(6px)",
          color: "white",
          fontSize: 22,
          lineHeight: 1,
        }}
      >
        ›
      </button>

      {/* ── Pill dots (bottom left) ──────────────────────────── */}
      <div className="absolute bottom-10 left-8 sm:left-16 z-10 flex items-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="transition-all duration-400 rounded-full"
            style={{
              width: i === current ? 28 : 6,
              height: 6,
              background:
                i === current ? "#e05c2a" : "rgba(255,255,255,0.3)",
            }}
          />
        ))}
      </div>

      {/* ── Thumbnail strip (bottom right, desktop) ─────────── */}
      <div className="absolute bottom-6 right-6 z-10 hidden lg:flex gap-2">
        {SLIDES.map((slide, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            className="transition-all duration-300 rounded-lg overflow-hidden"
            style={{
              width: 52,
              height: 36,
              opacity: i === current ? 1 : 0.4,
              outline:
                i === current ? "2px solid #e05c2a" : "2px solid transparent",
              outlineOffset: 2,
              backgroundImage: `url(${slide.src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ))}
      </div>

      {/* ── Progress bar ────────────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10"
        style={{ height: 2, background: "rgba(255,255,255,0.08)" }}
      >
        <div
          key={`progress-${current}-${generation}`}
          style={{
            height: "100%",
            background: "#e05c2a",
            animation: paused ? "none" : `progressBar ${DURATION}ms linear forwards`,
          }}
        />
      </div>
    </section>
  );
}
