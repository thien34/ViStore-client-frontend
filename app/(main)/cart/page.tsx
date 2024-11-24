'use client'
import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import CartItem from '@/components/cart/CartProductDetailCard'
import VoucherSection from '@/components/cart/VoucherCart'
import ShippingSection from '@/components/cart/ShippingCart'
import CartSummary from '@/components/cart/CartSummary'
import { useCartStore } from '@/store/useCartStore'

const ShoppingCart = () => {
    const { items, loading, fetchCart, updateQuantity, deleteFromCart } = useCartStore()
    const [customerId, setCustomerId] = useState<number | null>(null)

    // Get customer ID

    useEffect(() => {
        const userDataString = localStorage.getItem('user')
        const userData = userDataString ? JSON.parse(userDataString) : null
        setCustomerId(userData?.customerInfo?.id)
        if (customerId) {
            fetchCart(customerId)
        }
    }, [customerId, fetchCart])

    const [selectedItems, setSelectedItems] = useState<number[]>([])

    const handleSelectItem = (itemId: number) => {
        setSelectedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
    }

    const handleSelectAll = (checked: boolean) => {
        setSelectedItems(checked ? items.map((item) => item.id) : [])
    }

    const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
        if (newQuantity < 1) return
        if (customerId) await updateQuantity(customerId, itemId, newQuantity)
    }

    const handleRemoveItem = async (itemId: number) => {
        if (customerId) await deleteFromCart(customerId, itemId)
    }

    const handleCheckout = () => {
        console.log('Checking out with items:', selectedItems)
    }

    return (
        <div className='max-w-7xl mx-auto p-4 space-y-4'>
            <h1 className='text-xl font-medium mb-6'>Cart</h1>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                <div className='lg:col-span-2 space-y-4'>
                    <Card>
                        <CardContent className='p-4 space-y-4'>
                            {items.map((item) => (
                                <CartItem
                                    key={item.id}
                                    item={item}
                                    isSelected={selectedItems.includes(item.id)}
                                    onSelect={handleSelectItem}
                                    onUpdateQuantity={handleUpdateQuantity}
                                    onRemove={handleRemoveItem}
                                />
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <div className='space-y-4'>
                    <VoucherSection />
                    <ShippingSection />
                </div>
            </div>
            <CartSummary
                selectedItems={selectedItems}
                items={items}
                onCheckout={handleCheckout}
                onSelectAll={handleSelectAll}
            />
        </div>
    )
}

export default ShoppingCart
