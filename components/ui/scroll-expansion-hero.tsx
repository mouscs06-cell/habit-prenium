"use client"

import { useRef } from "react"
import Image from "next/image"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { cn } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger)

interface ScrollExpandMediaProps {
  mediaType: "video" | "image"
  mediaSrc: string
  bgImageSrc: string
  title: string
  date: string
  scrollToExpand?: string
  textBlend?: boolean
  children?: React.ReactNode
}

/**
 * Cinematic scroll-expansion hero.
 * Media starts as a small centered rectangle and expands to full-screen as the user scrolls.
 * Width/height are animated directly (no clip-path) — GPU smooth, no CSS transition delay.
 * The title words separate left/right as media expands.
 */
export default function ScrollExpandMedia({
  mediaType,
  mediaSrc,
  bgImageSrc,
  title,
  date,
  scrollToExpand = "Défiler pour découvrir",
  textBlend = false,
  children,
}: ScrollExpandMediaProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mediaWrapRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const childrenRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const vw = window.innerWidth
        const vh = window.innerHeight
        const isMobile = vw < 768

        const startW = isMobile ? 280 : 500
        const startH = isMobile ? 380 : 550

        // Set initial size — GSAP manages the xPercent/yPercent centering
        gsap.set(mediaWrapRef.current, {
          width: startW,
          height: startH,
          borderRadius: 20,
          xPercent: -50,
          yPercent: -50,
        })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
          },
        })

        // 0 → 0.7: media expands from center outward
        tl.to(
          mediaWrapRef.current,
          {
            width: vw,
            height: vh,
            borderRadius: 0,
            ease: "power2.inOut",
            duration: 0.7,
          },
          0
        )

        // 0 → 0.3: title words separate left/right
        tl.to(".title-word-1", { x: -100, opacity: 0, ease: "power2.in", duration: 0.3 }, 0)
        tl.to(".title-word-2", { x: 100, opacity: 0, ease: "power2.in", duration: 0.3 }, 0)
        tl.to(".hero-date", { y: -30, opacity: 0, duration: 0.25 }, 0)

        // 0 → 0.2: scroll hint fades down
        tl.to(hintRef.current, { y: 30, opacity: 0, duration: 0.2 }, 0)

        // 0.65 → 1.0: children fade in after full expansion
        tl.fromTo(
          childrenRef.current,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, ease: "power2.out", duration: 0.35 },
          0.65
        )

        return () => tl.kill()
      })

      return () => mm.revert()
    },
    { scope: containerRef }
  )

  const [word1, ...rest] = title.split(" ")
  const word2 = rest.join(" ")

  return (
    /* 260vh creates the scroll space for the expansion */
    <div ref={containerRef} style={{ height: "260vh" }}>
      {/* Sticky full-viewport section */}
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-[#191716]">

        {/* ── Background image — fills entire screen behind the media ── */}
        <div className="absolute inset-0 z-0">
          <Image
            src={bgImageSrc}
            alt=""
            fill
            className="object-cover object-center opacity-40"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[#191716]/40" aria-hidden="true" />
        </div>

        {/* ── Media rectangle — starts small centered, expands to fill ── */}
        <div
          ref={mediaWrapRef}
          className="absolute overflow-hidden"
          style={{
            /* Initial values — GSAP will override on mount with correct mobile/desktop sizes */
            width: 500,
            height: 550,
            top: "50%",
            left: "50%",
            /* translate(-50%,-50%) centers the element — GSAP manages this via xPercent/yPercent */
            transform: "translate(-50%, -50%)",
            borderRadius: 20,
            boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
            zIndex: 10,
          }}
        >
          {mediaType === "video" ? (
            <video
              src={mediaSrc}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
              style={{ objectPosition: "center center" }}
              aria-hidden="true"
            />
          ) : (
            <Image
              src={mediaSrc}
              alt={title}
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
            />
          )}
          {/* Subtle dark overlay on media */}
          <div className="absolute inset-0 bg-black/20" aria-hidden="true" />
        </div>

        {/* ── Title — perfectly centered, words separate on scroll ── */}
        <div
          ref={titleRef}
          className={cn(
            "absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 pointer-events-none",
            textBlend && "mix-blend-difference"
          )}
        >
          <p className="hero-date font-jost text-[9px] uppercase tracking-[0.45em] text-[#f5f2ed]/60 mb-5">
            {date}
          </p>
          <h1 className="font-cormorant italic text-[clamp(3rem,8vw,6.5rem)] text-[#f5f2ed] leading-[0.9]">
            <span className="title-word-1 inline-block">{word1}</span>
            {word2 && (
              <>
                {" "}
                <span className="title-word-2 inline-block">{word2}</span>
              </>
            )}
          </h1>
        </div>

        {/* ── Children — fade in after full expansion ── */}
        <div
          ref={childrenRef}
          className="absolute inset-0 z-30 flex items-center justify-center"
          style={{ opacity: 0 }}
        >
          {children}
        </div>

        {/* ── Scroll hint ── */}
        <div
          ref={hintRef}
          className="absolute bottom-8 inset-x-0 z-20 flex flex-col items-center gap-3 pointer-events-none"
          aria-hidden="true"
        >
          <p className="font-jost text-[9px] uppercase tracking-[0.35em] text-[#f5f2ed]/50">
            {scrollToExpand}
          </p>
          <div className="w-px h-10 bg-[#f5f2ed]/20 relative overflow-hidden">
            <div
              className="absolute inset-x-0 top-0 h-1/2 bg-[#f5f2ed]/60"
              style={{ animation: "scrollHint 1.6s ease-in-out infinite" }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scrollHint {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(300%); }
        }
      `}</style>
    </div>
  )
}
