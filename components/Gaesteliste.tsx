'use client'

import { useEffect, useState } from 'react'

interface Guest {
  name: string
  attending: boolean
}

export default function Gaesteliste() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)

  const fetchGuests = async () => {
    try {
      const response = await fetch('/api/rsvp')
      const data = await response.json()
      setGuests(data.map((r: any) => ({ name: r.name, attending: r.attending })))
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGuests()
  }, [])

  const attending = guests.filter(g => g.attending)

  if (loading) return null
  if (attending.length === 0) return null

  return (
    <section className="py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-pacifico text-white text-center mb-12 drop-shadow-lg animate-fade-in-up">
          Wer kommt mit? 🦄
        </h2>

        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 shadow-lg animate-fade-in-up delay-200" style={{ opacity: 0 }}>
          <div className="flex flex-wrap gap-3 justify-center">
            {attending.map((guest, i) => (
              <span
                key={i}
                className="bg-white/30 text-white font-nunito px-4 py-2 rounded-full text-lg"
              >
                {guest.name}
              </span>
            ))}
          </div>
          <p className="text-center text-white/60 font-nunito mt-6 text-sm">
            {attending.length} {attending.length === 1 ? 'Kind kommt' : 'Kinder kommen'} zur Party!
          </p>
        </div>
      </div>
    </section>
  )
}
