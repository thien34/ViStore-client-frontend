import { CustomerFullResponse } from "@/interface/auth.interface";
import { CustomerUpdateRequest } from "@/interface/customer.interface";
import customerService from "@/service/customer.service";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CustomerState {
    customer: CustomerFullResponse | null
    loading: boolean

    //Action
    fetchCustomer: (customerId: number) => Promise<void>
    updateCustomer: (customerId: number, updateRequest: CustomerUpdateRequest) => Promise<void>
    clearCustomer: () => void
}
export const useCustomerStore = create<CustomerState>()(
    persist(
        (set) => ({
            customer: null,
            loading: false,
            fetchCustomer: async (customerId: number) => {
                try {
                    set({ loading: true });
                    const response = await customerService.getById(customerId)
                    set({ customer: response.payload });
                } catch (err) {
                    console.error('Failed to fetch customer:', err);
                } finally {
                    set({ loading: false });
                }
            },
            updateCustomer: async (customerId,updateRequest)=> {
                try {
                    set({ loading: true });
                    await customerService.update(customerId, updateRequest)
                    const updateCustomer = await customerService.getById(customerId)
                    set({ customer: updateCustomer.payload });
                }catch (err) {
                    console.error('Failed to update customer:', err);
                } finally {
                    set({ loading: false });
                }
            },
            clearCustomer: () => set({ customer: null }),
        }),
        {
            name: 'customerStorage',
            storage: createJSONStorage(() => localStorage)
        }
    )
)
