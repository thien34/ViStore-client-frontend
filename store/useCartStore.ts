import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { CartRequest, CartResponse, CartUpdateRequest } from '@/interface/cart.interface'
import cartService from '@/service/cart.service'

interface CartState {
    items: CartResponse[]
    isOpen: boolean
    loading: boolean

    // Actions
    setIsOpen: (open: boolean) => void
    fetchCart: (customerId: number) => Promise<void>
    addToCart: (cartRequest: CartRequest) => Promise<void>
    updateQuantity: (customerId: number, cartId: number, quantity: number) => Promise<void>
    deleteFromCart: (customerId: number, cartId: number) => Promise<void>
    clearCart: () => void
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            loading: false,

            setIsOpen: (open) => set({ isOpen: open }),

            fetchCart: async (customerId) => {
                try {
                    set({ loading: true })
                    const response = await cartService.getAll(customerId)
                    set({ items: response.payload })
                } catch (error) {
                    console.error('Failed to fetch cart:', error)
                } finally {
                    set({ loading: false })
                }
            },

            addToCart: async (cartRequest) => {
                try {
                    set({ loading: true })
                    await cartService.create(cartRequest)
                    // Fetch updated cart
                    const response = await cartService.getAll(cartRequest.customerId)
                    set({ items: response.payload })
                } catch (error) {
                    console.error('Failed to add to cart:', error)
                    throw error
                } finally {
                    set({ loading: false })
                }
            },

            deleteFromCart: async (customerId, cartId) => {
                try {
                    set({ loading: true })
                    await cartService.delete(cartId)
                    // Fetch updated cart
                    const response = await cartService.getAll(customerId)
                    set({ items: response.payload })
                } catch (error) {
                    console.error('Failed to remove from cart:', error)
                    throw error
                } finally {
                    set({ loading: false })
                }
            },

            updateQuantity: async (customerId, cartId, quantity) => {
                try {
                    set({ loading: true })
                    await cartService.update(cartId, { quantity })
                    // Fetch updated cart
                    const response = await cartService.getAll(customerId)
                    set({ items: response.payload })
                } catch (error) {
                    console.error('Failed to update quantity:', error)
                    throw error
                } finally {
                    set({ loading: false })
                }
            },

            clearCart: () => set({ items: [] })
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => localStorage)
        }
    )
)
