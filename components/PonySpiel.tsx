'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

export default function PonySpiel() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [highScore, setHighScore] = useState(0)

  const gameStateRef = useRef({
    pony: { x: 100, y: 200, vy: 0, width: 60, height: 40 },
    obstacles: [] as Array<{x: number, y: number, width: number, height: number, passed: boolean}>,
    groundY: 300,
    gravity: 0.6,
    jumpStrength: -12,
    obstacleSpeed: 3,
    gameRunning: false,
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

    const drawObstacles = () => {
      ctx.fillStyle = '#98FB98'
      gameStateRef.current.obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
      })
    }

    const drawBackground = () => {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, '#FFB6C1')
      gradient.addColorStop(1, '#DDA0DD')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = '#98FB98'
      ctx.fillRect(0, gameStateRef.current.groundY, canvas.width, canvas.height - gameStateRef.current.groundY)
    }

    const gameLoop = () => {
      if (!gameStateRef.current.gameRunning) return

      const { pony, obstacles, groundY, gravity, obstacleSpeed } = gameStateRef.current

      pony.vy += gravity
      pony.y += pony.vy

      if (pony.y + pony.height >= groundY) {
        pony.y = groundY - pony.height
        pony.vy = 0
      }

      obstacles.forEach(obstacle => {
        obstacle.x -= obstacleSpeed
        if (!obstacle.passed && obstacle.x + obstacle.width < pony.x) {
          obstacle.passed = true
          setScore(prev => prev + 1)
        }
      })

      if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width - 200) {
        const height = Math.random() * 30 + 20
        obstacles.push({
          x: canvas.width,
          y: groundY - height,
          width: 20,
          height: height,
          passed: false,
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
      drawObstacles()
      drawPony()

      requestAnimationFrame(gameLoop)
    }

    const startGame = () => {
      gameStateRef.current = {
        pony: { x: 100, y: 200, vy: 0, width: 60, height: 40 },
        obstacles: [],
        groundY: 300,
        gravity: 0.6,
        jumpStrength: -12,
        obstacleSpeed: 3,
        gameRunning: true,
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
      } else {
        gameStateRef.current.pony.vy = gameStateRef.current.jumpStrength
      }
    }

    canvas.addEventListener('click', handleJump)
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        e.preventDefault()
        handleJump()
      }
    })

    drawBackground()
    drawPony()

    return () => {
      canvas.removeEventListener('click', handleJump)
      document.removeEventListener('keydown', handleJump)
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
