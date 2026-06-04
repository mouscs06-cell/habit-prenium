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
 * The media starts as a centered rounded rectangle and expands to full-screen as the user scrolls.
 * Uses clip-path animation (GPU-accelerated, no layout reflow).
 * Children fade in over the full-screen media after expansion completes.
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
        // Desktop initial clip-path: 75% wide × 75% tall, centered, rounded-2xl
        const DESKTOP_INIT = "inset(13% 12.5% 13% 12.5% round 24px)"
        // Mobile initial clip-path: 90% wide × 65% tall
        const MOBILE_INIT = "inset(17% 5% 17% 5% round 16px)"
        const EXPANDED = "inset(0% 0% 0% 0% round 0px)"

        const isMobile =
          typeof window !== "undefined" && window.innerWidth < 768

        // Set initial clip-path immediately (before GSAP kicks in)
        gsap.set(mediaWrapRef.current, {
          clipPath: isMobile ? MOBILE_INIT : DESKTOP_INIT,
        })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
          },
        })

        // 0 → 0.7: media expands to full screen
        tl.to(
          mediaWrapRef.current,
          {
            clipPath: EXPANDED,
            ease: "power2.inOut",
            duration: 0.7,
          },
          0
        )

        // 0 → 0.3: title + hint fade out
        tl.to(
          titleRef.current,
          { opacity: 0, y: -40, ease: "power2.in", duration: 0.3 },
          0
        )
        tl.to(hintRef.current, { opacity: 0, duration: 0.2 }, 0)

        // 0.65 → 1.0: children fade in over full-screen media
        tl.fromTo(
          childrenRef.current,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, ease: "power2.out", duration: 0.35 },
          0.65
        )

        return () => {
          tl.kill()
        }
      })

      return () => mm.revert()
    },
    { scope: containerRef }
  )

  return (
    /* 260vh creates the scroll space for the expansion animation */
    <div ref={containerRef} style={{ height: "260vh" }}>
      {/* Sticky viewport-filling section */}
      <div className="sticky top-0 h-[100dvh] overflow-hidden bg-[#191716]">
        {/* ── Background image (visible before video) ── */}
        <div className="absolute inset-0 z-0">
          <Image
            src={bgImageSrc}
            alt=""
            fill
            className="object-cover opacity-40"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[#191716]/35" aria-hidden="true" />
        </div>

        {/* ── Media (full-screen, revealed via clip-path) ── */}
        <div
          ref={mediaWrapRef}
          className="absolute inset-0 z-10"
          style={{
            /* Initial clip-path set by GSAP — fallback for SSR */
            clipPath: "inset(13% 12.5% 13% 12.5% round 24px)",
            boxShadow: "0px 0px 80px rgba(0, 0, 0, 0.15)",
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
              aria-hidden="true"
            />
          ) : (
            <Image
              src={mediaSrc}
              alt={title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          )}
          {/* Subtle dark overlay on media */}
          <div className="absolute inset-0 bg-black/20" aria-hidden="true" />
        </div>

        {/* ── Title overlay ── */}
        <div
          ref={titleRef}
          className={cn(
            "absolute inset-x-0 top-[28%] z-20 text-center px-6",
            textBlend && "mix-blend-difference"
          )}
        >
          <p className="font-jost text-[9px] uppercase tracking-[0.45em] text-[#f5f2ed]/60 mb-5">
            {date}
          </p>
          <h1 className="font-cormorant italic text-[clamp(3rem,8vw,6.5rem)] text-[#f5f2ed] leading-[0.9]">
            {title}
          </h1>
        </div>

        {/* ── Children (fade in after expansion) ── */}
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
          className="absolute bottom-8 inset-x-0 z-20 flex flex-col items-center gap-3"
          aria-hidden="true"
        >
          <p className="font-jost text-[9px] uppercase tracking-[0.35em] text-[#f5f2ed]/50">
            {scrollToExpand}
          </p>
          <div className="w-px h-10 bg-[#f5f2ed]/20 relative overflow-hidden">
            <div
              className="absolute inset-x-0 top-0 h-1/2 bg-[#f5f2ed]/60"
              style={{
                animation: "scrollHint 1.6s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scrollHint {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(300%); }
        }
      `}</style>
    </div>
  )
}
