'use client'
import { useEffect } from 'react'

type FallingType = 'snow' | 'luckyMoney'

export default function FallingEffect({ type }: { type: FallingType }) {
    useEffect(() => {
        const createFallingElement = () => {
            const element = document.createElement('div')

            // Random size for depth effect (0.8 to 1.5)
            const scale = 0.8 + Math.random() * 0.7
            // Random direction (-30 to 30 degrees)
            const direction = -30 + Math.random() * 60
            // Random horizontal movement
            const horizontalMovement = -15 + Math.random() * 30

            element.className = `absolute ${type === 'snow' ? 'text-sky-400' : 'text-red-600'}`
            element.style.left = Math.random() * 100 + 'vw'
            element.style.transform = `scale(${scale})`
            element.style.animationDuration = Math.random() * 3 + 2 + 's'
            element.style.opacity = (0.4 + Math.random() * 0.6).toString()
            element.innerHTML = type === 'snow' ? '❄' : '🧧'

            // Apply custom animation properties
            element.style.setProperty('--fall-direction', `${direction}deg`)
            element.style.setProperty('--horizontal-movement', `${horizontalMovement}px`)

            // Add animation class
            element.classList.add('falling-item')

            document.querySelector('.falling-container')?.appendChild(element)

            setTimeout(() => {
                element.remove()
            }, 5000)
        }

        const intervalId = setInterval(createFallingElement, 200)
        return () => clearInterval(intervalId)
    }, [type])

    return <div className='falling-container fixed inset-0 pointer-events-none z-50' />
}
