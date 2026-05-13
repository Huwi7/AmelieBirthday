'use client'

import { useEffect, useState } from 'react'
import Hero from '@/components/Hero'
import Programm from '@/components/Programm'
import Wetter from '@/components/Wetter'
import Anmeldung from '@/components/Anmeldung'
import PonySpiel from '@/components/PonySpiel'
import FotoSection from '@/components/FotoSection'

export default function Home() {
  const [stars, setStars] = useState<Array<{id: number, x: number, y: number}>>([])

  useEffect(() => {
    // Erstelle animierte Sterne
    const newStars = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }))
    setStars(newStars)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Animierte Sterne */}
      <div className="stars">
        {stars.map(star => (
          <div
            key={star.id}
            className="star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <Hero />
      <Programm />
      <Wetter />
      <Anmeldung />
      <PonySpiel />
      <FotoSection />
    </div>
  )
}