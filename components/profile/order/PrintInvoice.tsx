import { formatCurrency, formatDateTime } from '@/lib/utils'
import {
    CustomerOrderResponse,
    OrderItemsResponse,
    OrderResponse,
    PaymentMethodType
} from '@/interface/order.interface'
import { ProductAttribute } from '@/interface/product.interface'
import { useMemo } from 'react'
import { Product } from '../OrderItem'
import { Label } from '@radix-ui/react-label'
import Image from 'next/image'

interface InforDetailOrderProps {
    order: OrderResponse
    customerOrder: CustomerOrderResponse
    orderItem: OrderItemsResponse[]
}

const PrintInvoice = ({ order, customerOrder, orderItem }: InforDetailOrderProps) => {
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
        <div className='print-content hidden'>
            <div className='p-8 max-w-3xl mx-auto'>
                <div className='text-center mb-6'>
                    <h1 className='text-2xl font-bold'>HÓA ĐƠN BÁN HÀNG</h1>
                    <p className='text-sm text-gray-600'>Mã hóa đơn: {customerOrder.billId}</p>
                    <p className='text-sm text-gray-600'>Ngày: {formatDateTime(order.paidDateUtc)}</p>
                </div>

                <div className='mb-6'>
                    <h2 className='font-semibold mb-2'>Thông tin khách hàng:</h2>
                    <p>Tên: {`${customerOrder.firstName} ${customerOrder.lastName ?? ''}`}</p>
                    <p>Địa chỉ: {orderItem[0]?.customerOrder?.addressOrder ?? 'N/A'}</p>
                    <p>Số điện thoại: {customerOrder.phoneNumber}</p>
                    <div className='flex gap-x-2'>
                        <span>Phương thức thanh toán:</span>
                        <span className='font-semibold'>
                            {customerOrder.paymentMethod == PaymentMethodType.BankTransfer
                                ? 'Chuyển khoản'
                                : customerOrder.paymentMethod == PaymentMethodType.Cash
                                  ? 'Tiền mặt'
                                  : 'COD'}
                        </span>
                    </div>
                </div>

                {products.map((product) => (
                    <>
                        <div className='border-b last:border-b-0 pb-4 flex gap-4'>
                            <div className='flex items-start gap-x-2'>
                                <Label>
                                    <Image
                                        src={product.imageUrl}
                                        alt={product.name}
                                        width={100}
                                        height={100}
                                        className='size-20 object-cover border rounded-xl'
                                    />
                                </Label>
                            </div>
                            <div className='text-sm flex-1 space-y-1.5'>
                                <div className='flex items-center justify-between'>
                                    <h4 className='line-clamp-1'>{product.name}</h4>
                                </div>
                                <p className='text-muted-foreground'>
                                    {product.attributes
                                        .map((variant) => `${variant.name}: ${variant.value}`)
                                        .join(', ')}
                                </p>
                                <div className='flex items-start justify-between'>
                                    <div className='flex items-center gap-x-3'>
                                        <div className='text-primary font-medium'>
                                            {formatCurrency(product.discountPrice ?? product.unitPrice)}
                                        </div>
                                        <div className='line-through text-gray-500'>
                                            {formatCurrency(product.unitPrice)}
                                        </div>
                                    </div>
                                    <div className=''>
                                        <p>
                                            Số lượng: <span className='font-medium'>{product.quantity}</span>
                                        </p>
                                        <p>
                                            Tổng:{' '}
                                            <span className='font-medium'>
                                                {formatCurrency(
                                                    (product.discountPrice ?? product.unitPrice) * product.quantity
                                                )}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ))}

                <div className='space-y-2 border-t pt-6'>
                    <p className='flex items-center justify-between text-sm'>
                        <span className='text-muted-foreground'>Tạm tính:</span>
                        <span className='text-muted-foreground'>{formatCurrency(order.orderSubtotal)}</span>
                    </p>
                    <p className='flex items-center justify-between text-sm'>
                        <span className='text-muted-foreground'>Giảm giá: </span>
                        <span className='text-muted-foreground'> - {formatCurrency(order.orderDiscountTotal)}</span>
                    </p>
                    <p className='flex items-center justify-between text-sm'>
                        <span className='text-muted-foreground'>Vận chuyển: </span>
                        <span className='text-muted-foreground'> {formatCurrency(order.orderShippingTotal)}</span>
                    </p>
                    <p className='flex items-center justify-between text-sm'>
                        <span className='text-muted-foreground'>Tổng tiền: </span>
                        <span className='font-semibold text-primary'>{formatCurrency(order.orderTotal)}</span>
                    </p>
                </div>

                <div className='text-center text-sm text-gray-600'>
                    <p>Cảm ơn quý khách đã mua hàng!</p>
                </div>
            </div>
        </div>
    )
}

export default PrintInvoice
