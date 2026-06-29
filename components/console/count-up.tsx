"use client"

import * as React from "react"

/**
 * Animate the first numeric part of a value from 0 → target on mount.
 * Keeps any prefix/suffix ("2334h", "12/30", "4.2 TB") intact.
 */
export function CountUp({
  value,
  duration = 900,
}: {
  value: string | number
  duration?: number
}) {
  const text = String(value)
  const match = text.match(/^(\D*)([\d.,]+)(.*)$/)

  const target = match ? Number(match[2].replace(/,/g, "")) : NaN
  const decimals = match && match[2].includes(".") ? (match[2].split(".")[1]?.length ?? 0) : 0

  const [display, setDisplay] = React.useState(0)

  React.useEffect(() => {
    if (!match || Number.isNaN(target)) return
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    if (reduced) {
      setDisplay(target)
      return
    }
    let raf = 0
    let start = 0
    const step = (t: number) => {
      if (!start) start = t
      const p = Math.min(1, (t - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(target * eased)
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, match])

  if (!match || Number.isNaN(target)) return <>{text}</>

  const formatted = display.toLocaleString("vi-VN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
  return (
    <>
      {match[1]}
      {formatted}
      {match[3]}
    </>
  )
}
