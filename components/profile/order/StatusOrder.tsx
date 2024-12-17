import { OrderStatusType } from '@/interface/order.interface'
import React from 'react'
export const listStatus = [
    {
        id: OrderStatusType.CREATED,
        name: 'Mới tạo',
        color: '#34D399' // Green
    },
    {
        id: OrderStatusType.PENDING,
        name: 'Chờ xử lý',
        color: '#FBBF24' // Yellow
    },
    {
        id: OrderStatusType.CONFIRMED,
        name: 'Đã xác nhận',
        color: '#3B82F6' // Blue
    },
    {
        id: OrderStatusType.SHIPPING_PENDING,
        name: 'Chờ vận chuyển',
        color: '#F97316' // Orange
    },
    {
        id: OrderStatusType.SHIPPING_CONFIRMED,
        name: 'Đã xác nhận vận chuyển',
        color: '#6366F1' // Indigo
    },
    {
        id: OrderStatusType.DELIVERING,
        name: 'Đang giao',
        color: '#10B981' // Teal
    },
    {
        id: OrderStatusType.DELIVERED,
        name: 'Đã giao',
        color: '#4ADE80' // Light Green
    },
    {
        id: OrderStatusType.PAID,
        name: 'Đã thanh toán',
        color: '#22D3EE' // Cyan
    },
    {
        id: OrderStatusType.COMPLETED,
        name: 'Hoàn thành',
        color: '#16A34A' // Dark Green
    },
    {
        id: OrderStatusType.CANCELLED,
        name: 'Đã hủy',
        color: '#EF4444' // Red
    }
]

type StatusOrderProps = {
    status: number
}

const StatusOrder = ({ status }: StatusOrderProps) => {
    const statusItem = listStatus.find((item) => item.id === status)
    return (
        <span
            className={`font-medium px-2 inline-block bg-slate-600 first-letter:uppercase rounded-full py-1 text-xs`}
            style={{ backgroundColor: statusItem?.color, color: '#FFF' }}
        >
            {statusItem?.name}
        </span>
    )
}

export default StatusOrder
