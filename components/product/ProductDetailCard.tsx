'use client'
import React, { useState, useMemo, useEffect } from 'react'
import ProductCarousel from './ProductCarousel'
import { ProductDetail } from '@/interface/product.interface'
import { Button } from '../ui/button'
import Link from 'next/link'
import { PlusIcon, MinusIcon, ShoppingCart } from 'lucide-react'
import { useToast } from '../ui/use-toast'
import { Input } from '@/components/ui/input'
import { CustomerFullResponse } from '@/interface/auth.interface'
import { useCartStore } from '@/store/useCartStore'
import { useRouter } from 'next/navigation'

export default function ProductDetailCard({ product }: { product: ProductDetail }) {
    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({})
    const [showWarnings, setShowWarnings] = useState<Record<string, boolean>>({})
    const [quantity, setQuantity] = useState(1)
    const [customerInfo, setCustomerInfo] = useState<CustomerFullResponse | null>(null)
    const { toast } = useToast()
    const { addToCart, setIsOpen } = useCartStore()
    const router = useRouter()

    useEffect(() => {
        const userDataString = localStorage.getItem('user')
        const userData = userDataString ? JSON.parse(userDataString) : null
        setCustomerInfo(userData?.customerInfo || null)
    }, [])

    const onAddCart = async () => {
        if (!customerInfo?.id) {
            toast({
                title: 'Lỗi',
                description: 'Vui lòng đăng nhập để thêm các mặt hàng vào giỏ hàng',
                variant: 'destructive'
            })
            return
        }
        if (!selectedVariant) {
            toast({
                title: 'Lỗi',
                description: 'Vui lòng chọn tất cả các tùy chọn sản phẩm',
                variant: 'destructive'
            })
            return
        }
        try {
            await addToCart({ customerId: customerInfo.id, productId: selectedVariant.id, quantity })
            setIsOpen(true)
        } catch (error: any) {
            toast({
                title: 'Lỗi',
                description: error?.response?.data?.message,
                variant: 'destructive'
            })
        }
    }

    const handleBuyNow = async () => {
        if (!customerInfo?.id) {
            toast({
                title: 'Lỗi',
                description: 'Vui lòng đăng nhập để mua hàng',
                variant: 'destructive'
            })
            return
        }
        if (!selectedVariant) {
            toast({
                title: 'Lỗi',
                description: 'Vui lòng chọn tất cả các tùy chọn sản phẩm',
                variant: 'destructive'
            })
            return
        }
        try {
            await addToCart({ customerId: customerInfo.id, productId: selectedVariant.id, quantity })
            router.push('/cart')
        } catch (error: any) {
            toast({
                title: 'Lỗi',
                description: error?.response?.data?.message,
                variant: 'destructive'
            })
        }
    }

    const handleQuantityChange = (value: string | number) => {
        if (!selectedVariant) return

        let newValue: number
        if (typeof value === 'string') {
            // Remove leading zeros and non-numeric characters
            const cleanValue = value.replace(/^0+|[^0-9]/g, '')
            newValue = cleanValue === '' ? 0 : parseInt(cleanValue)
        } else {
            newValue = value
        }

        // Ensure the value is within valid range
        newValue = Math.min(Math.max(0, newValue), selectedVariant.quantity)
        setQuantity(newValue)
    }

    const uniqueAttributes = useMemo(() => {
        const attributes: Record<string, Set<string>> = {}

        product.productVariants.forEach((variant) => {
            variant.attributes.forEach((attr) => {
                if (!attributes[attr.attributeName]) {
                    attributes[attr.attributeName] = new Set()
                }
                attributes[attr.attributeName].add(attr.value)
            })
        })

        return Object.entries(attributes).map(([name, values]) => ({
            name,
            values: Array.from(values)
        }))
    }, [product.productVariants])

    const selectedVariant = useMemo(() => {
        if (Object.keys(selectedAttributes).length !== uniqueAttributes.length) {
            return null
        }

        return product.productVariants.find((variant) =>
            variant.attributes.every((attr) => selectedAttributes[attr.attributeName] === attr.value)
        )
    }, [selectedAttributes, product.productVariants, uniqueAttributes.length])

    const handleAttributeSelect = (attributeName: string, value: string) => {
        setSelectedAttributes((prev) => ({
            ...prev,
            [attributeName]: value
        }))
        setShowWarnings((prev) => ({
            ...prev,
            [attributeName]: false
        }))
    }

    const displayPrice = useMemo(() => {
        if (selectedVariant) {
            return {
                unitPrice: selectedVariant.unitPrice,
                discountPrice: selectedVariant.discountPrice
            }
        }
        return {
            unitPrice: product.unitPrice,
            discountPrice: product.discountPrice
        }
    }, [selectedVariant, product])

    return (
        <section className='flex w-full flex-col py-4 md:flex-row'>
            <ProductCarousel product={product} />
            <div className='flex w-full flex-col space-y-2 px-0 py-2 md:w-1/2 md:px-4 lg:px-12'>
                <h1 className='p-2 text-xl font-bold md:text-2xl'>{product.name}</h1>
                <div className='flex items-center'>
                    {displayPrice.discountPrice > 0 ? (
                        <>
                            <h2 className='p-2 text-xl font-medium text-primary'>
                                Giá: &#36; {displayPrice.discountPrice}
                            </h2>
                            <div className='ml-2 line-through text-sm text-gray-500'>
                                &#36; {displayPrice.unitPrice}
                            </div>
                            <p className='text-xs ml-2 bg-red-200 text-red-600 p-[3px] rounded-sm'>
                                -
                                {Math.round(
                                    ((displayPrice.unitPrice - displayPrice.discountPrice) / displayPrice.unitPrice) *
                                        100
                                )}
                                %
                            </p>
                        </>
                    ) : (
                        <h2 className='p-2 text-xl font-medium text-primary'>Giá: &#36; {displayPrice.unitPrice}</h2>
                    )}
                </div>

                <div className='space-y-4 mt-4 p-2'>
                    {uniqueAttributes.map(({ name, values }) => (
                        <div key={name} className='space-y-2'>
                            <h3 className='font-medium'>{name}:</h3>
                            <div className='flex flex-wrap gap-2'>
                                {values.map((value) => (
                                    <button
                                        key={value}
                                        onClick={() => handleAttributeSelect(name, value)}
                                        className={`px-4 py-2 border rounded-md ${
                                            selectedAttributes[name] === value
                                                ? 'border-primary bg-primary text-white'
                                                : 'border-gray-300 hover:border-primary'
                                        }`}
                                    >
                                        {value}
                                    </button>
                                ))}
                            </div>
                            {showWarnings[name] && <p className='text-sm text-red-500 mt-1'>Vui lòng chọn {name}</p>}
                        </div>
                    ))}
                </div>

                {/* Quantity selector */}
                <div className='ml-2 mt-4 space-y-2'>
                    <h3 className='font-medium'>Số lượng:</h3>
                    <div className='flex items-center space-x-2'>
                        <Button
                            variant='outline'
                            size='icon'
                            onClick={() => handleQuantityChange(quantity - 1)}
                            disabled={quantity <= 1 || !selectedVariant?.quantity}
                        >
                            <MinusIcon className='h-4 w-4' />
                        </Button>
                        <Input
                            type='text'
                            value={quantity}
                            onChange={(e) => handleQuantityChange(e.target.value)}
                            className='w-20 text-center'
                            maxLength={3}
                            disabled={!selectedVariant?.quantity}
                        />
                        <Button
                            variant='outline'
                            size='icon'
                            onClick={() => handleQuantityChange(quantity + 1)}
                            disabled={!selectedVariant || quantity >= selectedVariant.quantity}
                        >
                            <PlusIcon className='h-4 w-4' />
                        </Button>
                    </div>
                </div>

                {/* Stock display */}
                <div className='mt-4'>
                    {selectedVariant && (
                        <p className='text-sm text-gray-600'>
                            {selectedVariant.quantity > 0 ? `Có sẵn: ${selectedVariant.quantity} sản phẩm` : 'Hết hàng'}
                        </p>
                    )}
                </div>

                <div className=''>
                    <Button
                        onClick={onAddCart}
                        variant='secondary'
                        className='relative w-full rounded-full border transition duration-100 active:scale-95'
                        disabled={!selectedVariant?.quantity || quantity === 0}
                    >
                        <ShoppingCart className='absolute left-0 ml-4 h-6 w-6' />
                        Thêm vào giỏ
                    </Button>
                    <Button
                        onClick={handleBuyNow}
                        variant='default'
                        className='relative mt-2 w-full rounded-full border transition duration-100 active:scale-95'
                        disabled={!selectedVariant?.quantity || quantity === 0}
                    >
                        Mua ngay
                    </Button>
                </div>
            </div>
        </section>
    )
}
