'use client'
import { useState, useEffect } from 'react'
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
import { CartItem, OrderSummary, ShippingCalculation } from '@/interface/checkout'
import { calculateShippingFee } from '@/service/shipping.service'
import { useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'

interface Address {
    id: string
    fullAddress: string
    isDefault: boolean
}

interface User {
    id: string
    addresses: Address[]
}

const formSchema = z.object({
    addressId: z.string().min(1, 'Vui lòng chọn địa chỉ giao hàng'),
    note: z.string(),
    voucher: z.string(),
    paymentMethod: z.enum(['cod', 'stripe'])
})

const CheckoutPage = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [user, setUser] = useState<User>({ id: '', addresses: [] })
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

    const router = useRouter()
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

    // Giả lập fetch user data
    useEffect(() => {
        const mockUser = {
            id: '1',
            addresses: [
                { id: '1', fullAddress: '123 Đường ABC, Quận 1, TP.HCM', isDefault: true },
                { id: '2', fullAddress: '456 Đường XYZ, Quận 2, TP.HCM', isDefault: false }
            ]
        }
        setUser(mockUser)
    }, [])

    // Giả lập fetch cart items
    useEffect(() => {
        const mockCartItems: CartItem[] = [
            {
                id: '1',
                productId: 'p1',
                productName: 'Áo thun basic',
                variant: {
                    id: 'v1',
                    name: 'Áo thun basic - Trắng/L',
                    attributes: {
                        Size: 'L',
                        Color: 'Trắng'
                    }
                },
                price: 299000,
                quantity: 2,
                image: '/api/placeholder/100/100'
            },
            {
                id: '2',
                productId: 'p2',
                productName: 'Quần jean slim fit',
                variant: {
                    id: 'v2',
                    name: 'Quần jean slim fit - Xanh/32',
                    attributes: {
                        Size: '32',
                        Color: 'Xanh'
                    }
                },
                price: 599000,
                quantity: 1,
                image: '/api/placeholder/100/100'
            }
        ]
        setCartItems(mockCartItems)
    }, [])

    // Tính toán shipping fee và cập nhật order summary
    useEffect(() => {
        const calculateOrder = async () => {
            if (cartItems.length === 0) return

            try {
                // Tính tổng tiền hàng
                const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

                // Chuẩn bị dữ liệu cho GHN API
                const shippingRequest = {
                    service_type_id: 5, // Loại dịch vụ GHN
                    from_district_id: 1442, // Quận/huyện shop
                    from_ward_code: '21211', // Mã phường/xã shop
                    to_district_id: 1820, // Quận/huyện người nhận
                    to_ward_code: '030712', // Mã phường/xã người nhận
                    height: 20,
                    length: 30,
                    weight: cartItems.reduce((total, item) => total + 500 * item.quantity, 0), // Giả sử mỗi sản phẩm 500g
                    width: 40,
                    insurance_value: subtotal, // Giá trị bảo hiểm = giá trị đơn hàng
                    coupon: null,
                    items: cartItems.map((item) => ({
                        name: item.productName,
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
                const promotionDiscount = 50000 // Mock promotion discount
                const voucherDiscount = form.getValues('voucher') ? 100000 : 0 // Mock voucher discount

                setShippingInfo(shippingCalc)
                setOrderSummary({
                    subtotal,
                    shippingFee: shippingCalc.total, // Sử dụng total từ response GHN
                    discounts: {
                        promotions: promotionDiscount,
                        vouchers: voucherDiscount
                    },
                    total: subtotal + shippingCalc.total - promotionDiscount - voucherDiscount
                })
            } catch (error: any) {
                console.error('Error calculating order:', error)
                toast({
                    title: 'Lỗi tính phí vận chuyển',
                    description: error.message || 'Không thể tính phí vận chuyển. Vui lòng thử lại',
                    variant: 'destructive'
                })
            }
        }

        calculateOrder()
    }, [cartItems, toast, form])

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setLoading(true)
        try {
            // Xử lý đặt hàng
            console.log('Order data:', { ...data, items: cartItems, summary: orderSummary })

            setShowSuccess(true)
            setTimeout(() => {
                router.push('/order-success')
            }, 2000)
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

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount)
    }

    return (
        <div className='container mx-auto p-4'>
            <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
                {/* Form thanh toán */}
                <div className='lg:col-span-7'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin thanh toán</CardTitle>
                            <CardDescription>Vui lòng hoàn tất thông tin đơn hàng</CardDescription>
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
                                                        {user.addresses.map((address) => (
                                                            <SelectItem key={address.id} value={address.id}>
                                                                {address.fullAddress}
                                                                {address.isDefault && ' (Mặc định)'}
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
                                                <FormLabel>Ghi chú cho shop</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder='Nhập ghi chú cho đơn hàng (nếu có)'
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
                                                <FormLabel>Phương thức thanh toán</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Chọn phương thức thanh toán' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value='cod'>Thanh toán khi nhận hàng</SelectItem>
                                                        <SelectItem value='stripe'>Thanh toán qua Stripe</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                                <CardFooter>
                                    <Button type='submit' className='w-full' disabled={loading}>
                                        {loading ? 'Đang xử lý...' : `Thanh toán ${formatCurrency(orderSummary.total)}`}
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
                            <CardTitle>Đơn hàng của bạn</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            {/* Danh sách sản phẩm */}
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Sản phẩm</TableHead>
                                        <TableHead className='text-right'>Thành tiền</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {cartItems.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <div className='flex items-start gap-2'>
                                                    <Image
                                                        src={item.image}
                                                        alt={item.productName}
                                                        width={50}
                                                        height={50}
                                                        className='rounded-md'
                                                    />
                                                    <div>
                                                        <p className='font-medium'>{item.productName}</p>
                                                        <p className='text-sm text-gray-500'>
                                                            {Object.entries(item.variant.attributes)
                                                                .map(([key, value]) => `${key}: ${value}`)
                                                                .join(', ')}
                                                        </p>
                                                        <p className='text-sm'>
                                                            {formatCurrency(item.price)} x {item.quantity}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className='text-right'>
                                                {formatCurrency(item.price * item.quantity)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <Separator />

                            {/* Chi tiết thanh toán */}
                            <div className='space-y-2'>
                                <div className='flex justify-between'>
                                    <span>Tạm tính:</span>
                                    <span>{formatCurrency(orderSummary.subtotal)}</span>
                                </div>

                                {shippingInfo && (
                                    <div className='flex justify-between'>
                                        <span>Phí vận chuyển ({shippingInfo.service_name}):</span>
                                        <span>{formatCurrency(orderSummary.shippingFee)}</span>
                                    </div>
                                )}

                                {orderSummary.discounts.promotions > 0 && (
                                    <div className='flex justify-between text-green-600'>
                                        <span>Giảm giá:</span>
                                        <span>-{formatCurrency(orderSummary.discounts.promotions)}</span>
                                    </div>
                                )}

                                {orderSummary.discounts.vouchers > 0 && (
                                    <div className='flex justify-between text-green-600'>
                                        <span>Voucher:</span>
                                        <span>-{formatCurrency(orderSummary.discounts.vouchers)}</span>
                                    </div>
                                )}

                                <Separator />

                                <div className='flex justify-between font-medium text-lg'>
                                    <span>Tổng cộng:</span>
                                    <span>{formatCurrency(orderSummary.total)}</span>
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
