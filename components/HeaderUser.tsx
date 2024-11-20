'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import CartSheet from './cart/CartSheet'
import UserMenu from './Profile'

export default function HeaderUser() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        const checkAuthStatus = () => {
            const user = localStorage.getItem('user')
            setIsLoggedIn(!!user)
        }

        checkAuthStatus()

        const handleStorageChange = () => {
            checkAuthStatus()
        }

        window.addEventListener('storage', handleStorageChange)
        window.addEventListener('authStateChange', handleStorageChange)

        return () => {
            window.removeEventListener('storage', handleStorageChange)
            window.removeEventListener('authStateChange', handleStorageChange)
        }
    }, [])

    return isLoggedIn ? (
        <>
            <CartSheet />
            <UserMenu />
        </>
    ) : (
        <>
            <Link href='/login'>
                <Button variant='secondary'>Đăng nhập</Button>
            </Link>
            <Link href='/sign-up'>
                <Button variant='outline'>Đăng ký</Button>
            </Link>
        </>
    )
}
