import { CartRequest, CartResponse, CartUpdateRequest } from '@/interface/cart.interface'
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

    async update(idCartItem: number, cart: CartUpdateRequest) {
        const response = await http.put(`${this.basePath}/${idCartItem}`, cart)
        return response
    }

    async delete(idCartItem: number) {
        const response = await http.delete(`${this.basePath}/${idCartItem}`)
        return response
    }
}

const cartService = new CartService()
export default cartService
