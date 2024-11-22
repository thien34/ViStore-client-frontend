import { CartRequest, CartResponse } from '@/interface/cart.interface'
import http from '@/lib/http'

class CartService {
    private basePath = '/api/client/carts'

    async getAll(idCustomer: number) {
        const response = await http.get<CartResponse[]>(`${this.basePath}/${idCustomer}`)
        return response
    }

    async create(cart: CartRequest) {
        const response = await http.post(`${this.basePath}`, cart)
        return response
    }
}

const cartService = new CartService()
export default cartService
