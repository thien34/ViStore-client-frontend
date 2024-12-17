import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0
    }).format(amount)
}

export const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('vi-VN')
}

export const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime)
    const formattedDate = date.toLocaleDateString('vi-VN')
    const formattedTime = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    return `${formattedDate} ${formattedTime}`
}
