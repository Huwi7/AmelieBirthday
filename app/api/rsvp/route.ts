import { NextRequest, NextResponse } from 'next/server'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { Resend } from 'resend'

interface RSVP {
  id: string
  name: string
  email: string
  attending: boolean
  fahrdienst: boolean
  timestamp: string
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, attending, fahrdienst } = await request.json()

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
      fahrdienst: attending ? !!fahrdienst : false,
      timestamp: new Date().toISOString(),
    }
    rsvps.push(newRsvp)

    await kv.put('rsvp-list', JSON.stringify(rsvps))

    const resendApiKey = process.env.RESEND_API_KEY || (env as any).RESEND_API_KEY
    if (resendApiKey) {
      const resend = new Resend(resendApiKey)

      try {
        await resend.emails.send({
          from: 'Amelie Birthday <onboarding@resend.dev>',
          to: 'nik.huwiler@me.com',
          subject: `${attending ? '✅' : '❌'} ${name} ${attending ? 'kommt zur Party!' : 'kann leider nicht kommen'}`,
          html: `
            <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #FFB6C1;">Neue Anmeldung für Amelies Geburtstag 🎉</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px; font-weight: bold;">Name:</td><td style="padding: 8px;">${name}</td></tr>
                <tr><td style="padding: 8px; font-weight: bold;">E-Mail:</td><td style="padding: 8px;">${email}</td></tr>
                <tr><td style="padding: 8px; font-weight: bold;">Kommt:</td><td style="padding: 8px;">${attending ? '✅ Ja!' : '❌ Nein, leider nicht'}</td></tr>
                ${attending && fahrdienst ? '<tr><td style="padding: 8px; font-weight: bold;">Fahrdienst:</td><td style="padding: 8px;">🚗 Ja, übernimmt Fahrdienst!</td></tr>' : ''}
              </table>
              <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
              <p style="color: #666;">Insgesamt <strong>${rsvps.filter(r => r.attending).length}</strong> Zusagen | <strong>${rsvps.filter(r => r.attending && r.fahrdienst).length}</strong> Fahrer/innen</p>
            </div>
          `,
        })
      } catch (emailError) {
        console.error('Admin-Mail konnte nicht gesendet werden:', emailError)
      }

    }

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
