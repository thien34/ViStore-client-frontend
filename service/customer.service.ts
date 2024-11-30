import { CustomerUpdateRequest } from '@/interface/customer.interface'
import http from '@/lib/http'

class CustomerService {
    private basePath = '/api/admin/customers'
    async update(id: number, customer: Omit<CustomerUpdateRequest, 'id'>) {
        const response = await http.put(`${this.basePath}/profile-info/${id}`, customer)
        return response.payload
    }
}
const customerService = new CustomerService()
export default customerService