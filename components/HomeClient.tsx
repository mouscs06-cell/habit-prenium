"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { WordReveal } from "@/components/WordReveal"
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero"
import { useCart } from "@/context/CartContext"
import { CONFIG } from "@/CLIENT_CONFIG"
import type { Product } from "@/lib/products"
import { cn } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger, useGSAP)

// ─── SVG Icons ─────────────────────────────────────────────────────────────────

function IconShip() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" strokeWidth="1.2" stroke="currentColor"><path d="M2 12l2.5-6h11L18 12"/><path d="M1 15c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2"/></svg>
}
function IconLeaf() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" strokeWidth="1.2" stroke="currentColor"><path d="M4 16s1-8 8-10c2-.5 5-.5 5-.5s0 3-2 6c-2 3-5 4.5-5 4.5"/><path d="M4 16L10 10"/></svg>
}
function IconFlag() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" strokeWidth="1.2" stroke="currentColor"><path d="M4 3v14M4 3h12l-3 5 3 5H4"/></svg>
}
function IconReturn() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" strokeWidth="1.2" stroke="currentColor"><path d="M3 9l4-4-4-4"/><path d="M7 5H13a4 4 0 010 8H4"/></svg>
}

const ICONS: Record<string, React.FC> = { ship: IconShip, leaf: IconLeaf, flag: IconFlag, return: IconReturn }

// ─── Section label with animated golden line ──────────────────────────────────

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-4 mb-5">
      <motion.div
        className="h-px w-7 bg-[#8a7d6b] origin-left"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
      />
      <span className="font-jost text-[11px] tracking-[0.4em] uppercase text-[#8a7d6b]">
        {text}
      </span>
    </div>
  )
}

// ─── Section divider (expanding animated line) ────────────────────────────────

function SectionDivider({ dark = false }: { dark?: boolean }) {
  return (
    <div className={cn("px-6 lg:px-14 overflow-hidden", dark ? "bg-[#191716]" : "bg-[#f5f2ed]")}>
      <motion.div
        className={cn("h-px origin-left", dark ? "bg-[#f5f2ed]/10" : "bg-[#191716]/10")}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      />
    </div>
  )
}

// ─── Fill CTA button (fill slides from left) ──────────────────────────────────

function FillButton({
  href,
  dark = false,
  children,
  onClick,
  type,
}: {
  href?: string
  dark?: boolean
  children: React.ReactNode
  onClick?: () => void
  type?: "submit" | "button"
}) {
  const cls = cn(
    "group relative overflow-hidden inline-flex items-center justify-center rounded-full min-h-[52px] px-10 py-4 cursor-pointer",
    dark ? "border border-[#f5f2ed]/40" : "border border-[#191716]"
  )
  const inner = (
    <>
      <span
        className={cn(
          "absolute inset-0 rounded-full origin-left scale-x-0 group-hover:scale-x-100",
          "transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]",
          dark ? "bg-[#f5f2ed]" : "bg-[#191716]"
        )}
        aria-hidden="true"
      />
      <span
        className={cn(
          "relative z-10 font-jost text-[10px] tracking-[0.3em] uppercase transition-colors duration-300 delay-75",
          dark
            ? "text-[#f5f2ed] group-hover:text-[#191716]"
            : "text-[#191716] group-hover:text-[#f5f2ed]"
        )}
      >
        {children}
      </span>
    </>
  )

  if (onClick || type === "submit")
    return (
      <button type={type ?? "button"} onClick={onClick} className={cls}>
        {inner}
      </button>
    )
  return <Link href={href!} className={cls}>{inner}</Link>
}

// ─── Hover image with gradient overlay + "VOIR →" ─────────────────────────────

function HoverImg({
  src,
  alt,
  sizes,
  priority = false,
}: {
  src: string
  alt: string
  sizes: string
  priority?: boolean
}) {
  return (
    <>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        sizes={sizes}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />
      {/* "VOIR →" label */}
      <div className="absolute inset-0 flex items-end justify-start p-5 z-20 pointer-events-none">
        <span className="font-jost text-[9px] tracking-[0.4em] uppercase text-[#f5f2ed] opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          VOIR →
        </span>
      </div>
    </>
  )
}

// ─── Magnetic lookbook image ──────────────────────────────────────────────────

