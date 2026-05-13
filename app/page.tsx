import Hero from '@/components/Hero'
import Programm from '@/components/Programm'
import Wetter from '@/components/Wetter'
import Anmeldung from '@/components/Anmeldung'
import Gaesteliste from '@/components/Gaesteliste'
import PonySpiel from '@/components/PonySpiel'
import Stars from '@/components/Stars'

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
    </div>
  )
}
