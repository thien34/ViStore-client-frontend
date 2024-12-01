import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import addressService from '@/service/address.service'

interface AddressState {
    provinces: { code: string; fullName: string }[]
    districts: { code: string; fullName: string }[]
    wards: { code: string; fullName: string }[]
    loading: boolean

    // Actions
    fetchProvinces: () => Promise<void>
    fetchDistricts: (provinceCode: string) => Promise<void>
    fetchWards: (districtCode: string) => Promise<void>
    clearDistricts: () => void
    clearWards: () => void
}

export const useAddressStore = create<AddressState>()(
    persist(
        (set) => ({
            provinces: [],
            districts: [],
            wards: [],
            loading: false,

            fetchProvinces: async () => {
                try {
                    set({ loading: true })
                    const provinces = await addressService.getProvinces()
                    set({ provinces })
                } catch (error) {
                    console.error('Failed to fetch provinces:', error)
                } finally {
                    set({ loading: false })
                }
            },

            fetchDistricts: async (provinceCode) => {
                try {
                    set({ loading: true })
                    const districts = await addressService.getDistricts(provinceCode)
                    set({ districts })
                } catch (error) {
                    console.error('Failed to fetch districts:', error)
                } finally {
                    set({ loading: false })
                }
            },

            fetchWards: async (districtCode) => {
                try {
                    set({ loading: true })
                    const wards = await addressService.getWards(districtCode)
                    set({ wards })
                } catch (error) {
                    console.error('Failed to fetch wards:', error)
                } finally {
                    set({ loading: false })
                }
            },

            clearDistricts: () => set({ districts: [], wards: [] }),

            clearWards: () => set({ wards: [] })
        }),
        {
            name: 'address-storage',
            storage: createJSONStorage(() => localStorage)
        }
    )
)
