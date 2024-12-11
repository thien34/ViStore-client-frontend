import { toast } from '@/components/ui/use-toast'
import { Customer } from '@/interface/customer.interface'
import http from '@/lib/http'

class CustomerService {
    private basePath = '/api/admin/customers'

    async getById(id: number) {
        const response = await http.get<Customer>(`${this.basePath}/${id}`)
        return response
    }

    async update(id: number, customer: Omit<Customer, 'id'>) {
        const response = await http.put(`${this.basePath}/${id}`, customer)
        if (response.status == 200) {
            toast({
                title: 'Thành công',
                description: 'Thông tin của bạn đã được cập nhập thành công'
            })
        }
        return response
    }
}

const customerService = new CustomerService()
export default customerService
