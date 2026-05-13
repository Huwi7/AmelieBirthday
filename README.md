# Amelies Pony-Party Homepage

Eine märchenhafte Geburtstags-Homepage für Amelies 9. Geburtstag mit dem Thema "Pony & Einhorn", erstellt mit Next.js, Tailwind CSS und TypeScript.

## Features

- 🦄 Märchenhafte Hero-Section mit Countdown-Timer
- 📅 Programm-Übersicht mit Zeitplan
- 🌤️ Wettervorhersage für den Party-Tag (Open-Meteo API)
- 📝 RSVP-Anmeldung mit E-Mail-Benachrichtigung
- 🎮 Einfaches Pony-Sprung-Spiel (Canvas-basiert)
- 📸 Platzhalter für Foto-Upload (vorbereitet)
- 👑 Admin-Seite für RSVPs (/admin)

## Technologie-Stack

- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS
- **Sprache:** TypeScript
- **Animationen:** Framer Motion
- **E-Mail:** Nodemailer
- **Wetter-API:** Open-Meteo (kostenlos)

## Setup-Anleitung

### 1. Abhängigkeiten installieren

```bash
npm install
```

### 2. Umgebungsvariablen konfigurieren

Kopiere die `.env.local` Datei und konfiguriere deine E-Mail-Einstellungen:

```bash
cp .env.local .env.local.example  # Erstelle eine Kopie zum Bearbeiten
```

Bearbeite `.env.local` mit deinen SMTP-Einstellungen:

```
NOTIFY_EMAIL=deine@email.ch
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=dein_username
SMTP_PASS=dein_passwort
```

### 3. Entwicklungsserver starten

```bash
npm run dev
```

Die Seite ist nun unter `http://localhost:3000` verfügbar.

### 4. Admin-Zugang

Besuche `http://localhost:3000/admin` um alle Anmeldungen einzusehen.

## Projekt-Struktur

```
├── app/
│   ├── admin/page.tsx          # Admin-Seite für RSVPs
│   ├── api/rsvp/route.ts       # API-Route für Anmeldungen
│   ├── globals.css             # Globale Styles
│   ├── layout.tsx              # Root-Layout
│   └── page.tsx                # Hauptseite
├── components/
│   ├── Hero.tsx                # Hero-Section mit Countdown
│   ├── Programm.tsx            # Programm-Übersicht
│   ├── Wetter.tsx              # Wettervorhersage
│   ├── Anmeldung.tsx           # RSVP-Formular
│   ├── PonySpiel.tsx           # Pony-Sprung-Spiel
│   └── FotoSection.tsx         # Foto-Platzhalter
├── data/
│   └── rsvps.json              # Gespeicherte Anmeldungen
├── .env.local                  # Umgebungsvariablen
├── package.json                # Abhängigkeiten
├── tailwind.config.js          # Tailwind-Konfiguration
└── README.md                   # Diese Datei
```

## Anpassungen

- **Farben:** In `tailwind.config.js` die Farbpalette anpassen
- **Schriften:** Google Fonts in `app/layout.tsx` ändern
- **Party-Daten:** Datum und Uhrzeit im Code aktualisieren
- **Wetter:** Koordinaten in `components/Wetter.tsx` anpassen

## Deployment

Für den Produktiveinsatz:

1. `.env.local` mit echten SMTP-Daten füllen
2. `npm run build` ausführen
3. Mit einem Hosting-Service deployen (Vercel, Netlify, etc.)

## Hinweise

- Alle Texte sind auf Deutsch (informell, Schweizer Ton)
- Keine externen Bilder nötig — alles mit SVG/CSS
- Responsive Design für Mobile-first
- E-Mail-Benachrichtigungen funktionieren nur mit korrekter SMTP-Konfiguration

Viel Spass mit Amelies Party! 🎉🦄