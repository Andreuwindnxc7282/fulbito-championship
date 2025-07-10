import { useState, useEffect } from 'react'

interface MatchTime {
  days: number
  hours: number
  minutes: number
  seconds: number
  isLive: boolean
  hasStarted: boolean
}

export function useMatchCountdown(matchDate: string): MatchTime {
  const [timeLeft, setTimeLeft] = useState<MatchTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isLive: false,
    hasStarted: false
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const matchTime = new Date(matchDate).getTime()
      const difference = matchTime - now

      if (difference > 0) {
        // Partido aún no comienza
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({
          days,
          hours,
          minutes,
          seconds,
          isLive: false,
          hasStarted: false
        })
      } else if (difference > -5400000) { // 90 minutos después del inicio
        // Partido en vivo (90 minutos de duración)
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isLive: true,
          hasStarted: true
        })
      } else {
        // Partido terminado
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isLive: false,
          hasStarted: true
        })
      }
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(interval)
  }, [matchDate])

  return timeLeft
}

export function useCurrentTime() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return currentTime
}
