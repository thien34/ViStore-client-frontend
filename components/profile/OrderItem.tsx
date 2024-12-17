import { Card } from '@/components/ui/card'
import { ChevronDown, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import Link from 'next/link'
import { OrderItemsResponse, OrderResponse, PaymentMethodType } from '@/interface/order.interface'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import StatusOrder from './order/StatusOrder'
import { useCallback, useEffect, useState } from 'react'
import OrderService from '@/service/order.service'
import { ProductAttribute } from '@/interface/product.interface'
import CartItem from './order/CartItem'

export interface Product {
    id: number
    name: string
    unitPrice: number
    discountPrice?: number
    quantity: number
    attributes: ProductAttribute[]
    largestDiscountPercentage: number
    cartUUID: string
    imageUrl: string
}

type OrderItemProps = {
    order: OrderResponse
}

const OrderItem = ({ order }: OrderItemProps) => {
    const [products, setProducts] = useState<Product[]>([])
    const fetchProducts = async () => {
        const { payload: response } = await OrderService.getOrderItems(order.id)
        const data: Product[] = response.map((item) => {
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
        setProducts(data)
    }

    // useEffect(() => {
    //     fetchProducts()
    // }, [fetchProducts])

    // useEffect(() => {
    //     const data: Product[] = orderItemsResponse.map((item) => {
    //         const product = JSON.parse(item.productJson)
    //         return {
    //             id: product.id,
    //             name: product.name,
    //             unitPrice: product.unitPrice,
    //             discountPrice: product.discountPrice,
    //             quantity: item.quantity,
    //             attributes: product.productAttributeValues.map((attr: ProductAttribute) => ({
    //                 id: attr.id,
    //                 name: attr.productAttribute.name,
    //                 value: attr.value
    //             })),
    //             largestDiscountPercentage: product.largestDiscountPercentage || 0,
    //             cartUUID: item.orderItemGuid,
    //             imageUrl: product.image
    //         }
    //     })
    //     setProducts(data)
    // }, [orderItemsResponse])

    return (
        <Card className='w-full py-4 px-6 border-none shadow-none bg-muted/80 rounded-2xl'>
            <div className='flex-1 space-y-4'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-8'>
                        <span className='font-medium'>#{order.billCode}</span>
                    </div>
                    <Link href={`/profile/orders/${order.id}`}>
                        <Button variant='ghost' size='icon' className='h-8 w-8'>
                            <ExternalLink className='h-4 w-4' />
                        </Button>
                    </Link>
                </div>
                <div className='space-y-2 text-sm'>
                    <div className='flex justify-between items-center'>
                        <span className='text-muted-foreground'>Trạng thái:</span>
                        <p>
                            <StatusOrder status={order.orderStatus} />
                        </p>
                    </div>
                    <div className='flex justify-between items-center'>
                        <span className='text-muted-foreground'>Phương thức thanh toán:</span>
                        <p>
                            <span className='uppercase text-muted-foreground'>
                                {order.paymentMethod == PaymentMethodType.Cash
                                    ? 'Tiền mặt'
                                    : order.paymentMethod == PaymentMethodType.BankTransfer
                                      ? 'Chuyển khoản'
                                      : 'COD'}
                            </span>
                        </p>
                    </div>
                    <div className='flex justify-between items-center'>
                        <span className='text-muted-foreground'>Thời gian đặt hàng:</span>
                        <p>
                            <span className='text-muted-foreground  '>{formatDateTime(order.paidDateUtc)}</span>
                        </p>
                    </div>
                    <div className='flex justify-between items-center'>
                        <span className='text-muted-foreground'>Tổng tiền:</span>
                        <p className='text-primary font-semibold'>{formatCurrency(order.orderTotal)}</p>
                    </div>
                </div>
                <Collapsible
                    onOpenChange={(open) => {
                        if (open) {
                            fetchProducts()
                        }
                    }}
                    className='bg-white rounded-3xl overflow-hidden px-8 py-2'
                >
                    <CollapsibleTrigger asChild>
                        <Button
                            variant='ghost'
                            className='w-full justify-between hover:bg-white py-0 h-8 px-0 text-sm text-primary hover:text-primary'
                        >
                            Chi tiết sản phẩm
                            <ChevronDown className='h-4 w-4' />
                        </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <div className='space-y-4 mt-4'>
                            {products.map((product) => (
                                <CartItem isOrder key={product.id} product={product} />
                            ))}
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </div>
        </Card>
    )
}

export default OrderItem
