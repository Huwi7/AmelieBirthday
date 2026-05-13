'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

export default function PonySpiel() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [highScore, setHighScore] = useState(0)

  const gameStateRef = useRef({
    pony: { x: 100, y: 200, vy: 0, width: 60, height: 40 },
    obstacles: [] as Array<{x: number, y: number, width: number, height: number, passed: boolean, type: number}>,
    clouds: [] as Array<{x: number, y: number, width: number, speed: number, opacity: number}>,
    stars: [] as Array<{x: number, y: number, size: number, twinkle: number, speed: number, baseY: number}>,
    groundY: 300,
    gravity: 0.6,
    jumpStrength: -12,
    obstacleSpeed: 3,
    gameRunning: false,
    jumpsLeft: 2,
    frame: 0,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const drawPony = () => {
      const { pony } = gameStateRef.current
      const x = pony.x
      const y = pony.y

      ctx.lineWidth = 2.5
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      ctx.fillStyle = '#B8623D'
      ctx.fillRect(x + 15, y + 18, 35, 22)
      ctx.strokeStyle = '#1a1a1a'
      ctx.strokeRect(x + 15, y + 18, 35, 22)

      ctx.fillStyle = '#D2691E'
      ctx.beginPath()
      ctx.ellipse(x + 52, y + 12, 12, 14, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#1a1a1a'
      ctx.stroke()

      ctx.fillStyle = '#E8D5C4'
      ctx.beginPath()
      ctx.ellipse(x + 61, y + 16, 5.5, 4.5, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#1a1a1a'
      ctx.stroke()

      ctx.fillStyle = '#8B5A3C'
      ctx.beginPath()
      ctx.moveTo(x + 46, y + 2)
      ctx.lineTo(x + 42, y - 6)
      ctx.lineTo(x + 50, y + 4)
      ctx.closePath()
      ctx.fill()
      ctx.strokeStyle = '#1a1a1a'
      ctx.stroke()

      ctx.fillStyle = '#8B5A3C'
      ctx.beginPath()
      ctx.moveTo(x + 58, y + 2)
      ctx.lineTo(x + 62, y - 8)
      ctx.lineTo(x + 64, y + 4)
      ctx.closePath()
      ctx.fill()
      ctx.strokeStyle = '#1a1a1a'
      ctx.stroke()

      ctx.fillStyle = '#1a1a1a'
      ctx.beginPath()
      ctx.arc(x + 48, y + 10, 2, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#fff'
      ctx.beginPath()
      ctx.arc(x + 49, y + 9, 0.7, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#FFD700'
      ctx.beginPath()
      ctx.moveTo(x + 45, y + 5)
      ctx.quadraticCurveTo(x + 40, y - 3, x + 35, y + 4)
      ctx.quadraticCurveTo(x + 32, y + 8, x + 30, y + 12)
      ctx.lineTo(x + 32, y + 18)
      ctx.quadraticCurveTo(x + 35, y + 14, x + 38, y + 13)
      ctx.quadraticCurveTo(x + 42, y + 12, x + 45, y + 14)
      ctx.closePath()
      ctx.fill()
      ctx.strokeStyle = '#1a1a1a'
      ctx.stroke()

      ctx.fillStyle = '#FFD700'
      ctx.beginPath()
      ctx.moveTo(x + 50, y + 3)
      ctx.quadraticCurveTo(x + 52, y - 6, x + 54, y + 3)
      ctx.lineTo(x + 52, y + 11)
      ctx.closePath()
      ctx.fill()
      ctx.strokeStyle = '#1a1a1a'
      ctx.stroke()

      ctx.fillStyle = '#8B6914'
      ctx.fillRect(x + 20, y + 40, 5, 16)
      ctx.strokeStyle = '#1a1a1a'
      ctx.strokeRect(x + 20, y + 40, 5, 16)
      ctx.fillStyle = '#1a1a1a'
      ctx.fillRect(x + 19, y + 56, 7, 3)

      ctx.fillStyle = '#8B6914'
      ctx.fillRect(x + 30, y + 40, 5, 16)
      ctx.strokeStyle = '#1a1a1a'
      ctx.strokeRect(x + 30, y + 40, 5, 16)
      ctx.fillStyle = '#1a1a1a'
      ctx.fillRect(x + 29, y + 56, 7, 3)

      ctx.fillStyle = '#8B6914'
      ctx.fillRect(x + 40, y + 40, 5, 16)
      ctx.strokeStyle = '#1a1a1a'
      ctx.strokeRect(x + 40, y + 40, 5, 16)
      ctx.fillStyle = '#1a1a1a'
      ctx.fillRect(x + 39, y + 56, 7, 3)

      ctx.fillStyle = '#8B6914'
      ctx.fillRect(x + 45, y + 40, 5, 16)
      ctx.strokeStyle = '#1a1a1a'
      ctx.strokeRect(x + 45, y + 40, 5, 16)
      ctx.fillStyle = '#1a1a1a'
      ctx.fillRect(x + 44, y + 56, 7, 3)

      ctx.fillStyle = '#FFD700'
      ctx.beginPath()
      ctx.moveTo(x + 15, y + 25)
      ctx.quadraticCurveTo(x - 2, y + 22, x - 5, y + 32)
      ctx.quadraticCurveTo(x - 8, y + 42, x - 2, y + 46)
      ctx.quadraticCurveTo(x + 5, y + 42, x + 12, y + 32)
      ctx.lineTo(x + 15, y + 30)
      ctx.closePath()
      ctx.fill()
      ctx.strokeStyle = '#1a1a1a'
      ctx.stroke()
    }

    const drawObstacle = (obstacle: {x: number, y: number, width: number, height: number, type: number}) => {
      const x = obstacle.x
      const y = obstacle.y
      const w = obstacle.width
      const h = obstacle.height

      if (obstacle.type === 0) {
        ctx.fillStyle = '#8B4513'
        ctx.fillRect(x + w / 2 - 4, y + h * 0.4, 8, h * 0.6)
        ctx.fillStyle = '#FF1493'
        ctx.beginPath()
        ctx.arc(x + w / 2, y + h * 0.3, w / 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#FF69B4'
        ctx.beginPath()
        ctx.arc(x + w / 2 - 6, y + h * 0.2, w / 3, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(x + w / 2 + 6, y + h * 0.25, w / 3, 0, Math.PI * 2)
        ctx.fill()
      } else if (obstacle.type === 1) {
        ctx.fillStyle = '#9370DB'
        ctx.beginPath()
        ctx.moveTo(x, y + h)
        ctx.lineTo(x + w * 0.3, y)
        ctx.lineTo(x + w * 0.5, y + h * 0.3)
        ctx.lineTo(x + w * 0.7, y - 5)
        ctx.lineTo(x + w, y + h)
        ctx.closePath()
        ctx.fill()
        ctx.strokeStyle = '#7B68EE'
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.fillStyle = '#E6E6FA'
        ctx.beginPath()
        ctx.arc(x + w * 0.3, y - 3, 3, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(x + w * 0.7, y - 8, 3, 0, Math.PI * 2)
        ctx.fill()
      } else {
        ctx.fillStyle = '#DA70D6'
        ctx.beginPath()
        ctx.ellipse(x + w / 2, y + h * 0.6, w / 2, h * 0.4, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#BA55D3'
        ctx.beginPath()
        ctx.ellipse(x + w / 2, y + h * 0.3, w / 3, h * 0.3, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#FFD700'
        ctx.font = `${Math.min(w, 16)}px sans-serif`
        ctx.fillText('✨', x + w / 2 - 6, y + 2)
      }
    }

    const drawBackground = () => {
      const { groundY, frame } = gameStateRef.current

      const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY)
      skyGrad.addColorStop(0, '#1a0533')
      skyGrad.addColorStop(0.3, '#2d1b69')
      skyGrad.addColorStop(0.6, '#6b3fa0')
      skyGrad.addColorStop(1, '#c471ed')
      ctx.fillStyle = skyGrad
      ctx.fillRect(0, 0, canvas.width, groundY)

      gameStateRef.current.stars.forEach(star => {
        const pulse = Math.sin(frame * 0.03 + star.twinkle)
        const brightness = 0.3 + 0.7 * Math.max(0, pulse)
        const glow = star.size + pulse * 0.8
        ctx.fillStyle = `rgba(255, 255, 220, ${brightness * 0.3})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, glow + 3, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = `rgba(255, 255, 200, ${brightness})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, Math.max(0.5, glow), 0, Math.PI * 2)
        ctx.fill()
      })

      const moonX = 700
      const moonY = 60
      const moonGlow = ctx.createRadialGradient(moonX, moonY, 15, moonX, moonY, 60)
      moonGlow.addColorStop(0, 'rgba(255, 215, 0, 0.4)')
      moonGlow.addColorStop(0.5, 'rgba(255, 215, 0, 0.1)')
      moonGlow.addColorStop(1, 'rgba(255, 215, 0, 0)')
      ctx.fillStyle = moonGlow
      ctx.fillRect(moonX - 60, moonY - 60, 120, 120)
      ctx.fillStyle = 'rgba(255, 235, 150, 0.7)'
      ctx.beginPath()
      ctx.arc(moonX, moonY, 25, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = 'rgba(255, 245, 200, 0.9)'
      ctx.beginPath()
      ctx.arc(moonX, moonY, 18, 0, Math.PI * 2)
      ctx.fill()

      gameStateRef.current.clouds.forEach(cloud => {
        ctx.globalAlpha = cloud.opacity
        ctx.fillStyle = 'rgba(200, 180, 255, 0.5)'
        ctx.beginPath()
        ctx.ellipse(cloud.x, cloud.y, cloud.width, 14, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = 'rgba(220, 200, 255, 0.4)'
        ctx.beginPath()
        ctx.ellipse(cloud.x - cloud.width * 0.35, cloud.y + 4, cloud.width * 0.6, 11, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = 'rgba(210, 190, 255, 0.35)'
        ctx.beginPath()
        ctx.ellipse(cloud.x + cloud.width * 0.35, cloud.y + 2, cloud.width * 0.55, 10, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
      })

      const groundGrad = ctx.createLinearGradient(0, groundY, 0, canvas.height)
      groundGrad.addColorStop(0, '#7B68EE')
      groundGrad.addColorStop(0.5, '#9370DB')
      groundGrad.addColorStop(1, '#6A5ACD')
      ctx.fillStyle = groundGrad
      ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY)

      for (let i = 0; i < canvas.width; i += 30) {
        const offset = (i * 7 + frame) % 60
        const flowerX = i + (offset % 20) - 10
        const flowerY = groundY + 15 + (offset % 30)
        ctx.fillStyle = ['#FF69B4', '#FFD700', '#FF6347', '#DA70D6'][i % 4]
        ctx.beginPath()
        ctx.arc(flowerX, flowerY, 3, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#98FB98'
        ctx.fillRect(flowerX - 0.5, flowerY + 3, 1, 5)
      }

      ctx.strokeStyle = 'rgba(255, 215, 0, 0.15)'
      ctx.lineWidth = 1
      ctx.setLineDash([4, 8])
      ctx.beginPath()
      ctx.moveTo(0, groundY)
      ctx.lineTo(canvas.width, groundY)
      ctx.stroke()
      ctx.setLineDash([])
    }

    const gameLoop = () => {
      if (!gameStateRef.current.gameRunning) return

      const { pony, obstacles, groundY, gravity, obstacleSpeed } = gameStateRef.current

      pony.vy += gravity
      pony.y += pony.vy

      if (pony.y + pony.height >= groundY) {
        pony.y = groundY - pony.height
        pony.vy = 0
        gameStateRef.current.jumpsLeft = 2
      }

      obstacles.forEach(obstacle => {
        obstacle.x -= obstacleSpeed
        if (!obstacle.passed && obstacle.x + obstacle.width < pony.x) {
          obstacle.passed = true
          setScore(prev => prev + 1)
        }
      })

      gameStateRef.current.frame++

      gameStateRef.current.clouds.forEach(cloud => {
        cloud.x -= cloud.speed
        if (cloud.x < -cloud.width * 2) {
          cloud.x = canvas.width + cloud.width
          cloud.y = Math.random() * groundY * 0.4 + 30
          cloud.opacity = Math.random() * 0.3 + 0.2
        }
      })

      gameStateRef.current.stars.forEach(star => {
        star.x -= star.speed
        star.y = star.baseY + Math.sin(gameStateRef.current.frame * 0.01 + star.twinkle) * 2
        if (star.x < -5) {
          star.x = canvas.width + 5
          star.baseY = Math.random() * 180
          star.y = star.baseY
        }
      })

      if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width - 200) {
        const type = Math.floor(Math.random() * 3)
        const height = Math.random() * 30 + 25
        const width = type === 2 ? 30 : (type === 1 ? 25 : 20)
        obstacles.push({
          x: canvas.width,
          y: groundY - height,
          width,
          height,
          passed: false,
          type,
        })
      }

      gameStateRef.current.obstacles = obstacles.filter(obstacle => obstacle.x > -obstacle.width)

      const ponyRect = { x: pony.x, y: pony.y, width: pony.width, height: pony.height }
      for (const obstacle of obstacles) {
        const obstacleRect = { x: obstacle.x, y: obstacle.y, width: obstacle.width, height: obstacle.height }
        if (
          ponyRect.x < obstacleRect.x + obstacleRect.width &&
          ponyRect.x + ponyRect.width > obstacleRect.x &&
          ponyRect.y < obstacleRect.y + obstacleRect.height &&
          ponyRect.y + ponyRect.height > obstacleRect.y
        ) {
          setGameOver(true)
          gameStateRef.current.gameRunning = false
          setHighScore(prev => Math.max(prev, score))
          return
        }
      }

      drawBackground()
      gameStateRef.current.obstacles.forEach(drawObstacle)
      drawPony()

      requestAnimationFrame(gameLoop)
    }

    const initCloudsAndStars = () => {
      const clouds = Array.from({ length: 6 }, (_, i) => ({
        x: Math.random() * canvas.width,
        y: Math.random() * 100 + 20 + (i % 3) * 30,
        width: Math.random() * 35 + 20,
        speed: Math.random() * 0.4 + 0.1 + (i % 3) * 0.15,
        opacity: Math.random() * 0.3 + 0.15,
      }))
      const stars = Array.from({ length: 40 }, () => {
        const baseY = Math.random() * 180
        return {
          x: Math.random() * canvas.width,
          y: baseY,
          baseY,
          size: Math.random() * 2 + 0.5,
          twinkle: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.15 + 0.05,
        }
      })
      return { clouds, stars }
    }

    const startGame = () => {
      const { clouds, stars } = initCloudsAndStars()
      gameStateRef.current = {
        pony: { x: 100, y: 200, vy: 0, width: 60, height: 40 },
        obstacles: [],
        clouds,
        stars,
        groundY: 300,
        gravity: 0.6,
        jumpStrength: -12,
        obstacleSpeed: 3,
        gameRunning: true,
        jumpsLeft: 2,
        frame: 0,
      }
      setScore(0)
      setGameOver(false)
      gameLoop()
    }

    const handleJump = () => {
      if (!gameStateRef.current.gameRunning) {
        if (gameOver) {
          startGame()
        } else {
          gameStateRef.current.gameRunning = true
          gameLoop()
        }
      } else if (gameStateRef.current.jumpsLeft > 0) {
        gameStateRef.current.pony.vy = gameStateRef.current.jumpStrength
        gameStateRef.current.jumpsLeft--
      }
    }

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        handleJump()
      }
    }

    canvas.addEventListener('click', handleJump)
    document.addEventListener('keydown', handleKeydown)

    const { clouds, stars } = initCloudsAndStars()
    gameStateRef.current.clouds = clouds
    gameStateRef.current.stars = stars
    drawBackground()
    drawPony()

    return () => {
      canvas.removeEventListener('click', handleJump)
      document.removeEventListener('keydown', handleKeydown)
    }
  }, [score, gameOver])

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2
          className="text-4xl md:text-5xl font-pacifico text-white mb-8 drop-shadow-lg animate-fade-in-up"
        >
          Spiel mit Wolke dem Pony! 🐴
        </h2>

        <div
          className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-6 animate-fade-in-scale delay-200"
          style={{ opacity: 0 }}
        >
          <div className="flex justify-between items-center mb-4">
            <div className="text-white font-nunito">
              Score: <span className="font-bold">{score}</span>
            </div>
            <div className="text-white font-nunito">
              Highscore: <span className="font-bold">{highScore}</span>
            </div>
          </div>

          <canvas
            ref={canvasRef}
            width={800}
            height={400}
            className="border-2 border-white/30 rounded-lg mx-auto block cursor-pointer"
          />

          <div className="mt-4 text-white font-nunito text-sm">
            Klick oder Leertaste zum Springen!
          </div>
        </div>

        <div
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-6 animate-fade-in-up delay-400"
          style={{ opacity: 0 }}
        >
          <p className="text-white font-nunito text-lg text-center">
            🐴 <em>Was sagt das Pony, wenn es etwas Lustiges hört?</em>
          </p>
          <p className="text-white font-pacifico text-2xl text-center mt-3">
            „Das ist ja wieher-lisch!" 😄
          </p>
        </div>

        {gameOver && (
          <div
            className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg animate-fade-in-scale"
          >
            <h3 className="text-2xl font-pacifico text-white mb-4">Game Over!</h3>
            <p className="text-white font-nunito mb-4">
              Dein Score: {score} | Highscore: {highScore}
            </p>
            <button
              onClick={() => {
                setGameOver(false)
                setScore(0)
              }}
              className="bg-gold text-white px-6 py-2 rounded-full font-nunito hover:bg-yellow-400 transition-colors"
            >
              Nochmal spielen 🎮
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
