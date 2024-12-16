import {
    CustomerOrderResponse,
    OrderFilter,
    OrderItemsResponse,
    OrderRequest,
    OrderResponse,
    OrderStatusHistoryResponse
} from '@/interface/order.interface'
import http from '@/lib/http'

class OrderService {
    private static basePath = '/api/admin/orders'

    static async createOrder(order: OrderRequest) {
        return await http.post<OrderRequest>(`${this.basePath}`, order)
    }

    static async getOrders(filter: OrderFilter) {
        const params = new URLSearchParams(filter as Record<string, string>)
        return await http.get<OrderResponse[]>(`${this.basePath}?${params}`)
    }

    static async getOrder(id: number, filter: OrderFilter) {
        const params = new URLSearchParams(filter as Record<string, string>)
        const res = await http.get<OrderResponse[]>(`${this.basePath}?${params}`)
        return res.payload.find((order) => order.id === id)
    }

    static async getOrderStatusHistory(orderId: string) {
        return await http.get<OrderStatusHistoryResponse[]>(`${this.basePath}/${orderId}/order-status-history`)
    }

    static async getCustomerOrder(orderId: number) {
        return await http.get<CustomerOrderResponse>(`${this.basePath}/customer/order/${orderId}`)
    }

    static async getOrderItems(orderId: number) {
        return await http.get<OrderItemsResponse[]>(`${this.basePath}/${orderId}/order-items`)
    }
}

export default OrderService
