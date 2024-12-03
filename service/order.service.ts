import { OrderRequest } from '@/interface/order.interface'
import http from '@/lib/http'

class OrderService {
    private static basePath = '/api/admin/orders'

    static async createOrder(order: OrderRequest) {
        return await http.post<OrderRequest>(`${this.basePath}`, order)
    }
}

export default OrderService
