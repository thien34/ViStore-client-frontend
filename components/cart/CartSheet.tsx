'use client'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from '@/components/ui/sheet'
import { ShoppingCartIcon } from 'lucide-react'
import { Button } from '../ui/button'
import CartProductCard from './CartProductCard'
import { useCartStore } from '@/store/useCartStore'
import { useEffect } from 'react'
import { CartResponse } from '@/interface/cart.interface'
import Link from 'next/link'

export default function CartSheet() {
    const { items, isOpen, loading, setIsOpen, fetchCart, updateQuantity, deleteFromCart } = useCartStore()

    // Get customer ID
    const userDataString = localStorage.getItem('user')
    const userData = userDataString ? JSON.parse(userDataString) : null
    const customerId = userData?.customerInfo?.id

    useEffect(() => {
        if (customerId) {
            fetchCart(customerId)
        }
    }, [customerId, fetchCart])

    const handleRemoveFromCart = async (cart: CartResponse) => {
        if (customerId) {
            if (cart.quantity === 1) {
                await deleteFromCart(customerId, cart.id)
            } else {
                await updateQuantity(customerId, cart.id, cart.quantity - 1)
            }
        }
    }

    const handleAddToCart = async (cart: CartResponse) => {
        if (customerId) {
            await updateQuantity(customerId, cart.id, cart.quantity + 1)
        }
    }

    const handleDeleteFromCart = async (cartId: number) => {
        if (customerId) {
            await deleteFromCart(customerId, cartId)
        }
    }

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant='outline' className='relative' size='icon'>
                    <ShoppingCartIcon size={15} />
                    {items.length > 0 && (
                        <div className='absolute -right-1 -top-1 h-3 w-3 rounded-full bg-primary'></div>
                    )}
                    <span className='sr-only'>Cart</span>
                </Button>
            </SheetTrigger>
            <SheetContent className='flex flex-col p-2'>
                <SheetHeader className='p-2'>
                    <SheetTitle>Cart</SheetTitle>
                </SheetHeader>
                <SheetDescription className='text-gray-500'>{items.length > 0 ? '' : 'Empty'}</SheetDescription>
                <div className='h-full overflow-y-auto'>
                    {items.map((product, index) => (
                        <CartProductCard
                            key={index}
                            product={product}
                            removeFromCart={() => handleRemoveFromCart(product)}
                            addToCart={() => handleAddToCart(product)}
                            deleteFromCart={() => handleDeleteFromCart(product.id)}
                        />
                    ))}
                </div>
                <SheetFooter>
                    <Link href={'/cart'} className='w-full'>
                        <Button
                            variant='default'
                            onClick={() => setIsOpen(false)}
                            className='w-full'
                            disabled={items.length === 0}
                        >
                            Cart Detail
                        </Button>
                    </Link>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
