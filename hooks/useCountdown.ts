import { useEffect, useState } from 'react'

export const useCountdown = (targetDate: Date) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    })

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime()
            const distance = targetDate.getTime() - now

            if (distance < 0) {
                clearInterval(interval)
                return
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [targetDate])

    return timeLeft
}
