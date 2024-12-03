// services/shipping.service.ts

import { District, Province, Ward } from '@/interface/address.interface'

const GHN_API_BASE = 'https://dev-online-gateway.ghn.vn/shiip/public-api'

export const getProvinces = async (): Promise<Province[]> => {
    try {
        const response = await fetch(`${GHN_API_BASE}/master-data/province`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Token: process.env.NEXT_PUBLIC_GHN_TOKEN || ''
            }
        })

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.message || 'Lỗi khi lấy danh sách tỉnh thành')
        }

        return result.data
    } catch (error: any) {
        throw new Error(`Lỗi lấy danh sách tỉnh thành: ${error.message}`)
    }
}

export const getDistricts = async (provinceId: number): Promise<District[]> => {
    try {
        const response = await fetch(`${GHN_API_BASE}/master-data/district?province_id=${provinceId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Token: process.env.NEXT_PUBLIC_GHN_TOKEN || ''
            }
        })

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.message || 'Lỗi khi lấy danh sách quận huyện')
        }

        return result.data
    } catch (error: any) {
        throw new Error(`Lỗi lấy danh sách quận huyện: ${error.message}`)
    }
}

export const getWards = async (districtId: number): Promise<Ward[]> => {
    try {
        const response = await fetch(`${GHN_API_BASE}/master-data/ward?district_id=${districtId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Token: process.env.NEXT_PUBLIC_GHN_TOKEN || ''
            }
        })

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.message || 'Lỗi khi lấy danh sách phường xã')
        }

        return result.data
    } catch (error: any) {
        throw new Error(`Lỗi lấy danh sách phường xã: ${error.message}`)
    }
}

export const calculateShippingFee = async (data: any) => {
    try {
        const response = await fetch('https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Token: process.env.NEXT_PUBLIC_GHN_TOKEN || '',
                ShopId: process.env.NEXT_PUBLIC_GHN_SHOP_ID || ''
            },
            body: JSON.stringify(data)
        })

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.message || 'Lỗi khi tính phí vận chuyển')
        }

        return result.data
    } catch (error: any) {
        throw new Error(`Lỗi tính phí vận chuyển: ${error.message}`)
    }
}
