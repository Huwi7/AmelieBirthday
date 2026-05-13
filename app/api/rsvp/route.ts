import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import nodemailer from 'nodemailer'

const dataDir = path.join(process.cwd(), 'data')
const rsvpFile = path.join(dataDir, 'rsvps.json')

// Stelle sicher, dass das data-Verzeichnis existiert
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Stelle sicher, dass die RSVPs-Datei existiert
if (!fs.existsSync(rsvpFile)) {
  fs.writeFileSync(rsvpFile, JSON.stringify([]))
}

export async function POST(request: NextRequest) {
  try {
    const { name, attending } = await request.json()

    if (!name || typeof attending !== 'boolean') {
      return NextResponse.json({ error: 'Ungültige Daten' }, { status: 400 })
    }

    // Lade bestehende RSVPs
    const rsvps = JSON.parse(fs.readFileSync(rsvpFile, 'utf8'))

    // Füge neue RSVP hinzu
    const newRsvp = {
      id: Date.now().toString(),
      name,
      attending,
      timestamp: new Date().toISOString(),
    }
    rsvps.push(newRsvp)

    // Speichere RSVPs
    fs.writeFileSync(rsvpFile, JSON.stringify(rsvps, null, 2))

    // E-Mail senden
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true für 465, false für andere Ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.NOTIFY_EMAIL,
      subject: `Neue Anmeldung für Amelies Party: ${name}`,
      text: `${name} hat sich angemeldet. Kommt: ${attending ? 'Ja' : 'Nein'}`,
      html: `
        <h2>Neue Anmeldung für Amelies Party</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Kommt:</strong> ${attending ? 'Ja' : 'Nein'}</p>
        <p><strong>Zeitstempel:</strong> ${newRsvp.timestamp}</p>
      `,
    }

    // E-Mail senden (fehlerhafte Konfiguration ignorieren)
    try {
      await transporter.sendMail(mailOptions)
    } catch (emailError) {
      console.error('E-Mail konnte nicht gesendet werden:', emailError)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Fehler beim Speichern der RSVP:', error)
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const rsvps = JSON.parse(fs.readFileSync(rsvpFile, 'utf8'))
    return NextResponse.json(rsvps)
  } catch (error) {
    return NextResponse.json({ error: 'Fehler beim Laden der RSVPs' }, { status: 500 })
  }
}