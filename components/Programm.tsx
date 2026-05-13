'use client'

const programmItems = [
  {
    time: '13:30',
    title: 'Besammlung bei Amelie zu Hause',
    emoji: '🏠',
    color: 'bg-rosa',
  },
  {
    time: '13:45',
    title: 'Abfahrt nach Dinhard',
    emoji: '🚗',
    color: 'bg-lila',
  },
  {
    time: '~ 14:00–17:00',
    title: 'Pony-Abenteuer in Dinhard',
    emoji: '🐴',
    color: 'bg-mint',
  },
  {
    time: '~ 17:30',
    title: 'Rückkehr nach Hause',
    emoji: '🏡',
    color: 'bg-gold',
  },
]

export default function Programm() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2
          className="text-4xl md:text-5xl font-pacifico text-white text-center mb-12 drop-shadow-lg animate-fade-in-up"
        >
          Unser Programm 🌟
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {programmItems.map((item, index) => (
            <div
              key={index}
              className={`${item.color} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow ${index % 2 === 0 ? 'animate-fade-in-left' : 'animate-fade-in-right'} delay-${(index + 1) * 200}`}
              style={{ opacity: 0, animationDelay: `${index * 0.2}s` }}
            >
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-4">{item.emoji}</span>
                <div className="text-2xl font-bold text-white">{item.time}</div>
              </div>
              <h3 className="text-xl font-nunito text-white">{item.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
