'use client'

import { useEffect, useState } from 'react'

interface Guest {
  name: string
  attending: boolean
  fahrdienst: boolean
}

export default function Gaesteliste() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)

  const fetchGuests = async () => {
    try {
      const response = await fetch('/api/rsvp')
      const data = await response.json()
      setGuests(data.map((r: any) => ({ name: r.name, attending: r.attending, fahrdienst: !!r.fahrdienst })))
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
  const drivers = guests.filter(g => g.attending && g.fahrdienst)

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

        {drivers.length > 0 && (
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg mt-6 animate-fade-in-up delay-400" style={{ opacity: 0 }}>
            <h3 className="text-xl font-pacifico text-white text-center mb-4">
              🚗 Fahrdienst-Helden
            </h3>
            <div className="flex flex-wrap gap-3 justify-center">
              {drivers.map((driver, i) => (
                <span
                  key={i}
                  className="bg-gold/30 text-white font-nunito px-4 py-2 rounded-full text-lg"
                >
                  🚗 {driver.name}
                </span>
              ))}
            </div>
            <p className="text-center text-white/60 font-nunito mt-4 text-sm">
              Vielen Dank für eure Hilfe! 💛
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
