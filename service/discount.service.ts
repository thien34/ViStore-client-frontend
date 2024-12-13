import { Promotion } from '@/interface/discount.interface'
import http from '@/lib/http'

class DiscountService {
    private basePath = '/api/admin/discounts'

    async getAll() {
        const response = await http.get<Promotion[]>(`${this.basePath}?discountTypeId=ASSIGNED_TO_PRODUCTS`)
        return response
    }
}

const discountService = new DiscountService()
export default discountService
