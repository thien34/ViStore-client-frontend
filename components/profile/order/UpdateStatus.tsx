'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const UpdateStatus = () => {
    const router = useRouter()
    // setTimeInterval
    useEffect(() => {
        const interval = setInterval(() => {
            router.refresh()
        }, 2000)
        return () => clearInterval(interval)
    }, [router])

    return null
}

export default UpdateStatus