function MagneticImage({ src, aspect }: { src: string; aspect: string }) {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 200, damping: 30 })
  const y = useSpring(rawY, { stiffness: 200, damping: 30 })

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    rawX.set(((e.clientX - r.left - r.width / 2) / r.width) * 8)
    rawY.set(((e.clientY - r.top - r.height / 2) / r.height) * 8)
  }
  const handleLeave = () => { rawX.set(0); rawY.set(0) }

  return (
    <motion.div
      style={{ x, y }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={cn("relative overflow-hidden rounded-xl bg-[#ede9e3] group cursor-pointer", aspect)}
    >
      <Image
        src={src}
        alt="AURÈLE lookbook"
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        sizes="(max-width: 640px) 50vw, 33vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <div className="absolute bottom-4 left-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
        <span className="font-jost text-[9px] tracking-[0.4em] uppercase text-[#f5f2ed]">VOIR →</span>
      </div>
    </motion.div>
  )
}

// ─── Animated counter ─────────────────────────────────────────────────────────

// ─── Editorial product card — image pleine avec overlay titre/prix ────────────

function EditorialProductCard({
  product,
  aspect = "aspect-[3/4]",
  sizes = "(max-width: 640px) 50vw, 25vw",
}: {
  product: Product
  aspect?: string
  sizes?: string
}) {
  const { addItem } = useCart()
  const [hovered, setHovered] = useState(false)

  return (
    <div data-fade-up>
      <Link
        href={`/products/${product.id}`}
        className="group relative overflow-hidden rounded-2xl block"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className={cn("relative", aspect)}>
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            sizes={sizes}
          />
          {/* Gradient always-visible pour lisibilité */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          {/* Badge */}
          {product.badge && (
            <span className="absolute top-4 left-4 font-jost text-[11px] uppercase tracking-[0.2em] bg-[#f5f2ed] text-[#191716] px-2.5 py-1 z-20">
              {product.badge}
            </span>
          )}
          {/* Info en overlay bas */}
          <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
            <p className="font-cormorant italic text-lg text-white leading-tight">{product.title}</p>
            <p className="font-jost text-[13px] text-white/65 mt-0.5">{product.price} €</p>
          </div>
          {/* Bouton Ajouter slide-up */}
          <motion.div
            className="absolute inset-x-0 bottom-0 bg-[#f5f2ed]/95 flex items-center justify-center py-3 z-20"
            initial={{ y: "100%" }}
            animate={{ y: hovered ? 0 : "100%" }}
            transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
          >
            <button
              onClick={(e) => {
                e.preventDefault()
                addItem({
                  id: product.id,
                  title: product.title,
                  price: product.price,
                  image: product.image,
                  subtitle: product.subtitle,
                })
              }}
              className="font-jost text-[12px] uppercase tracking-[0.2em] text-[#191716] hover:text-[#8a7d6b] transition-colors"
            >
              Ajouter au panier
            </button>
          </motion.div>
        </div>
      </Link>
    </div>
  )
}

// ─── Testimonial card (premium glassmorphism) ─────────────────────────────────

function TestimonialCard({ t }: { t: { name: string; text: string; rating: number } }) {
  return (
    <div className="group flex-shrink-0 w-[380px] relative overflow-hidden rounded-2xl p-8 bg-white/60 backdrop-blur-sm border border-[#191716]/[0.04] hover:bg-white hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:border-[#8a7d6b]/20 cursor-default [transition:background-color_0.35s,border-color_0.35s,box-shadow_0.35s]">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8a7d6b]/30 to-transparent group-hover:via-[#8a7d6b]/60 transition-all duration-500" />

      {/* Guillemet décoratif */}
      <span
        className="block font-cormorant text-7xl text-[#8a7d6b]/10 leading-none mb-3 select-none group-hover:text-[#8a7d6b]/25 group-hover:translate-x-1 transition-all duration-300"
        aria-hidden="true"
      >
        &ldquo;
      </span>

      {/* Étoiles animées */}
      <div className="flex gap-1.5 mb-5" aria-label={`${t.rating} étoiles`}>
        {[0, 1, 2, 3, 4].map((j) => (
          <span
            key={j}
            className="text-[#8a7d6b] text-sm inline-block transition-all duration-200 group-hover:scale-125 group-hover:rotate-12"
            style={{ transitionDelay: `${j * 40}ms` }}
            aria-hidden="true"
          >
            ★
          </span>
        ))}
      </div>

      {/* Citation */}
      <p className="font-cormorant italic text-[18px] text-[#191716] leading-[1.65] mb-6">
        &ldquo;{t.text}&rdquo;
      </p>

      {/* Séparateur animé */}
      <div className="h-px w-8 bg-[#8a7d6b]/20 mb-4 group-hover:w-16 transition-all duration-500" />

      {/* Nom */}
      <p className="font-jost text-[12px] tracking-[0.3em] uppercase text-[#7a756e] group-hover:text-[#8a7d6b] group-hover:tracking-[0.35em] transition-all duration-300">
        {t.name}
      </p>
    </div>
  )
}

// ─── Animated counter ─────────────────────────────────────────────────────────

function AnimatedCounter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const triggered = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !triggered.current) {
        triggered.current = true
        const t0 = performance.now()
        const dur = 1800
        const ease = (t: number) => 1 - Math.pow(1 - t, 3)
        const step = (now: number) => {
          const p = Math.min((now - t0) / dur, 1)
          el.textContent = Math.round(ease(p) * end).toLocaleString("fr-FR") + suffix
          if (p < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      }
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [end, suffix])

  return <span ref={ref}>0{suffix}</span>
}

