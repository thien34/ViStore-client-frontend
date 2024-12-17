'use client'
import { useEffect, useState } from 'react'
import OrderItem from './OrderItem'
import OrderService from '@/service/order.service'
import { OrderResponse } from '@/interface/order.interface'

export function OrderHistory() {
    const [orders, setOrders] = useState<OrderResponse[]>([])

    useEffect(() => {
        const userDataString = localStorage.getItem('user')
        const userData = userDataString ? JSON.parse(userDataString) : null
        const loadOrders = async () => {
            const { payload: response } = await OrderService.getOrdersByCustomer(userData.customerInfo.id)
            setOrders(response)
        }
        loadOrders()
    }, [])

    // setTimeinterval call api to get new orders update status order every 5 minutes
    useEffect(() => {
        const interval = setInterval(() => {
            const userDataString = localStorage.getItem('user')
            const userData = userDataString ? JSON.parse(userDataString) : null
            const loadOrders = async () => {
                const { payload: response } = await OrderService.getOrdersByCustomer(userData.customerInfo.id)
                setOrders(response)
            }
            loadOrders()
        }, 2000)
        return () => clearInterval(interval)
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
