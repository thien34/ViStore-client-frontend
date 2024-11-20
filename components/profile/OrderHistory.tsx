// app/profile/components/order-history.tsx
'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Eye } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled'

type Order = {
    id: string
    date: string
    total: number
    status: OrderStatus
    items: {
        name: string
        quantity: number
        price: number
    }[]
}

const statusColors: Record<OrderStatus, string> = {
    pending: 'bg-yellow-500',
    processing: 'bg-blue-500',
    completed: 'bg-green-500',
    cancelled: 'bg-red-500'
}

const statusLabels: Record<OrderStatus, string> = {
    pending: 'Chờ xử lý',
    processing: 'Đang xử lý',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy'
}

export function OrderHistory() {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [orders] = useState<Order[]>([
        {
            id: 'ORD001',
            date: '2024-01-15',
            total: 1500000,
            status: 'completed',
            items: [
                { name: 'Sản phẩm A', quantity: 2, price: 500000 },
                { name: 'Sản phẩm B', quantity: 1, price: 500000 }
            ]
        },
        {
            id: 'ORD002',
            date: '2024-01-20',
            total: 800000,
            status: 'processing',
            items: [{ name: 'Sản phẩm C', quantity: 1, price: 800000 }]
        }
    ])

    return (
        <div className='space-y-4'>
            {orders.map((order) => (
                <Card key={order.id}>
                    <CardContent className='p-4'>
                        <div className='flex justify-between items-start'>
                            <div>
                                <div className='font-medium'>Đơn hàng #{order.id}</div>
                                <div className='text-sm text-gray-600'>
                                    Ngày đặt: {new Date(order.date).toLocaleDateString('vi-VN')}
                                </div>
                                <div className='text-sm font-medium mt-1'>
                                    Tổng tiền: {order.total.toLocaleString('vi-VN')}đ
                                </div>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <Badge className={statusColors[order.status]}>{statusLabels[order.status]}</Badge>
                                <Button variant='outline' size='icon' onClick={() => setSelectedOrder(order)}>
                                    <Eye className='h-4 w-4' />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}

            <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Chi tiết đơn hàng #{selectedOrder?.id}</DialogTitle>
                    </DialogHeader>
                    <div className='space-y-4'>
                        <div>
                            <div className='text-sm text-gray-600'>Ngày đặt: {selectedOrder?.date}</div>
                            <div className='text-sm text-gray-600'>
                                Trạng thái: {selectedOrder?.status && statusLabels[selectedOrder.status]}
                            </div>
                        </div>

                        <div className='border rounded-lg p-4'>
                            <div className='font-medium mb-2'>Sản phẩm</div>
                            {selectedOrder?.items.map((item, index) => (
                                <div key={index} className='flex justify-between py-2 border-b last:border-0'>
                                    <div>
                                        <div>{item.name}</div>
                                        <div className='text-sm text-gray-600'>x{item.quantity}</div>
                                    </div>
                                    <div className='font-medium'>
                                        {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                                    </div>
                                </div>
                            ))}
                            <div className='flex justify-between mt-4 pt-4 border-t'>
                                <div className='font-medium'>Tổng cộng</div>
                                <div className='font-medium'>{selectedOrder?.total.toLocaleString('vi-VN')}đ</div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
