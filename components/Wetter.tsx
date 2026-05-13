'use client'

import { useState, useEffect } from 'react'

interface WeatherData {
  temperature_2m_max: number[]
  temperature_2m_min: number[]
  precipitation_probability_max: number[]
  windspeed_10m_max: number[]
}

export default function Wetter() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForecast, setShowForecast] = useState(false)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const forecastDate = new Date()
        forecastDate.setDate(forecastDate.getDate() + 5)
        const dateString = forecastDate.toISOString().split('T')[0]
        setShowForecast(true)

        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=47.50&longitude=8.75&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,windspeed_10m_max&timezone=Europe/Zurich&start_date=${dateString}&end_date=${dateString}`
        )
        const data = await response.json()
        setWeather(data.daily)
      } catch (err) {
        setError('Wetterdaten konnten nicht geladen werden')
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [])

  const getWeatherEmoji = (temp: number, rain: number) => {
    if (rain > 50) return '🌧️'
    if (temp > 20) return '☀️'
    if (temp > 15) return '⛅'
    return '🌤️'
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <h2
          className="text-4xl md:text-5xl font-pacifico text-white text-center mb-12 drop-shadow-lg animate-fade-in-up"
        >
          Wie wird's Wetter am 30. Mai? 🌤️
        </h2>

        <div className="animate-fade-in-up delay-200" style={{ opacity: 0 }}>
          <div className="flex gap-4 mb-6 justify-center">
            <button
              onClick={() => setShowForecast(true)}
              className={`px-6 py-2 rounded-full font-nunito transition-colors ${
                showForecast
                  ? 'bg-white text-purple-600'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Aktuelle Vorhersage
            </button>
            <button
              onClick={() => setShowForecast(false)}
              className={`px-6 py-2 rounded-full font-nunito transition-colors ${
                !showForecast
                  ? 'bg-white text-purple-600'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              30. Mai 2026
            </button>
          </div>

          {showForecast ? (
            <div
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 shadow-lg animate-fade-in-scale"
            >
              {loading && (
                <div className="text-center text-white">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  Wetter wird geladen...
                </div>
              )}

              {error && (
                <div className="text-center text-white">
                  <span className="text-4xl mb-4 block">❓</span>
                  {error}
                </div>
              )}

              {weather && (
                <div className="text-center">
                  <div className="text-sm text-white/60 mb-4">Vorhersage für die nächsten Tage</div>
                  <div className="text-6xl mb-4">
                    {getWeatherEmoji(weather.temperature_2m_max[0], weather.precipitation_probability_max[0])}
                  </div>
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <div className="text-3xl font-bold text-white">
                        {Math.round(weather.temperature_2m_max[0])}°C
                      </div>
                      <div className="text-sm text-white/80">Max</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-white">
                        {Math.round(weather.temperature_2m_min[0])}°C
                      </div>
                      <div className="text-sm text-white/80">Min</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {weather.precipitation_probability_max[0]}%
                      </div>
                      <div className="text-sm text-white/80">Regen</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {Math.round(weather.windspeed_10m_max[0])} km/h
                      </div>
                      <div className="text-sm text-white/80">Wind</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 shadow-lg text-center animate-fade-in-scale"
            >
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-2xl font-pacifico text-white mb-4">Wetter am 30. Mai 2026</h3>
              <p className="text-lg font-nunito text-white mb-6">
                Eine genaue Vorhersage ist noch nicht verfügbar. <br/>
                Typisch für Ende Mai in Dinhard: mild und angenehm! 🌞
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-3xl font-bold text-white">15–22°C</div>
                  <div className="text-sm text-white/80">Durchschnitt</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">😊</div>
                  <div className="text-sm text-white/80">Ideal für Ponys!</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
