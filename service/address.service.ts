import {
    AddressesResponse,
    AddressFullResponse,
    AddressRequest,
    District,
    Province,
    Ward
} from '@/interface/address.interface'
import http from '@/lib/http'

class AddressService {
    private basePath = '/api/admin/addresses'

    async getAll(customerId: number) {
        return await http.get<AddressesResponse[]>(`${this.basePath}?customerId=${customerId}`)
    }

    async getById(id: number) {
        return await http.get<AddressFullResponse>(`${this.basePath}/${id}`)
    }

    async create(address: AddressRequest) {
        const response = await http.post(`${this.basePath}`, address)
        return response.payload
    }

    async update(id: number, address: Omit<AddressRequest, 'id'>) {
        const response = await http.put(`${this.basePath}/${id}`, address)
        return response.payload
    }

    async getProvinces() {
        const response = await http.get<Province[]>(`/api/admin/provinces`)
        return response.payload
    }

    async getDistricts(provinceCode: string) {
        const response = await http.get<District[]>(`/api/admin/districts/${provinceCode}`)
        return response.payload
    }

    async getWards(districtCode: string) {
        const response = await http.get<Ward[]>(`/api/admin/wards/${districtCode}`)
        return response.payload
    }

    async delete(id: number): Promise<void> {
        await http.delete<void>(`${this.basePath}/${id}`)
    }
}

const addressService = new AddressService()
export default addressService
