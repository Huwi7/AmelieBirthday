'use client'

import { useState, useEffect } from 'react'

export default function Hero() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [expired, setExpired] = useState(false)

  const calculateTimeLeft = () => {
    const targetDate = new Date('2026-05-30T13:30:00+02:00').getTime()
    const now = Date.now()
    const difference = targetDate - now

    if (difference <= 0) {
      setExpired(true)
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      }
    }

    setExpired(false)
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
    }
  }

  useEffect(() => {
    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative py-20 px-4 text-center overflow-hidden">
      <div className="rainbow-header h-2 mb-8 rounded-full mx-auto max-w-md"></div>

      <h1
        className="text-6xl md:text-8xl font-pacifico text-white mb-4 drop-shadow-lg animate-fade-in-down"
      >
        Amelies Pony-Party!
      </h1>

      <p
        className="text-2xl md:text-4xl font-nunito text-white mb-8 drop-shadow-lg animate-fade-in-up delay-500"
        style={{ opacity: 0 }}
      >
        Amelie wird 9 — komm feiern!
      </p>

      {/* Countdown */}
      <div
        className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto animate-fade-in delay-1500"
        style={{ opacity: 0 }}
      >
        <h3 className="text-xl font-nunito text-white mb-4">
          {expired ? 'Die Party ist bereits vorbei!' : 'Noch bis zur Party:'}
        </h3>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-white">{timeLeft.days}</div>
            <div className="text-sm text-white/80">Tage</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">{timeLeft.hours}</div>
            <div className="text-sm text-white/80">Std</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">{timeLeft.minutes}</div>
            <div className="text-sm text-white/80">Min</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">{timeLeft.seconds}</div>
            <div className="text-sm text-white/80">Sek</div>
          </div>
        </div>
      </div>
    </section>
  )
}
