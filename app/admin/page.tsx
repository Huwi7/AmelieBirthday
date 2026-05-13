'use client'

import { useState, useEffect } from 'react'

interface RSVP {
  id: string
  name: string
  attending: boolean
  fahrdienst: boolean
  timestamp: string
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [rsvps, setRsvps] = useState<RSVP[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [error, setError] = useState('')

  const authHeader = { 'Authorization': `Bearer ${password}`, 'Content-Type': 'application/json' }

  const fetchRsvps = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin', { headers: authHeader })
      if (res.status === 401) {
        setAuthenticated(false)
        setError('Falsches Passwort')
        return
      }
      const data = await res.json()
      setRsvps(data)
      setError('')
    } catch {
      setError('Fehler beim Laden')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/admin', { headers: { 'Authorization': `Bearer ${password}` } })
    if (res.ok) {
      setAuthenticated(true)
      const data = await res.json()
      setRsvps(data)
      setError('')
    } else {
      setError('Falsches Passwort')
    }
    setLoading(false)
  }

  const toggleAttending = async (rsvp: RSVP) => {
    await fetch('/api/admin', {
      method: 'PUT',
      headers: authHeader,
      body: JSON.stringify({ id: rsvp.id, attending: !rsvp.attending, fahrdienst: !rsvp.attending ? rsvp.fahrdienst : false }),
    })
    fetchRsvps()
  }

  const toggleFahrdienst = async (rsvp: RSVP) => {
    await fetch('/api/admin', {
      method: 'PUT',
      headers: authHeader,
      body: JSON.stringify({ id: rsvp.id, fahrdienst: !rsvp.fahrdienst }),
    })
    fetchRsvps()
  }

  const saveName = async (id: string) => {
    if (!editName.trim()) return
    await fetch('/api/admin', {
      method: 'PUT',
      headers: authHeader,
      body: JSON.stringify({ id, name: editName.trim() }),
    })
    setEditingId(null)
    fetchRsvps()
  }

  const deleteRsvp = async (id: string, name: string) => {
    if (!confirm(`"${name}" wirklich löschen?`)) return
    await fetch('/api/admin', {
      method: 'DELETE',
      headers: authHeader,
      body: JSON.stringify({ id }),
    })
    fetchRsvps()
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rosa to-lila flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 shadow-lg w-full max-w-sm animate-fade-in-scale">
          <h1 className="text-3xl font-pacifico text-white text-center mb-6">Admin Login 🔐</h1>
          {error && <p className="text-red-300 font-nunito text-center mb-4">{error}</p>}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Passwort"
            className="w-full px-4 py-3 rounded-lg border-2 border-white/30 bg-white/10 text-white placeholder-white/50 focus:border-gold focus:outline-none mb-4"
            autoFocus
          />
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-gold text-white py-3 rounded-full font-nunito text-lg hover:bg-yellow-400 transition-colors disabled:opacity-50"
          >
            {loading ? 'Prüfe...' : 'Anmelden'}
          </button>
        </form>
      </div>
    )
  }

  const attending = rsvps.filter(r => r.attending)
  const notAttending = rsvps.filter(r => !r.attending)
  const drivers = rsvps.filter(r => r.attending && r.fahrdienst)

  return (
    <div className="min-h-screen bg-gradient-to-br from-rosa to-lila p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-5xl font-pacifico text-white drop-shadow-lg animate-fade-in-down">
            Admin 🎉
          </h1>
          <button
            onClick={() => { setAuthenticated(false); setPassword('') }}
            className="bg-white/20 text-white px-4 py-2 rounded-full font-nunito hover:bg-white/30 transition-colors text-sm"
          >
            Abmelden
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8 animate-fade-in-up delay-200" style={{ opacity: 0 }}>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
            <div className="text-3xl font-bold text-green-400">{attending.length}</div>
            <div className="text-white font-nunito text-sm">Zusagen ✅</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
            <div className="text-3xl font-bold text-red-400">{notAttending.length}</div>
            <div className="text-white font-nunito text-sm">Absagen ❌</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
            <div className="text-3xl font-bold text-yellow-400">{drivers.length}</div>
            <div className="text-white font-nunito text-sm">Fahrer 🚗</div>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-white py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            Lade...
          </div>
        ) : (
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl overflow-hidden animate-fade-in delay-400" style={{ opacity: 0 }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/10">
                  <tr>
                    <th className="px-4 py-3 text-left text-white font-nunito text-sm">Name</th>
                    <th className="px-4 py-3 text-center text-white font-nunito text-sm">Kommt</th>
                    <th className="px-4 py-3 text-center text-white font-nunito text-sm">Fahrdienst</th>
                    <th className="px-4 py-3 text-left text-white font-nunito text-sm">Datum</th>
                    <th className="px-4 py-3 text-center text-white font-nunito text-sm">Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {rsvps.map((rsvp) => (
                    <tr key={rsvp.id} className="border-t border-white/10 hover:bg-white/5">
                      <td className="px-4 py-3 text-white font-nunito">
                        {editingId === rsvp.id ? (
                          <div className="flex gap-2">
                            <input
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="px-2 py-1 rounded bg-white/10 border border-white/30 text-white text-sm w-full"
                              autoFocus
                              onKeyDown={(e) => e.key === 'Enter' && saveName(rsvp.id)}
                            />
                            <button onClick={() => saveName(rsvp.id)} className="text-green-400 hover:text-green-300">✓</button>
                            <button onClick={() => setEditingId(null)} className="text-red-400 hover:text-red-300">✕</button>
                          </div>
                        ) : (
                          <span
                            onClick={() => { setEditingId(rsvp.id); setEditName(rsvp.name) }}
                            className="cursor-pointer hover:underline"
                          >
                            {rsvp.name}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => toggleAttending(rsvp)}
                          className={`px-3 py-1 rounded-full text-sm font-nunito transition-colors ${
                            rsvp.attending
                              ? 'bg-green-400/20 text-green-400 hover:bg-green-400/30'
                              : 'bg-red-400/20 text-red-400 hover:bg-red-400/30'
                          }`}
                        >
                          {rsvp.attending ? '✅ Ja' : '❌ Nein'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {rsvp.attending && (
                          <button
                            onClick={() => toggleFahrdienst(rsvp)}
                            className={`px-3 py-1 rounded-full text-sm font-nunito transition-colors ${
                              rsvp.fahrdienst
                                ? 'bg-yellow-400/20 text-yellow-400 hover:bg-yellow-400/30'
                                : 'bg-white/10 text-white/50 hover:bg-white/20'
                            }`}
                          >
                            {rsvp.fahrdienst ? '🚗 Ja' : '—'}
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-3 text-white/60 font-nunito text-sm">
                        {new Date(rsvp.timestamp).toLocaleString('de-CH')}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => deleteRsvp(rsvp.id, rsvp.name)}
                          className="text-red-400 hover:text-red-300 text-sm font-nunito"
                        >
                          Löschen
                        </button>
                      </td>
                    </tr>
                  ))}
                  {rsvps.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-white/50 font-nunito">
                        Noch keine Anmeldungen vorhanden
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
