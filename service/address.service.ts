import { AddressesResponse, AddressPagingResponse, AddressRequest } from '@/interface/address.interface'
import http from '@/lib/http'

class AddressService {
    private basePath = '/api/admin/addresses'

    async getAll(customerId: number) {
        const response = await http.get<AddressPagingResponse>(`${this.basePath}?customerId=${customerId}`)
        return response
    }

    async getById(id: number) {
        const response = await http.get<AddressRequest>(`${this.basePath}/${id}`)
        return response
    }

    async create(address: AddressRequest) {
        const response = await http.post(`${this.basePath}`, address)
        return response.payload
    }

    async update(id: number, address: Omit<AddressRequest, 'id'>) {
        const response = await http.put(`${this.basePath}/${id}`, address)
        return response.payload
    }

    async delete(id: number): Promise<void> {
        await http.delete<void>(`${this.basePath}/${id}`)
    }
}

const addressService = new AddressService()
export default addressService
