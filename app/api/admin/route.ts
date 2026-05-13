import { NextRequest, NextResponse } from 'next/server'
import { getCloudflareContext } from '@opennextjs/cloudflare'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

interface RSVP {
  id: string
  name: string
  email?: string
  attending: boolean
  fahrdienst: boolean
  timestamp: string
}

function checkAuth(request: NextRequest): boolean {
  if (!ADMIN_PASSWORD) return false
  const auth = request.headers.get('authorization')
  if (!auth) return false
  return auth === `Bearer ${ADMIN_PASSWORD}`
}

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
  }

  const { env } = await getCloudflareContext()
  const kv = (env as any).RSVPS
  const rsvps = await kv.get('rsvp-list', 'json') || []
  return NextResponse.json(rsvps)
}

export async function PUT(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
  }

  const { id, name, attending, fahrdienst } = await request.json()
  const { env } = await getCloudflareContext()
  const kv = (env as any).RSVPS
  const rsvps = (await kv.get('rsvp-list', 'json') || []) as RSVP[]

  const index = rsvps.findIndex(r => r.id === id)
  if (index === -1) {
    return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })
  }

  if (name !== undefined) rsvps[index].name = name
  if (attending !== undefined) rsvps[index].attending = attending
  if (fahrdienst !== undefined) rsvps[index].fahrdienst = fahrdienst

  await kv.put('rsvp-list', JSON.stringify(rsvps))
  return NextResponse.json({ success: true })
}

export async function DELETE(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
  }

  const { id } = await request.json()
  const { env } = await getCloudflareContext()
  const kv = (env as any).RSVPS
  const rsvps = (await kv.get('rsvp-list', 'json') || []) as RSVP[]

  const filtered = rsvps.filter(r => r.id !== id)
  await kv.put('rsvp-list', JSON.stringify(filtered))
  return NextResponse.json({ success: true })
}
