'use client'
import { useState, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import { OrderSummary, ShippingCalculation } from '@/interface/checkout'
import { calculateShippingFee } from '@/service/shipping.service'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import addressService from '@/service/address.service'
import { AddressesResponse, AddressRequest } from '@/interface/address.interface'
import { useCartStore } from '@/store/useCartStore'
import { OrderRequest, PaymentMethodType, PaymentModeType, PaymentStatusType } from '@/interface/order.interface'
import { CustomerFullResponse } from '@/interface/auth.interface'
import OrderService from '@/service/order.service'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
    addressId: z.string().min(1, 'Vui lòng chọn địa chỉ giao hàng'),
    note: z.string(),
    voucher: z.string(),
    paymentMethod: z.enum(['cod', 'stripe'])
})

const CheckoutPage = () => {
    const router = useRouter()
    const { selectedItems, items, deleteFromCart } = useCartStore()
    const cartItems1 = useMemo(() => items.filter((item) => selectedItems.includes(item.id)), [items, selectedItems])
    const [addressList, setAddressList] = useState<AddressesResponse[]>([])
    const [orderSummary, setOrderSummary] = useState<OrderSummary>({
        subtotal: 0,
        shippingFee: 0,
        discounts: {
            promotions: 0,
            vouchers: 0
        },
        total: 0
    })
    const [shippingInfo, setShippingInfo] = useState<ShippingCalculation | null>(null)
    const [loading, setLoading] = useState(false)
    const [customer, setCustomer] = useState<CustomerFullResponse>()
    const [addressDetail, setAddressDetail] = useState<AddressRequest>()
    const { toast } = useToast()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            addressId: '',
            note: '',
            voucher: '',
            paymentMethod: 'cod'
        }
    })

    useEffect(() => {
        const userDataString = localStorage.getItem('user')
        const userData = userDataString ? JSON.parse(userDataString) : null
        const customerId = userData?.customerInfo?.id
        setCustomer(userData?.customerInfo)

        const fetchAddresses = async () => {
            try {
                const response = await addressService.getAll(customerId)
                const addresses = response?.payload.items || []
                setAddressList(addresses)

                if (addresses.length > 0) {
                    form.setValue('addressId', String(addresses[0].id))
                }
            } catch (error) {
                setAddressList([])
            }
        }

        if (customerId) {
            fetchAddresses()
        }
    }, [addressList.length, form])

    useEffect(() => {
        const addressId = form.watch('addressId')
        const fetchAddressDetail = async () => {
            if (addressList.length > 0 && Number(addressId) != 0) {
                const detailResponse = await addressService.getById(Number(addressId))
                setAddressDetail(detailResponse.payload)
            }
        }
        fetchAddressDetail()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form, addressList.length, form.watch('addressId')])

    // Tính toán shipping fee và cập nhật order summary
    useEffect(() => {
        const calculateOrder = async () => {
            if (cartItems1.length === 0) return
            if (!addressDetail) return
            try {
                // Tính tổng tiền hàng
                const subtotal = cartItems1.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)

                // Chuẩn bị dữ liệu cho GHN API
                const shippingRequest = {
                    service_type_id: 5,
                    from_district_id: 3440,
                    from_ward_code: '13010',
                    to_district_id: Number(addressDetail?.districtId),
                    to_ward_code: addressDetail?.wardId,
                    height: 10,
                    length: 15,
                    weight: cartItems1.reduce((total, item) => total + 500 * item.quantity, 0), // Giả sử mỗi sản phẩm 500g
                    width: 20,
                    insurance_value: 0,
                    coupon: null,
                    items: cartItems1.map((item) => ({
                        name: item.name,
                        quantity: item.quantity,
                        height: 10,
                        weight: 50, // 50g mỗi sản phẩm
                        length: 15,
                        width: 10
                    }))
                }

                // Gọi API tính phí ship
                const shippingCalc = await calculateShippingFee(shippingRequest)

                // Tính các loại giảm giá
                const promotionDiscount = 10 // Mock promotion discount
                const voucherDiscount = form.getValues('voucher') ? 12 : 0 // Mock voucher discount

                setShippingInfo(shippingCalc)
                setOrderSummary({
                    subtotal,
                    shippingFee: Number((shippingCalc.total / 25000).toFixed(2)),
                    discounts: {
                        promotions: promotionDiscount,
                        vouchers: voucherDiscount
                    },
                    total: Number(
                        (subtotal + shippingCalc.total / 25000 - promotionDiscount - voucherDiscount).toFixed(2)
                    )
                })
            } catch (error: any) {
                console.error('Lỗi tính toán đơn hàng:', error)
                return
            }
        }

        calculateOrder()
    }, [form, cartItems1, addressDetail])

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setLoading(true)
        try {
            console.log('Dữ liệu đơn hàng:', { ...data, items: cartItems1, summary: orderSummary })
            const order: OrderRequest = {
                customerId: customer?.id || 0,
                orderGuid: uuidv4(),
                addressType: 2,
                orderId: '',
                pickupInStore: false,
                orderStatusId: 1,
                paymentStatusId: PaymentStatusType.Paid,
                paymentMethodId: PaymentMethodType.Cod,
                paymentMode: PaymentModeType.Online,
                orderSubtotal: orderSummary.subtotal,
                orderSubtotalDiscount: orderSummary.discounts.promotions + orderSummary.discounts.vouchers,
                orderShipping: orderSummary.shippingFee,
                orderDiscount: orderSummary.discounts.promotions + orderSummary.discounts.vouchers,
                orderTotal: orderSummary.total,
                refundedAmount: 0,
                paidDateUtc: '',
                billCode: '',
                deliveryMode: 1,
                orderItems: cartItems1.map((item) => ({
                    productId: item.idProduct,
                    orderItemGuid: '',
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    priceTotal: item.quantity * item.unitPrice,
                    discountAmount: item.discountPrice,
                    originalProductCost: item.unitPrice,
                    attributeDescription: ''
                })),
                addressRequest: {
                    customerId: customer?.id || 0,
                    firstName: addressDetail?.firstName || '',
                    lastName: addressDetail?.lastName || '',
                    email: addressDetail?.email || '',
                    addressName: addressDetail?.addressName || '',
                    provinceId: addressDetail?.provinceId || '',
                    districtId: addressDetail?.districtId || '',
                    wardId: addressDetail?.wardId || '',
                    phoneNumber: addressDetail?.phoneNumber || ''
                },
                idVouchers: []
            }
            OrderService.createOrder(order).then(async (res) => {
                if (res.status === 200) {
                    toast({
                        title: 'Thanh toán thành công',
                        description: 'Đơn hàng của bạn đã được đặt thành công',
                        variant: 'default'
                    })
                    cartItems1.forEach(async (item) => {
                        deleteFromCart(customer?.id ?? -1, item.id)
                    })
                    router.push('/checkout/success')
                }
            })
        } catch (error) {
            console.log('Lỗi tạo lệnh:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='container mx-auto p-4'>
            <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
                {/* Form thanh toán */}
                <div className='lg:col-span-7'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin thanh toán</CardTitle>
                            <CardDescription>Vui lòng điền đầy đủ thông tin đặt hàng</CardDescription>
                        </CardHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <CardContent className='space-y-4'>
                                    {/* Địa chỉ giao hàng */}
                                    <FormField
                                        control={form.control}
                                        name='addressId'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Địa chỉ giao hàng</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Chọn địa chỉ giao hàng' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {addressList.map((address) => (
                                                            <SelectItem
                                                                key={address.id}
                                                                value={String(address.id ?? 0)}
                                                            >
                                                                {address.addressDetail}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Ghi chú */}
                                    <FormField
                                        control={form.control}
                                        name='note'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Lưu ý cho cửa hàng</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder='Nhập ghi chú cho đơn hàng (tùy chọn)'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Voucher */}
                                    <FormField
                                        control={form.control}
                                        name='voucher'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Mã giảm giá</FormLabel>
                                                <div className='flex gap-2'>
                                                    <FormControl>
                                                        <Input placeholder='Nhập mã giảm giá' {...field} />
                                                    </FormControl>
                                                    <Button type='button' variant='outline'>
                                                        Áp dụng
                                                    </Button>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Phương thức thanh toán */}
                                    <FormField
                                        control={form.control}
                                        name='paymentMethod'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Payment Method</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Chọn phương thức thanh toán' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value='cod'>Thanh toán khi nhận hàng</SelectItem>
                                                        <SelectItem value='stripe'>Thanh toán bằng Stripe</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                                <CardFooter>
                                    <Button type='submit' className='w-full' disabled={loading}>
                                        {loading ? 'Đang xử lý...' : `Thanh toán $${orderSummary.total}`}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Form>
                    </Card>
                </div>

                {/* Thông tin đơn hàng */}
                <div className='lg:col-span-5'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Đơn đặt hàng của bạn</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            {/* Danh sách sản phẩm */}
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Sản phẩm</TableHead>
                                        <TableHead className='text-right'>Tổng tiền</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {cartItems1.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <div className='flex items-start gap-2'>
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        width={50}
                                                        height={50}
                                                        className='rounded-md'
                                                    />
                                                    <div>
                                                        <p className='font-medium'>{item.name}</p>
                                                        <p className='text-sm text-gray-500'>{item.attributeProduct}</p>
                                                        <p className='text-sm'>
                                                            {item.quantity} x ${item.unitPrice}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className='text-right'>
                                                ${item.unitPrice * item.quantity}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <Separator />

                            {/* Chi tiết thanh toán */}
                            <div className='space-y-2'>
                                <div className='flex justify-between'>
                                    <span>Tổng phụ:</span>
                                    <span>${orderSummary.subtotal}</span>
                                </div>

                                {shippingInfo && (
                                    <div className='flex justify-between'>
                                        <span>Phí vận chuyển({shippingInfo.service_name}):</span>
                                        <span>${orderSummary.shippingFee}</span>
                                    </div>
                                )}

                                {orderSummary.discounts.promotions > 0 && (
                                    <div className='flex justify-between text-green-600'>
                                        <span>Giảm giá:</span>
                                        <span>-${orderSummary.discounts.promotions}</span>
                                    </div>
                                )}

                                {orderSummary.discounts.vouchers > 0 && (
                                    <div className='flex justify-between text-green-600'>
                                        <span>Phiếu giảm giá:</span>
                                        <span>-${orderSummary.discounts.vouchers}</span>
                                    </div>
                                )}

                                <Separator />

                                <div className='flex justify-between font-medium text-lg'>
                                    <span>Tổng tiền:</span>
                                    <span>${orderSummary.total}</span>
                                </div>
                            </div>

                            {shippingInfo && (
                                <Alert>
                                    <AlertDescription>
                                        Dự kiến giao hàng: {shippingInfo.estimated_delivery_time}
                                    </AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default CheckoutPage