// ─── Product card (with full hover suite) ────────────────────────────────────

function ProductCard({ product, panoramic = false, index = 0 }: {
  product: Product; panoramic?: boolean; index?: number
}) {
  const { addItem } = useCart()
  const [hovered, setHovered] = useState(false)

  return (
    <div data-fade-up>
      <Link
        href={`/products/${product.id}`}
        className="group block transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)]"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image */}
        <div
          className={cn(
            "relative overflow-hidden bg-[#ede9e3]",
            panoramic ? "aspect-[21/9] rounded-xl" : "aspect-[3/4] rounded-lg"
          )}
          data-reveal
        >
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            sizes={panoramic ? "100vw" : "(max-width: 640px) 50vw, 25vw"}
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />
          {/* Badge */}
          {product.badge && (
            <span className="absolute top-4 left-4 font-jost text-[11px] uppercase tracking-[0.2em] bg-[#f5f2ed] text-[#191716] px-2.5 py-1 z-20">
              {product.badge}
            </span>
          )}
          {/* "Ajouter" — Framer Motion slide-up */}
          <motion.div
            className="absolute inset-x-0 bottom-0 bg-[#f5f2ed] flex items-center justify-center py-3 z-20"
            initial={{ y: "100%" }}
            animate={{ y: hovered ? 0 : "100%" }}
            transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
          >
            <button
              onClick={(e) => {
                e.preventDefault()
                addItem({ id: product.id, title: product.title, price: product.price, image: product.image, subtitle: product.subtitle })
              }}
              className="font-jost text-[9px] uppercase tracking-[0.2em] text-[#191716] hover:text-[#8a7d6b] transition-colors"
            >
              Ajouter au panier
            </button>
          </motion.div>
        </div>

        {/* Info */}
        <div className="mt-3 flex justify-between items-baseline gap-2">
          <div className="min-w-0">
            <p className="font-jost text-[10px] uppercase tracking-[0.12em] text-[#191716] group-hover:text-[#8a7d6b] transition-colors duration-300 truncate">
              {product.title}
            </p>
            <p className="font-jost text-[9px] text-[#7a756e] truncate mt-0.5">{product.subtitle}</p>
          </div>
          <p className="font-cormorant text-xl text-[#191716] flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1">
            {product.price} €
          </p>
        </div>
      </Link>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function HomeClient({ products }: { products: Product[] }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {

        // ── Word reveals (FAST: duration 0.6, stagger 0.03) ──
        gsap.utils.toArray<Element>("[data-word-section]").forEach((section) => {
          const words = section.querySelectorAll(".word")
          if (!words.length) return
          gsap.from(words, {
            y: "110%", opacity: 0,
            stagger: 0.03, duration: 0.6, ease: "power4.out",
            scrollTrigger: { trigger: section, start: "top 90%" },
          })
        })

        // ── Clip-path reveals (FAST: 0.8s power3.out, no inner scale conflict) ──
        gsap.utils.toArray<Element>("[data-reveal]").forEach((wrap) => {
          gsap.from(wrap, {
            clipPath: "inset(100% 0 0 0)",
            duration: 0.8, ease: "power3.out",
            scrollTrigger: { trigger: wrap, start: "top 90%" },
          })
        })

        // ── Fade up (FAST: 0.5s power2.out) ──
        gsap.utils.toArray<Element>("[data-fade-up]").forEach((el) => {
          gsap.from(el, {
            y: 30, opacity: 0, duration: 0.5, ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 90%" },
          })
        })

        // ── Parallax ──
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          const depth = parseInt(el.dataset.parallaxDepth ?? "60")
          gsap.to(el, {
            y: -depth, ease: "none",
            scrollTrigger: {
              trigger: el.parentElement ?? el,
              start: "top bottom", end: "bottom top", scrub: 1,
            },
          })
        })

        // ── Campaign slide-in ──
        gsap.utils.toArray<Element>("[data-slide-left]").forEach((el) => {
          gsap.from(el, { x: -80, opacity: 0, duration: 0.6, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%" } })
        })
        gsap.utils.toArray<Element>("[data-slide-right]").forEach((el) => {
          gsap.from(el, { x: 80, opacity: 0, duration: 0.6, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%" } })
        })

        // ── Stagger children (FAST: 0.04s stagger) ──
        gsap.utils.toArray<Element>("[data-stagger]").forEach((container) => {
          gsap.from(Array.from(container.children), {
            y: 20, opacity: 0, stagger: 0.04, duration: 0.5, ease: "power3.out",
            scrollTrigger: { trigger: container, start: "top 90%" },
          })
        })

        // ── Scale-in circles ──
        gsap.utils.toArray<Element>("[data-scale-in]").forEach((el, i) => {
          gsap.from(el, {
            scale: 0, opacity: 0, duration: 0.55, ease: "back.out(1.4)", delay: i * 0.1,
            scrollTrigger: { trigger: el, start: "top 90%" },
          })
        })

        // Testimonials handled by Framer Motion whileInView (no GSAP needed)
      })
      return () => mm.revert()
    },
    { scope: containerRef }
  )

  const p = products // alias

  return (
    <div ref={containerRef}>

      {/* ══════════════════════════════════════════════════════
          SECTION 1 — HERO (Scroll Expansion) — INTACT
      ══════════════════════════════════════════════════════ */}
      <ScrollExpandMedia
        mediaType="video"
        mediaSrc="/video.mp4"
        bgImageSrc="/habit1.jpg"
        title="AURÈLE Paris"
        date="Automne-Hiver 2025"
        scrollToExpand="Défiler pour découvrir"
        textBlend={true}
      >
        <div className="max-w-3xl mx-auto text-center px-6 py-16">
          <p className="font-jost text-[9px] tracking-[0.5em] uppercase text-[#8a7d6b] mb-6">
            NOUVELLE COLLECTION
          </p>
          <h2 className="font-cormorant italic text-[clamp(2.5rem,6vw,5rem)] text-[#f5f2ed] leading-[0.95] mb-8">
            L&apos;essentiel,<br />simplement
          </h2>
          <p className="font-jost text-[13px] text-[#f5f2ed]/60 leading-[1.9] max-w-md mx-auto mb-10">
            Des vêtements qui durent. Des matières qui racontent. Un vestiaire qui se simplifie.
          </p>
          <FillButton href="/catalog" dark>
            Découvrir la collection
          </FillButton>
        </div>
      </ScrollExpandMedia>

      {/* ══════════════════════════════════════════════════════
          SECTION 2 — COLLECTION PHARE (#f5f2ed) — Éditorial
      ══════════════════════════════════════════════════════ */}
      <SectionDivider dark={false} />
      <section className="bg-[#f5f2ed] py-20 lg:py-32 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-14">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 lg:mb-14 gap-4">
            <div data-word-section>
              <SectionLabel text="COLLECTION AH-25" />
              <WordReveal
                text="Le vestiaire essentiel"
                as="h2"
                className="font-cormorant italic text-4xl lg:text-5xl text-[#191716]"
              />
            </div>
            <Link
              href="/catalog"
              className="font-jost text-[12px] text-[#7a756e] uppercase tracking-[0.2em] hover:text-[#191716] transition-colors flex items-center gap-3 self-start sm:self-auto group"
            >
              Explorer tout
              <span className="w-6 h-px bg-current transition-all duration-300 group-hover:w-10" aria-hidden="true" />
            </Link>
          </div>

          {/* Grid éditorial 12 colonnes */}
          <div className="grid grid-cols-12 gap-3 lg:gap-4">

            {/* Grande image gauche — 7 colonnes */}
            {p[0] && (
              <Link
                href={`/products/${p[0].id}`}
                className="col-span-12 md:col-span-7 group relative overflow-hidden rounded-2xl block"
                data-reveal
              >
                <div className="relative aspect-[3/4]">
                  <div data-parallax data-parallax-depth="60" className="absolute inset-0 scale-[1.1]">
                    <Image
                      src="/habit2.jpg"
                      alt={p[0].title}
                      fill
                      priority
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 58vw"
                    />
                  </div>
                  {/* Gradient always */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                  {/* Badge */}
                  {p[0].badge && (
                    <span className="absolute top-5 left-5 font-jost text-[11px] uppercase tracking-[0.2em] bg-[#f5f2ed] text-[#191716] px-3 py-1.5 z-30">
                      {p[0].badge}
                    </span>
                  )}
                  {/* Info overlay bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                    <p className="font-cormorant italic text-2xl text-white leading-tight mb-1">{p[0].title}</p>
                    <p className="font-jost text-[13px] text-white/70">{p[0].price} €</p>
                  </div>
                  {/* Hover: "VOIR →" */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <span className="font-jost text-[9px] tracking-[0.4em] uppercase text-white bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm">
                      VOIR →
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {/* Colonne droite — 5 colonnes, 2 images */}
            <div className="col-span-12 md:col-span-5 flex flex-col gap-3 lg:gap-4">
              {p[1] && (
                <Link
                  href={`/products/${p[1].id}`}
                  className="group relative overflow-hidden rounded-2xl flex-1 block"
                  data-reveal
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src="/habit3.jpg"
                      alt={p[1].title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 42vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                      <p className="font-cormorant italic text-xl text-white">{p[1].title}</p>
                      <p className="font-jost text-[13px] text-white/70 mt-0.5">{p[1].price} €</p>
                    </div>
                  </div>
                </Link>
              )}
              {p[4] && (
                <Link
                  href={`/products/${p[4].id}`}
                  className="group relative overflow-hidden rounded-2xl flex-1 block"
                  data-reveal
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src="/habit5.jpg"
                      alt={p[4].title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 42vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                      {p[4].badge && (
                        <span className="font-jost text-[9px] tracking-[0.3em] uppercase text-white/70 block mb-1">
                          {p[4].badge}
                        </span>
                      )}
                      <p className="font-cormorant italic text-xl text-white">{p[4].title}</p>
                      <p className="font-jost text-[13px] text-white/70 mt-0.5">{p[4].price} €</p>
                    </div>
                  </div>
                </Link>
              )}
            </div>

            {/* Panoramique pleine largeur */}
            <Link
              href="/catalog"
              className="col-span-12 group relative overflow-hidden rounded-2xl block"
              data-reveal
            >
              <div className="relative aspect-[21/8]">
                <div data-parallax data-parallax-depth="80" className="absolute inset-0 scale-[1.1]">
                  <Image
                    src="/habit4.jpg"
                    alt="Découvrir la collection AURÈLE"
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    sizes="100vw"
                  />
                </div>
                <div className="absolute inset-0 bg-black/15 group-hover:bg-black/28 transition-colors duration-400" />
                <div className="absolute bottom-8 left-8 flex items-center gap-4">
                  <p className="font-jost text-[10px] tracking-[0.4em] uppercase text-white/80 group-hover:text-white transition-colors duration-300">
                    EXPLORER LA COLLECTION
                  </p>
                  <span className="w-8 h-px bg-white/50 group-hover:w-14 transition-all duration-400" aria-hidden="true" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 3 — PHILOSOPHIE (#191716 dark)
      ══════════════════════════════════════════════════════ */}
      <SectionDivider dark={true} />
      <section className="bg-[#191716] py-24 lg:py-40">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

            {/* Image */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-3xl order-2 lg:order-1" data-fade-up>
              <div data-parallax data-parallax-depth="60" className="absolute inset-0 scale-[1.12]">
                <Image src="/habit6.avif" alt="Philosophie AURÈLE" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
              </div>
            </div>

            {/* Text */}
            <div className="order-1 lg:order-2">
              <SectionLabel text="NOTRE PHILOSOPHIE" />
              <div data-word-section>
                <WordReveal
                  text={"Des vêtements\nqui durent"}
                  as="h2"
                  className="font-cormorant italic text-[clamp(2.5rem,5vw,4rem)] text-[#f5f2ed] leading-[1.1] mb-8"
                />
              </div>
              <p className="font-jost text-[12px] text-[#f5f2ed]/70 leading-[2.1] mb-10 max-w-[380px]" data-fade-up>
                Nous créons des pièces intemporelles taillées dans les meilleures matières du monde. Chaque vêtement est pensé pour traverser les saisons sans jamais se démoder.
              </p>
              <div className="space-y-4 mb-12" data-stagger>
                {["Matières nobles", "Fabrication responsable", "Design intemporel"].map((val) => (
                  <div key={val} className="flex items-center gap-4">
                    <span className="w-4 h-px bg-[#8a7d6b] flex-shrink-0" />
                    <p className="font-jost text-[11px] uppercase tracking-[0.15em] text-[#f5f2ed]/70">{val}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-6 pt-10 border-t border-[#f5f2ed]/10" data-fade-up>
                {[
                  { value: 2000, suffix: "+", label: "Clients satisfaits" },
                  { value: 8, suffix: "", label: "Matières nobles" },
                  { value: 100, suffix: "%", label: "Fait avec intention" },
                  { value: 30, suffix: "j", label: "Retours gratuits" },
                ].map((stat) => (
                  <div key={stat.label} className="border-l border-[#f5f2ed]/10 pl-4">
                    <p className="font-cormorant text-3xl text-[#f5f2ed] leading-none mb-1">
                      <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                    </p>
                    <p className="font-jost text-[9px] uppercase tracking-[0.2em] text-[#f5f2ed]/45">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 4 — GRILLE PRODUITS (#f5f2ed)
      ══════════════════════════════════════════════════════ */}
      <SectionDivider dark={false} />
      <section className="bg-[#f5f2ed] py-20 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 lg:mb-14 gap-4">
            <div data-word-section>
              <SectionLabel text="COLLECTION COMPLÈTE" />
              <WordReveal
                text={"Nos pièces\nessentielles"}
                as="h2"
                className="font-cormorant italic text-4xl lg:text-5xl text-[#191716]"
              />
            </div>
            <p className="font-jost text-[13px] text-[#7a756e] max-w-[200px] leading-relaxed" data-fade-up>
              Des pièces pensées pour traverser les saisons.
            </p>
          </div>

          {/* Grid 12 colonnes asymétrique */}
          <div className="grid grid-cols-12 gap-3 lg:gap-4">

            {/* Rangée 1 : 6 + 6 */}
            {p[0] && (
              <div className="col-span-6">
                <EditorialProductCard product={p[0]} aspect="aspect-[3/4]" sizes="(max-width: 640px) 50vw, 50vw" />
              </div>
            )}
            {p[1] && (
              <div className="col-span-6">
                <EditorialProductCard product={p[1]} aspect="aspect-[3/4]" sizes="(max-width: 640px) 50vw, 50vw" />
              </div>
            )}

            {/* Rangée 2 : 4 + 4 + 4 */}
            {p[2] && (
              <div className="col-span-4">
                <EditorialProductCard product={p[2]} aspect="aspect-[3/4]" sizes="(max-width: 640px) 50vw, 33vw" />
              </div>
            )}
            {p[3] && (
              <div className="col-span-4">
                <EditorialProductCard product={p[3]} aspect="aspect-[3/4]" sizes="(max-width: 640px) 50vw, 33vw" />
              </div>
            )}
            {p[4] && (
              <div className="col-span-4">
                <EditorialProductCard product={p[4]} aspect="aspect-[3/4]" sizes="(max-width: 640px) 50vw, 33vw" />
              </div>
            )}

            {/* Rangée 3 : 7 (paysage) + 5 (portrait) */}
            {p[5] && (
              <div className="col-span-12 lg:col-span-7">
                <EditorialProductCard product={p[5]} aspect="aspect-[4/3] lg:aspect-[4/3]" sizes="(max-width: 1024px) 100vw, 58vw" />
              </div>
            )}
            {p[6] && (
              <div className="col-span-12 lg:col-span-5">
                <EditorialProductCard product={p[6]} aspect="aspect-[3/4]" sizes="(max-width: 1024px) 100vw, 42vw" />
              </div>
            )}

            {/* Rangée 4 : panoramique pleine largeur */}
            {p[7] && (
              <div className="col-span-12">
                <EditorialProductCard product={p[7]} aspect="aspect-[21/8]" sizes="100vw" />
              </div>
            )}
          </div>

          <div className="text-center mt-12 lg:mt-16" data-fade-up>
            <FillButton href="/catalog">Voir toutes les collections</FillButton>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 5 — MATIÈRES (#191716 dark)
      ══════════════════════════════════════════════════════ */}
      <SectionDivider dark={true} />
      <section className="bg-[#191716] py-24 lg:py-36">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-14">
          <div className="mb-14 lg:mb-20" data-fade-up>
            <SectionLabel text="NOS MATIÈRES" />
            <div data-word-section>
              <WordReveal
                text={"La noblesse\ndes fibres"}
                as="h2"
                className="font-cormorant italic text-4xl lg:text-5xl text-[#f5f2ed]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
            {[
              { img: "/habit15.jpg", name: "Cachemire Mongol", origin: "Mongolie · Tissage artisanal", desc: "La fibre la plus douce au monde. Sélectionnée à la main dans les steppes de Mongolie." },
              { img: "/habit16.jpg", name: "Lin Français", origin: "Normandie · European Flax", desc: "Cultivé sans irrigation ni pesticides en Normandie. Léger, respirant, noble." },
              { img: "/habit17.jpg", name: "Coton Bio Péruvien", origin: "Pérou · GOTS Certified", desc: "Le Pima péruvien, la plus fine des fibres de coton. Douceur incomparable." },
            ].map((mat, i) => (
              <div key={mat.name} className="flex flex-col items-center text-center">
                <div
                  data-scale-in
                  className="relative w-[160px] h-[160px] lg:w-[180px] lg:h-[180px] rounded-full overflow-hidden mb-7 border-2 border-[#8a7d6b]/40 flex-shrink-0 group"
                >
                  <Image src={mat.img} alt={mat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-[1.06]" sizes="180px" />
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p className="font-cormorant italic text-2xl text-[#f5f2ed] mb-1">{mat.name}</p>
                  <p className="font-jost text-[9px] uppercase tracking-[0.2em] text-[#8a7d6b] mb-4">{mat.origin}</p>
                  <p className="font-jost text-[11px] text-[#f5f2ed]/55 leading-[1.9] max-w-[240px] mx-auto">{mat.desc}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 6 — LOOKBOOK (#f5f2ed)
      ══════════════════════════════════════════════════════ */}
      <SectionDivider dark={false} />
      <section className="bg-[#f5f2ed] py-20 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-14">
          <div className="mb-10 lg:mb-14 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div data-word-section>
              <SectionLabel text="LOOKBOOK AH-25" />
              <WordReveal
                text={"L'art de\nl'essentiel"}
                as="h2"
                className="font-cormorant italic text-4xl lg:text-5xl text-[#191716]"
              />
            </div>
            <Link
              href="/catalog"
              className="font-jost text-[12px] text-[#7a756e] uppercase tracking-[0.2em] flex items-center gap-3 hover:text-[#191716] transition-colors self-start sm:self-auto group"
            >
              Voir les collections
              <span className="w-5 h-px bg-current group-hover:w-9 transition-all duration-300" aria-hidden="true" />
            </Link>
          </div>

          {/* CSS masonry via columns */}
          <div className="columns-2 md:columns-3 gap-3 lg:gap-4 [column-fill:balance]">
            {[
              { src: "/habit18.jpg", aspect: "aspect-[3/4]" },
              { src: "/habit19.jpg", aspect: "aspect-[4/3]" },
              { src: "/habit20.jpg", aspect: "aspect-[2/3]" },
              { src: "/habit21.jpg", aspect: "aspect-[1/1]" },
              { src: "/habit22.jpg", aspect: "aspect-[16/9]" },
              { src: "/habit23.jpg", aspect: "aspect-[3/4]" },
            ].map((img) => (
              <div key={img.src} className="break-inside-avoid mb-3 lg:mb-4" data-fade-up>
                <MagneticImage src={img.src} aspect={img.aspect} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 7 — CAMPAGNE (#191716 dark)
      ══════════════════════════════════════════════════════ */}
      <SectionDivider dark={true} />
      <section className="bg-[#191716] overflow-hidden">
        <div className="relative grid grid-cols-1 lg:grid-cols-2">

          {/* Left image */}
          <div className="relative h-[50vh] lg:h-[80vh] overflow-hidden group" data-slide-left>
            <div data-parallax data-parallax-depth="80" className="absolute inset-0 scale-[1.15]">
              <Image src="/habit24.jpg" alt="AURÈLE AH-25" fill className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" sizes="(max-width: 1024px) 100vw, 50vw" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />
          </div>

          {/* Right image */}
          <div className="relative h-[50vh] lg:h-[80vh] overflow-hidden group" data-slide-right>
            <div data-parallax data-parallax-depth="80" className="absolute inset-0 scale-[1.15]">
              <Image src="/habit25.jpg" alt="AURÈLE campagne" fill className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" sizes="(max-width: 1024px) 100vw, 50vw" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />
          </div>

          {/* Centered text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none" data-fade-up>
            <p
              className="font-cormorant italic select-none leading-none text-[#f5f2ed]/[0.06]"
              style={{ fontSize: "clamp(4rem, 18vw, 18rem)" }}
              aria-hidden="true"
            >
              AH-25
            </p>
            <p className="font-jost text-[12px] tracking-[0.4em] uppercase text-[#f5f2ed]/70 -mt-4 lg:-mt-8">
              Automne-Hiver 2025
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 8 — TÉMOIGNAGES (#f5f2ed) — Carrousel infini
      ══════════════════════════════════════════════════════ */}
      <SectionDivider dark={false} />
      <section className="bg-[#f5f2ed] py-20 lg:py-28 overflow-hidden">
        {/* Header */}
        <div className="max-w-[1400px] mx-auto px-6 lg:px-14 mb-12 lg:mb-16" data-fade-up>
          <SectionLabel text="CE QU'ILS EN DISENT" />
          <div data-word-section>
            <WordReveal
              text="Ils portent AURÈLE"
              as="h2"
              className="font-cormorant italic text-4xl lg:text-5xl text-[#191716]"
            />
          </div>
        </div>

        {/* Rangée 1 — gauche */}
        <motion.div
          className="overflow-hidden py-3"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="animate-scroll-left flex gap-5">
            {[
              ...CONFIG.testimonials.slice(0, 3),
              ...CONFIG.testimonials.slice(0, 3),
            ].map((t, i) => (
              <TestimonialCard key={`r1-${i}`} t={t} />
            ))}
          </div>
        </motion.div>

        {/* Rangée 2 — droite */}
        <motion.div
          className="overflow-hidden py-3"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="animate-scroll-right flex gap-5">
            {[
              ...CONFIG.testimonials.slice(3, 6),
              ...CONFIG.testimonials.slice(3, 6),
            ].map((t, i) => (
              <TestimonialCard key={`r2-${i}`} t={t} />
            ))}
          </div>
        </motion.div>

        {/* Indicateur — petits points */}
        <div className="flex justify-center gap-2 mt-10">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#8a7d6b]/25" />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 9 — RÉASSURANCE (#191716 dark)
      ══════════════════════════════════════════════════════ */}
      <SectionDivider dark={true} />
      <section className="bg-[#191716] py-14 lg:py-18">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#f5f2ed]/8" data-stagger>
            {CONFIG.reassurance.map((item) => {
              const IconComp = ICONS[item.icon] ?? IconShip
              return (
                <div key={item.title} className="bg-[#191716] px-7 py-10 flex flex-col gap-4">
                  <div className="text-[#8a7d6b]"><IconComp /></div>
                  <div>
                    <p className="font-jost text-[10px] font-medium uppercase tracking-[0.15em] text-[#f5f2ed] mb-1">{item.title}</p>
                    <p className="font-jost text-[10px] text-[#f5f2ed]/50">{item.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 10 — NEWSLETTER (#f5f2ed)
      ══════════════════════════════════════════════════════ */}
      <SectionDivider dark={false} />
      <section className="relative bg-[#f5f2ed] py-32 lg:py-48 overflow-hidden">
        {/* Watermark image */}
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <Image src="/habit26.jpg" alt="" fill className="object-cover opacity-[0.05]" sizes="100vw" />
        </div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-14 text-center">
          <SectionLabel text="REJOIGNEZ L'ESSENTIEL" />
          <div className="mb-8" data-word-section>
            <WordReveal
              text={"Restez informé\nde nos collections"}
              as="h2"
              className="font-cormorant italic text-[clamp(2.5rem,6vw,5rem)] text-[#191716] leading-[0.95]"
            />
          </div>
          <NewsletterForm />
          <p className="font-jost text-[11px] text-[#7a756e] mt-5" data-fade-up>
            Pas de spam. Juste l&apos;essentiel.
          </p>
        </div>
      </section>

      {/* Marquee */}
      <div className="bg-[#191716] border-t border-[#f5f2ed]/8 py-4 overflow-hidden" aria-hidden="true">
        <div
          className="flex gap-[3rem] animate-marquee whitespace-nowrap"
          style={{ "--duration": "55s", "--gap": "3rem" } as React.CSSProperties}
        >
          {Array.from({ length: 2 }).map((_, ri) =>
            ["CACHEMIRE", "LIN FRANÇAIS", "MÉRINOS", "SOIE LAVÉE", "COTON BIO", "MADE IN PARIS", "INTEMPOREL"].map((w) => (
              <span key={`${ri}-${w}`} className="font-cormorant italic text-[#f5f2ed]/25 text-2xl">
                {w}<span className="mx-8 text-[#8a7d6b]">·</span>
              </span>
            ))
          )}
        </div>
      </div>

    </div>
  )
}

// ─── Newsletter form ───────────────────────────────────────────────────────────

function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) { setSent(true); setEmail("") }
  }

  if (sent) {
    return (
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-cormorant italic text-2xl text-[#8a7d6b]"
      >
        Merci. Bienvenue dans l&apos;essentiel.
      </motion.p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex justify-center" data-fade-up>
      <div className="flex w-full max-w-md">
        <label htmlFor="nl-email" className="sr-only">Adresse email</label>
        <input
          id="nl-email" type="email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.fr" required
          className="flex-1 bg-transparent border border-[#191716]/15 rounded-l-full px-6 py-4 font-jost text-[11px] text-[#191716] placeholder-[#7a756e] focus:outline-none focus:border-[#8a7d6b] transition-colors min-h-[52px]"
        />
        <button
          type="submit"
          className="group relative overflow-hidden bg-[#191716] text-[#f5f2ed] rounded-r-full px-7 font-jost text-[10px] uppercase tracking-[0.2em] hover:bg-[#8a7d6b] transition-colors min-h-[52px] whitespace-nowrap"
        >
          S&apos;inscrire
        </button>
      </div>
    </form>
  )
}
