'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { CustomerFullResponse } from '@/interface/auth.interface'
import { Settings, LogOut, ChevronDown, User } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function UserMenu() {
    const [customerInfo, setCustomerInfo] = useState<CustomerFullResponse | null>(null)

    useEffect(() => {
        const userDataString = localStorage.getItem('user')
        const userData = userDataString ? JSON.parse(userDataString) : null
        setCustomerInfo(userData?.customerInfo || null)
    }, [])

    const user = {
        name: customerInfo?.firstName + ' ' + customerInfo?.lastName,
        email: customerInfo?.email
    }

    const handleLogout = () => {
        localStorage.removeItem('user')
        window.dispatchEvent(new Event('authStateChange'))
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
    }

    return (
        <DropdownMenu>
            <div className='relative h-full'>
                <Link href={'/profile'}>
                    <Avatar className='h-full w-auto aspect-square min-h-[40px] cursor-pointer transition-opacity hover:opacity-80'>
                        <AvatarImage alt={user.name} />
                        <AvatarFallback>
                            {user.name
                                .split(' ')
                                .map((name) => name[0])
                                .join('')}
                        </AvatarFallback>
                    </Avatar>
                </Link>
                <DropdownMenuTrigger className='absolute bottom-0 left-7 flex h-5 w-5 items-center justify-center rounded-full bg-background border border-border p-0.5 outline-none hover:bg-accent'>
                    <ChevronDown className='h-3 w-3 text-muted-foreground' />
                </DropdownMenuTrigger>
            </div>
            <DropdownMenuContent align='end' className='w-56'>
                <DropdownMenuLabel>
                    <div className='flex flex-col space-y-1'>
                        <p className='text-sm font-medium leading-none'>{user.name}</p>
                        <p className='text-xs leading-none text-muted-foreground'>{user.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href='/profile' className='cursor-pointer focus:bg-accent'>
                        <User className='mr-2 h-4 w-4' />
                        Hồ sơ
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href='/settings' className='cursor-pointer focus:bg-accent'>
                        <Settings className='mr-2 h-4 w-4' />
                        Cài đặt
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className='cursor-pointer text-red-600 focus:bg-red-100 focus:text-red-600'
                    onClick={handleLogout}
                >
                    <LogOut className='mr-2 h-4 w-4' />
                    Đăng xuất
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
