'use client'
import React, { useState, useMemo } from 'react'
import ProductCarousel from './ProductCarousel'
import { ProductDetail } from '@/interface/product.interface'
import AddToCartButton from '../cart/AddToCartButton'

export default function ProductDetailCard({ product }: { product: ProductDetail }) {
    // State để lưu các thuộc tính đã chọn
    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({})

    // Tạo danh sách các thuộc tính duy nhất từ các biến thể
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

    // Tìm biến thể phù hợp với các thuộc tính đã chọn
    const selectedVariant = useMemo(() => {
        if (Object.keys(selectedAttributes).length !== uniqueAttributes.length) {
            return null
        }

        return product.productVariants.find((variant) =>
            variant.attributes.every((attr) => selectedAttributes[attr.attributeName] === attr.value)
        )
    }, [selectedAttributes, product.productVariants, uniqueAttributes.length])

    // Xử lý khi chọn thuộc tính
    const handleAttributeSelect = (attributeName: string, value: string) => {
        setSelectedAttributes((prev) => ({
            ...prev,
            [attributeName]: value
        }))
    }

    return (
        <section className='flex w-full flex-col py-4 md:flex-row'>
            <ProductCarousel product={product} />
            <div className='flex w-full flex-col space-y-2 px-0 py-2 md:w-1/2 md:px-4 lg:px-12'>
                <h1 className='p-2 text-xl font-bold md:text-2xl'>{product.name}</h1>
                <div className='flex items-center'>
                    <h2 className='p-2 text-xl font-medium text-primary'>Price: &#36; {product.discountPrice}</h2>
                    <div className='ml-2 line-through text-sm text-gray-500'>&#36; {product.unitPrice}</div>
                    <p className='text-xs ml-2 bg-red-200 text-red-600 p-[3px] rounded-sm'>
                        -{Math.round(((product.unitPrice - product.discountPrice) / product.unitPrice) * 100)}%
                    </p>
                </div>

                {/* Hiển thị các thuộc tính */}
                <div className='space-y-4 mt-4'>
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
                        </div>
                    ))}
                </div>

                {/* Hiển thị số lượng còn lại */}
                <div className='mt-4'>
                    {selectedVariant && <p className='text-sm text-gray-600'>Quantity: {selectedVariant.quantity}</p>}
                </div>

                <div className='pt-2'>
                    <AddToCartButton product={product} />
                </div>
            </div>
        </section>
    )
}
