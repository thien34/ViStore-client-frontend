import {
    AddressesResponse,
    AddressPagingResponse,
    AddressRequest,
    District,
    Province,
    Ward
} from '@/interface/address.interface'
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

    async syncProvinces(data: Province[]) {
        const response = await http.post('/api/admin/provinces/sync', data)
        return response
    }

    async syncDistricts(data: District[]) {
        const response = await http.post('/api/admin/districts/sync', data)
        return response
    }

    async syncWards(data: Ward[]) {
        const response = await http.post('/api/admin/wards/sync', data)
        return response
    }
}

const addressService = new AddressService()
export default addressService
