'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface RSVP {
  id: string
  name: string
  attending: boolean
  timestamp: string
}

export default function AdminPage() {
  const [rsvps, setRsvps] = useState<RSVP[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRsvps = async () => {
      try {
        const response = await fetch('/api/rsvp')
        const data = await response.json()
        setRsvps(data)
      } catch (error) {
        console.error('Fehler beim Laden der RSVPs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRsvps()
  }, [])

  const attendingCount = rsvps.filter(rsvp => rsvp.attending).length
  const notAttendingCount = rsvps.filter(rsvp => !rsvp.attending).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-rosa to-lila p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-pacifico text-white text-center drop-shadow-lg">
            Admin — Anmeldungen 🎉
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-8"
        >
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-green-400">{attendingCount}</div>
              <div className="text-white font-nunito">Kommen ✅</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-400">{notAttendingCount}</div>
              <div className="text-white font-nunito">Kommen nicht ❌</div>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            Lade Anmeldungen...
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white/20 backdrop-blur-sm rounded-2xl overflow-hidden"
          >
            <table className="w-full">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-6 py-3 text-left text-white font-nunito">Name</th>
                  <th className="px-6 py-3 text-left text-white font-nunito">Kommt</th>
                  <th className="px-6 py-3 text-left text-white font-nunito">Zeitstempel</th>
                </tr>
              </thead>
              <tbody>
                {rsvps.map((rsvp) => (
                  <tr key={rsvp.id} className="border-t border-white/10">
                    <td className="px-6 py-4 text-white font-nunito">{rsvp.name}</td>
                    <td className="px-6 py-4 text-white font-nunito">
                      {rsvp.attending ? '✅ Ja' : '❌ Nein'}
                    </td>
                    <td className="px-6 py-4 text-white font-nunito text-sm">
                      {new Date(rsvp.timestamp).toLocaleString('de-CH')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
    </div>
  )
}