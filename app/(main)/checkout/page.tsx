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

const formSchema = z.object({
    addressId: z.string().min(1, 'Vui lòng chọn địa chỉ giao hàng'),
    note: z.string(),
    voucher: z.string(),
    paymentMethod: z.enum(['cod', 'stripe'])
})

const CheckoutPage = () => {
    const { selectedItems, items } = useCartStore()
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
    const [showSuccess, setShowSuccess] = useState(false)
    // const [customerId, setCustomerId] = useState<number>(0)
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
                    service_type_id: 5, // Loại dịch vụ GHN
                    from_district_id: 1442, // Quận/huyện shop
                    from_ward_code: '21211', // Mã phường/xã shop
                    to_district_id: Number(addressDetail?.districtId), // Quận/huyện người nhận
                    to_ward_code: addressDetail?.wardId, // Mã phường/xã người nhận
                    height: 20,
                    length: 30,
                    weight: cartItems1.reduce((total, item) => total + 500 * item.quantity, 0), // Giả sử mỗi sản phẩm 500g
                    width: 40,
                    insurance_value: subtotal, // Giá trị bảo hiểm = giá trị đơn hàng
                    coupon: null,
                    items: cartItems1.map((item) => ({
                        name: item.name,
                        quantity: item.quantity,
                        height: 20,
                        weight: 500, // 500g mỗi sản phẩm
                        length: 30,
                        width: 20
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
                        (subtotal + shippingCalc.total / 23000 - promotionDiscount - voucherDiscount).toFixed(2)
                    )
                })
            } catch (error: any) {
                console.error('Error calculating order:', error)
                return
            }
        }

        calculateOrder()
    }, [form, cartItems1, addressDetail])

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setLoading(true)
        try {
            // Xử lý đặt hàng
            console.log('Order data:', { ...data, items: cartItems1, summary: orderSummary })

            setShowSuccess(true)
            // setTimeout(() => {
            //     router.push('/order-success')
            // }, 2000)
        } catch (error) {
            toast({
                title: 'Lỗi',
                description: 'Đã có lỗi xảy ra. Vui lòng thử lại',
                variant: 'destructive'
            })
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
                            <CardTitle>Payment Information</CardTitle>
                            <CardDescription>Please complete the order information</CardDescription>
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
                                                <FormLabel>Shipping Address</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Select shipping address' />
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
                                                <FormLabel>Note for the shop</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder='Enter note for order (optional)'
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
                                                <FormLabel>Voucher Code</FormLabel>
                                                <div className='flex gap-2'>
                                                    <FormControl>
                                                        <Input placeholder='Enter discount code' {...field} />
                                                    </FormControl>
                                                    <Button type='button' variant='outline'>
                                                        Apply
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
                                                        <SelectItem value='cod'>Cash on Delivery</SelectItem>
                                                        <SelectItem value='stripe'>Pay with Stripe</SelectItem>
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
                            <CardTitle>Your Order</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            {/* Danh sách sản phẩm */}
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead className='text-right'>Total</TableHead>
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
                                    <span>Subtotal:</span>
                                    <span>${orderSummary.subtotal}</span>
                                </div>

                                {shippingInfo && (
                                    <div className='flex justify-between'>
                                        <span>Shipping Fee ({shippingInfo.service_name}):</span>
                                        <span>${orderSummary.shippingFee}</span>
                                    </div>
                                )}

                                {orderSummary.discounts.promotions > 0 && (
                                    <div className='flex justify-between text-green-600'>
                                        <span>Discount:</span>
                                        <span>-${orderSummary.discounts.promotions}</span>
                                    </div>
                                )}

                                {orderSummary.discounts.vouchers > 0 && (
                                    <div className='flex justify-between text-green-600'>
                                        <span>Voucher:</span>
                                        <span>-${orderSummary.discounts.vouchers}</span>
                                    </div>
                                )}

                                <Separator />

                                <div className='flex justify-between font-medium text-lg'>
                                    <span>Total:</span>
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

            {showSuccess && (
                <Alert className='mt-4'>
                    <AlertDescription>Đặt hàng thành công! Đang chuyển hướng...</AlertDescription>
                </Alert>
            )}
        </div>
    )
}

export default CheckoutPage
