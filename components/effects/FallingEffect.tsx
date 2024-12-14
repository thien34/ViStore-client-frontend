'use client'
import { useEffect } from 'react'

type FallingType = 'snow' | 'luckyMoney'

export default function FallingEffect({ type }: { type: FallingType }) {
    useEffect(() => {
        const createFallingElement = () => {
            const element = document.createElement('div')
            element.className = `absolute ${type === 'snow' ? 'text-white' : 'text-red-600'}`
            element.style.left = Math.random() * 100 + 'vw'
            element.style.animationDuration = Math.random() * 3 + 2 + 's'
            element.style.opacity = Math.random().toString()
            element.innerHTML = type === 'snow' ? '❄' : '🧧'

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
