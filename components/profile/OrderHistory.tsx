'use client'
import { useEffect, useState } from 'react'
import OrderItem from './OrderItem'
import OrderService from '@/service/order.service'
import { OrderResponse } from '@/interface/order.interface'

export function OrderHistory() {
    const [orders, setOrders] = useState<OrderResponse[]>([])

    useEffect(() => {
        const loadOrders = async () => {
            const { payload: response } = await OrderService.getOrders({})
            setOrders(response)
        }
        loadOrders()
    }, [])

    return (
        <div className='pt-2 mb-4'>
            <div className='mt-3 space-y-3'>
                {orders.map((order) => (
                    <OrderItem order={order} key={order.id} />
                ))}
            </div>
        </div>
    )
}
