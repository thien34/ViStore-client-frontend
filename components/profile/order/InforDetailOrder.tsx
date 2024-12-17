import { CustomerOrderResponse, OrderItemsResponse, OrderResponse } from '@/interface/order.interface'
import { formatCurrency } from '@/lib/utils'

interface InforDetailOrderProps {
    customerOrder: CustomerOrderResponse
    orderItem: OrderItemsResponse[]
    order: OrderResponse
}

const InforDetailOrder = ({ customerOrder, orderItem, order }: InforDetailOrderProps) => {
    return (
        <div className='space-y-6'>
            <div className='space-y-2 pt-6'>
                <p className='font-medium text-sm'>Thông tin Khách hàng</p>
                <p className='flex items-center justify-between text-sm'>
                    <span className='text-muted-foreground'>Họ & Tên:</span>
                    <span className='text-muted-foreground capitalize'>
                        {`${customerOrder.firstName} ${customerOrder.lastName ?? ''}`}
                    </span>
                </p>
                {orderItem[0].customerOrder && (
                    <>
                        <p className='flex items-center justify-between text-sm'>
                            <span className='text-muted-foreground'>Số điện thoại:</span>
                            <span className='text-muted-foreground grid text-right'>{customerOrder.phoneNumber}</span>
                        </p>
                        <p className='flex items-center justify-between text-sm'>
                            <span className='text-muted-foreground'>Địa chỉ:</span>
                            <span className='text-muted-foreground grid text-right capitalize'>
                                {/* todo: */}
                                {orderItem[0].customerOrder.addressOrder}
                            </span>
                        </p>
                    </>
                )}
            </div>
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
        </div>
    )
}

export default InforDetailOrder
