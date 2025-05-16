"use client"

import { useState } from "react"
import { Star, StarHalf } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  initialRating?: number
  maxRating?: number
  size?: "sm" | "md" | "lg"
  onChange?: (rating: number) => void
  readOnly?: boolean
  className?: string
}

export function StarRating({
  initialRating = 0,
  maxRating = 5,
  size = "md",
  onChange,
  readOnly = false,
  className,
}: StarRatingProps) {
  const [rating, setRating] = useState(initialRating)
  const [hoverRating, setHoverRating] = useState(0)

  // Size mappings
  const sizeMap = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  const starSize = sizeMap[size]

  // Handle mouse enter on a star position
  const handleMouseEnter = (index: number, isHalf: boolean) => {
    if (readOnly) return
    setHoverRating(isHalf ? index - 0.5 : index)
  }

  // Handle mouse leave
  const handleMouseLeave = () => {
    if (readOnly) return
    setHoverRating(0)
  }

  // Handle click on a star
  const handleClick = (index: number, isHalf: boolean) => {
    if (readOnly) return
    const newRating = isHalf ? index - 0.5 : index
    setRating(newRating)
    onChange?.(newRating)
  }

  // Determine if a star should be filled, half-filled, or empty
  const getStarState = (index: number) => {
    const currentRating = hoverRating > 0 ? hoverRating : rating

    if (currentRating >= index) {
      return "filled"
    } else if (currentRating >= index - 0.5) {
      return "half"
    } else {
      return "empty"
    }
  }

  return (
    <div className={cn("flex items-center", className)} onMouseLeave={handleMouseLeave}>
      {Array.from({ length: maxRating }).map((_, index) => {
        const starIndex = index + 1
        const starState = getStarState(starIndex)

        return (
          <div key={`star-${index}`} className="relative">
            {/* Half star (left half clickable area) */}
            <div
              className={cn("absolute top-0 left-0 w-1/2 h-full cursor-pointer z-10", readOnly && "cursor-default")}
              onMouseEnter={() => handleMouseEnter(starIndex, true)}
              onClick={() => handleClick(starIndex, true)}
              aria-label={`Rate ${starIndex - 0.5} out of ${maxRating}`}
            />

            {/* Full star (right half clickable area) */}
            <div
              className={cn("absolute top-0 right-0 w-1/2 h-full cursor-pointer z-10", readOnly && "cursor-default")}
              onMouseEnter={() => handleMouseEnter(starIndex, false)}
              onClick={() => handleClick(starIndex, false)}
              aria-label={`Rate ${starIndex} out of ${maxRating}`}
            />

            {/* Star visual */}
            {starState === "filled" ? (
              <Star className={cn(starSize, "fill-yellow-400 text-yellow-400")} />
            ) : starState === "half" ? (
              <StarHalf className={cn(starSize, "fill-yellow-400 text-yellow-400")} />
            ) : (
              <Star className={cn(starSize, "text-gray-300")} />
            )}
          </div>
        )
      })}

      {/* Optional: Display the numeric rating */}
      {!readOnly && <span className="ml-2 text-sm font-medium">{hoverRating > 0 ? hoverRating : rating}</span>}
    </div>
  )
}
