import { CustomerFullRequest, CustomerUpdateRequest } from '@/interface/customer.interface'
import http from '@/lib/http'

class CustomerService {
    private basePath = '/api/admin/customers'

    async getAll() {
        return await http.get<CustomerFullRequest[]>(`${this.basePath}`)
    }
    async getById(id: number) {
        return await http.get<CustomerFullRequest>(`${this.basePath}/${id}`)
    }
    async create(customer: CustomerFullRequest) {
        const response = await http.post(`${this.basePath}`, customer)
        return response.payload
    }
    async update(id: number, customer: Omit<CustomerUpdateRequest, 'id'>) {
        const response = await http.put(`${this.basePath}/profile-info/${id}`, customer)
        return response.payload
    }
    async delete(id: number): Promise<void> {
        await http.delete<void>(`${this.basePath}/${id}`)
    }
}
const customerService = new CustomerService()
export default customerService