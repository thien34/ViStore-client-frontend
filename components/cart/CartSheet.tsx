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
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import CartProductCard from './CartProductCard'
import { CartResponse } from '@/interface/cart.interface'
import cartService from '@/service/cart.service'

export default function CartSheet() {
    const [open, setOpen] = useState(false)
    const [cart, setCart] = useState<CartResponse[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    // Fetch cart data
    const fetchCart = async () => {
        try {
            setLoading(true)
            const userDataString = localStorage.getItem('user')
            const userData = userDataString ? JSON.parse(userDataString) : null
            if (userData.customerInfo.id) {
                const response = await cartService.getAll(Number(userData.customerInfo.id))
                setCart(response.payload)
            }
        } catch (error) {
            console.error('Failed to fetch cart:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCart()
    }, [])

    // Handle cart operations
    const handleAddToCart = async (productId: number) => {
        try {
            const customerId = localStorage.getItem('customerId')
            if (customerId) {
                await cartService.create({
                    customerId: Number(customerId),
                    productId,
                    quantity: 1
                })
                fetchCart() // Refresh cart after adding
            }
        } catch (error) {
            console.error('Failed to add to cart:', error)
        }
    }

    const handleRemoveFromCart = async (productId: number) => {
        try {
            const customerId = localStorage.getItem('customerId')
            if (customerId) {
                await cartService.create({
                    customerId: Number(customerId),
                    productId,
                    quantity: -1
                })
                fetchCart() // Refresh cart after removing
            }
        } catch (error) {
            console.error('Failed to remove from cart:', error)
        }
    }

    const handleDeleteFromCart = async (productId: number) => {
        try {
            const customerId = localStorage.getItem('customerId')
            if (customerId) {
                await cartService.create({
                    customerId: Number(customerId),
                    productId,
                    quantity: 0
                })
                fetchCart() // Refresh cart after deleting
            }
        } catch (error) {
            console.error('Failed to delete from cart:', error)
        }
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant='outline' className='relative' size='icon'>
                    <ShoppingCartIcon size={15} />
                    {cart.length > 0 && (
                        <div className='absolute -right-1 -top-1 h-3 w-3 rounded-full bg-primary'></div>
                    )}
                    <span className='sr-only'>Cart</span>
                </Button>
            </SheetTrigger>
            <SheetContent className='flex flex-col p-2'>
                <SheetHeader className='p-2'>
                    <SheetTitle>Cart</SheetTitle>
                </SheetHeader>
                <SheetDescription className='text-gray-500'>
                    {loading ? 'Loading...' : cart.length > 0 ? '' : 'Empty'}
                </SheetDescription>
                <div className='h-full overflow-y-auto'>
                    {cart.map((product: CartResponse, index: number) => (
                        <CartProductCard
                            key={index}
                            product={product}
                            removeFromCart={() => handleRemoveFromCart(0)}
                            addToCart={() => handleAddToCart(0)}
                            deleteFromCart={() => handleDeleteFromCart(0)}
                        />
                    ))}
                </div>
                <SheetFooter>
                    <Button
                        variant='default'
                        onClick={() => {
                            setOpen(false)
                            router.push('/cart')
                        }}
                        className='w-full'
                        disabled={cart.length === 0}
                    >
                        Proceed to Checkout
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
