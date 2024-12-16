import { OrderItemsResponse } from '@/interface/order.interface'
import { ProductAttribute } from '@/interface/product.interface'
import { memo, useMemo } from 'react'
import { Product } from '../OrderItem'
import CartItem from './CartItem'

interface CartOrdersProps {
    orderItem: OrderItemsResponse[]
}
const CartOrders = ({ orderItem }: CartOrdersProps) => {
    const products = useMemo(() => {
        const data: Product[] = orderItem.map((item) => {
            const product = JSON.parse(item.productJson)
            return {
                id: product.id,
                name: product.name,
                unitPrice: product.unitPrice,
                discountPrice: product.discountPrice,
                quantity: item.quantity,
                attributes: product.productAttributeValues.map((attr: ProductAttribute) => ({
                    id: attr.id,
                    name: attr.productAttribute.name,
                    value: attr.value
                })),
                largestDiscountPercentage: product.largestDiscountPercentage || 0,
                cartUUID: item.orderItemGuid,
                imageUrl: product.image
            }
        })
        return data
    }, [orderItem])
    return (
        <div className='space-y-4 mt-4'>
            {products.map((product) => (
                <CartItem isOrder key={product.id} product={product} />
            ))}
        </div>
    )
}

export default memo(CartOrders)
