import { NextRequest, NextResponse } from 'next/server'
import { getCloudflareContext } from '@opennextjs/cloudflare'

interface RSVP {
  id: string
  name: string
  email: string
  attending: boolean
  timestamp: string
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, attending } = await request.json()

    if (!name || !email || typeof attending !== 'boolean') {
      return NextResponse.json({ error: 'Ungültige Daten' }, { status: 400 })
    }

    const { env } = await getCloudflareContext()
    const kv = (env as any).RSVPS

    const existing = await kv.get('rsvp-list', 'json') as RSVP[] | null
    const rsvps: RSVP[] = existing || []

    const newRsvp: RSVP = {
      id: Date.now().toString(),
      name,
      email,
      attending,
      timestamp: new Date().toISOString(),
    }
    rsvps.push(newRsvp)

    await kv.put('rsvp-list', JSON.stringify(rsvps))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Fehler beim Speichern der RSVP:', error)
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { env } = await getCloudflareContext()
    const kv = (env as any).RSVPS

    const rsvps = await kv.get('rsvp-list', 'json') || []
    return NextResponse.json(rsvps)
  } catch (error) {
    return NextResponse.json({ error: 'Fehler beim Laden der RSVPs' }, { status: 500 })
  }
}
