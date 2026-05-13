'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Anmeldung() {
  const [name, setName] = useState('')
  const [attending, setAttending] = useState<boolean | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || attending === null) return

    setLoading(true)
    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name.trim(), attending }),
      })

      if (response.ok) {
        setSubmitted(true)
      } else {
        alert('Fehler beim Absenden. Versuche es nochmal!')
      }
    } catch (error) {
      alert('Fehler beim Absenden. Versuche es nochmal!')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-md mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 shadow-lg"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-pacifico text-white mb-4">
              Super! Wir freuen uns auf {name}! 🦄
            </h3>
            <button
              onClick={() => {
                setSubmitted(false)
                setName('')
                setAttending(null)
              }}
              className="bg-gold text-white px-6 py-2 rounded-full font-nunito hover:bg-yellow-400 transition-colors"
            >
              Neue Anmeldung
            </button>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-md mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-pacifico text-white text-center mb-12 drop-shadow-lg"
        >
          Bisch dabei? Meld dich an! 🎈
        </motion.h2>

        <motion.form
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 shadow-lg"
        >
          <div className="mb-6">
            <label className="block text-white font-nunito mb-2">
              Name des Kindes *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border-2 border-white/30 bg-white/10 text-white placeholder-white/50 focus:border-gold focus:outline-none"
              placeholder="z.B. Anna"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-white font-nunito mb-2">
              Kommt es?
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setAttending(true)}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                  attending === true
                    ? 'border-green-400 bg-green-400/20 text-white'
                    : 'border-white/30 bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                ✅ Ja, klar!
              </button>
              <button
                type="button"
                onClick={() => setAttending(false)}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                  attending === false
                    ? 'border-red-400 bg-red-400/20 text-white'
                    : 'border-white/30 bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                ❌ Nein, leider nicht
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={!name.trim() || attending === null || loading}
            className="w-full bg-gold text-white py-3 px-6 rounded-full font-nunito text-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Wird abgesendet...' : 'Absenden 🎠'}
          </button>
        </motion.form>
      </div>
    </section>
  )
}