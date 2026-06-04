"use client"

import { Fragment } from "react"
import { cn } from "@/lib/utils"

interface WordRevealProps {
  text: string
  className?: string
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div"
}

/**
 * Splits text into word spans wrapped in overflow:hidden containers.
 * Spaces are placed OUTSIDE the overflow wrappers so they are never clipped.
 * Parent component animates `.word` via GSAP scrollTrigger.
 */
export function WordReveal({ text, className, as: Tag = "span" }: WordRevealProps) {
  const lines = text.split("\n")

  return (
    <Tag className={cn("block", className)}>
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line
            .split(" ")
            .filter(Boolean)
            .map((word, wi, arr) => (
              <Fragment key={wi}>
                <span className="word-wrap">
                  <span className="word">{word}</span>
                </span>
                {wi < arr.length - 1 ? " " : ""}
              </Fragment>
            ))}
        </span>
      ))}
    </Tag>
  )
}
