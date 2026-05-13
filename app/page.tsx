import Hero from '@/components/Hero'
import Programm from '@/components/Programm'
import Wetter from '@/components/Wetter'
import Anmeldung from '@/components/Anmeldung'
import Gaesteliste from '@/components/Gaesteliste'
import PonySpiel from '@/components/PonySpiel'
import Stars from '@/components/Stars'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Stars />
      <Hero />
      <Programm />
      <Wetter />
      <Anmeldung />
      <Gaesteliste />
      <PonySpiel />
      <div className="text-center pb-8">
        <Link
          href="/admin"
          className="text-white/20 hover:text-white/50 text-sm font-nunito transition-colors"
        >
          Admin
        </Link>
      </div>
    </div>
  )
}
