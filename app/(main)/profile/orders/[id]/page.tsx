import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import InforDetailOrder from '@/components/profile/order/InforDetailOrder'
import TrackOrder from '@/components/profile/order/TrackOrder'
import StatusOrder from '@/components/profile/order/StatusOrder'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import OrderService from '@/service/order.service'
import { PaymentMethodType } from '@/interface/order.interface'
import CartOrders from '@/components/profile/order/CartOrders'
import { notFound } from 'next/navigation'
import PrintInvoice from '@/components/profile/order/PrintInvoice'
import PrintInvoiceButton from '@/components/profile/order/PrintInvoiceButton'
import UpdateStatus from '@/components/profile/order/UpdateStatus'

type Props = {
    params: { id: string }
}

const Page = async ({ params }: Props) => {
    const order = await OrderService.getOrder(Number(params.id), {})
    if (!order) return notFound()
    const { payload: orderItem } = await OrderService.getOrderItems(Number(params.id))
    const { payload: customerOrder } = await OrderService.getCustomerOrder(Number(params.id))
    const { payload: orderStatus } = await OrderService.getOrderStatusHistory(params.id)

    return (
        <>
            <div className='pt-2 mb-4 px-20'>
                <UpdateStatus />
                <Card className='border-none shadow-none'>
                    <CardHeader className='space-y-4 pt-0'>
                        <div className='flex justify-between items-center gap-4'>
                            <div>
                                <h1 className='text-xl font-semibold'>{customerOrder.billId} </h1>
                                <p className='text-sm text-muted-foreground'>
                                    Ngày đặt: {formatDateTime(order.paidDateUtc)}
                                </p>
                            </div>
                            <div className='space-x-3 flex items-center'>
                                {/* <Button size={'sm'} className='py-2 rounded-full border border-primary'>
                                    Nhận hàng
                                </Button>
                                <Button
                                    variant={'outline'}
                                    size={'sm'}
                                    className='py-2 rounded-full border-primary text-primary hover:text-primary hover:bg-primary/10'
                                >
                                    Hủy đơn hàng
                                </Button> */}
                                <PrintInvoiceButton />
                            </div>
                        </div>
                        <div className='space-y-2'>
                            <p className='flex items-center justify-between text-sm'>
                                <span className='text-muted-foreground'>Trạng thái:</span>
                                <StatusOrder status={customerOrder.orderStatusType} />
                            </p>
                            <p className='flex items-center justify-between text-sm'>
                                <span className='text-muted-foreground'>Phương thức thanh toán:</span>
                                <span>
                                    <span className='uppercase text-muted-foreground'>
                                        {customerOrder.paymentMethod == PaymentMethodType.BankTransfer
                                            ? 'Chuyển khoản'
                                            : customerOrder.paymentMethod == PaymentMethodType.Cash
                                              ? 'Tiền mặt'
                                              : 'COD'}
                                    </span>
                                </span>
                            </p>
                            <p className='flex items-center justify-between text-sm'>
                                <span className='text-muted-foreground'>Số sản phẩm:</span>
                                <span>
                                    <span className='uppercase text-muted-foreground'>{orderItem.length}</span>
                                </span>
                            </p>
                            <p className='flex items-center justify-between text-sm'>
                                <span className='text-muted-foreground'>Tổng tiền:</span>
                                <span className='text-primary font-medium'>{formatCurrency(order.orderTotal)}</span>
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue='status' className='w-full'>
                            <TabsList className='w-full justify-start border-b rounded-none h-auto p-0 bg-transparent'>
                                <TabsTrigger
                                    value='status'
                                    className='w-full rounded-none border-b-2 border-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:bg-transparent'
                                >
                                    Trạng thái đơn hàng
                                </TabsTrigger>
                                <TabsTrigger
                                    value='infor'
                                    className='w-full rounded-none border-b-2 border-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:bg-transparent'
                                >
                                    Thông tin đơn hàng
                                </TabsTrigger>
                                <TabsTrigger
                                    value='products'
                                    className='w-full rounded-none border-b-2 border-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:bg-transparent'
                                >
                                    Sản phẩm
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value='status' className='border-none p-0 mt-6'>
                                <TrackOrder tracks={orderStatus} />
                            </TabsContent>
                            <TabsContent value='infor' className='border-none p-0 mt-6'>
                                <InforDetailOrder customerOrder={customerOrder} orderItem={orderItem} order={order} />
                            </TabsContent>
                            <TabsContent value='products' className='border-none p-0 mt-6'>
                                <CartOrders orderItem={orderItem} />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
            <PrintInvoice order={order} customerOrder={customerOrder} orderItem={orderItem} />
        </>
    )
}

export default Page
