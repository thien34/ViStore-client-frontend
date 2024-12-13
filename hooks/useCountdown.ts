'use client'
import { useCallback, useEffect, useState } from 'react'

interface TimeLeft {
    days: number
    hours: number
    minutes: number
    seconds: number
    total: number
}

export const useCountdown = (targetDate: Date) => {
    const [isMounted, setIsMounted] = useState(false)

    const calculateTimeLeft = useCallback((): TimeLeft => {
        if (!isMounted) {
            return {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
                total: 0
            }
        }

        const difference = targetDate.getTime() - new Date().getTime()

        if (difference <= 0) {
            return {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
                total: 0
            }
        }

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
            total: difference
        }
    }, [targetDate, isMounted])

    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft())

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (!isMounted) return

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft())
        }, 1000)

        return () => clearInterval(timer)
    }, [targetDate, calculateTimeLeft, isMounted])

    return timeLeft
}
