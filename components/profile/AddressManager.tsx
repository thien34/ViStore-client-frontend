'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PlusCircle, Pencil, Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { CustomerFullResponse } from '@/interface/auth.interface'
import addressService from '@/service/address.service'
import { AddressesResponse, AddressRequest, District, Province, Ward } from '@/interface/address.interface'
import { getDistricts, getProvinces, getWards } from '@/service/shipping.service'
import { useToast } from '@/components/ui/use-toast'

const addressSchema = z.object({
    firstName: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
    lastName: z.string().min(2, 'Họ phải có ít nhất 2 ký tự'),
    phoneNumber: z.string().min(10, 'Số điện thoại không hợp lệ'),
    addressName: z.string().min(5, 'Địa chỉ phải có ít nhất 5 ký tự'),
    provinceId: z.string().min(1, 'Vui lòng chọn tỉnh/thành'),
    districtId: z.string().min(1, 'Vui lòng chọn quận/huyện'),
    wardId: z.string().min(1, 'Vui lòng chọn phường/xã'),
    email: z.string().email('Email không hợp lệ').optional(),
    company: z.string().optional()
})

interface AddressManagerProps {
    customer: CustomerFullResponse
}

export function AddressManager({ customer }: AddressManagerProps) {
    const [addresses, setAddresses] = useState<AddressesResponse[]>([])
    const [isAddingNew, setIsAddingNew] = useState(false)
    const [editingAddress, setEditingAddress] = useState<AddressesResponse | null>(null)
    const { toast } = useToast()
    // Location states
    const [provinces, setProvinces] = useState<Province[]>([])
    const [districts, setDistricts] = useState<District[]>([])
    const [wards, setWards] = useState<Ward[]>([])

    // Form setup
    const form = useForm<z.infer<typeof addressSchema>>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            phoneNumber: '',
            addressName: '',
            provinceId: '',
            districtId: '',
            wardId: '',
            email: '',
            company: ''
        }
    })

    // Load addresses on component mount
    useEffect(() => {
        const loadAddresses = async () => {
            try {
                const { payload: response } = await addressService.getAll(customer.id)
                setAddresses(response.items)
            } catch (error) {
                console.log('Không thể tải danh sách địa chỉ')
            }
        }

        // Load provinces
        const loadProvinces = async () => {
            try {
                const provincesData = await getProvinces()
                setProvinces(provincesData)
            } catch (error) {
                console.log('Không thể tải danh sách tỉnh/thành')
            }
        }

        loadAddresses()
        loadProvinces()
    }, [customer.id])

    // Handle province selection and load districts
    const handleProvinceChange = async (provinceId: string) => {
        try {
            const districtsData = await getDistricts(Number(provinceId))
            setDistricts(districtsData)
            setWards([])
            form.setValue('districtId', '')
            form.setValue('wardId', '')
        } catch (error) {
            console.log('Không thể tải danh sách quận/huyện')
        }
    }

    // Handle district selection and load wards
    const handleDistrictChange = async (districtId: string) => {
        try {
            const wardsData = await getWards(Number(districtId))
            setWards(wardsData)
            form.setValue('wardId', '')
        } catch (error) {
            console.log('Không thể tải danh sách phường/xã')
        }
    }

    // Prepare address for editing
    const prepareEditAddress = async (address: AddressesResponse) => {
        setEditingAddress(address)
        const { payload: addressData } = await addressService.getById(address.id ?? 0)
        const districtsData = await getDistricts(Number(addressData.provinceId))
        setDistricts(districtsData)
        const wardsData = await getWards(Number(addressData.districtId))
        setWards(wardsData)

        setTimeout(
            () =>
                form.reset({
                    firstName: addressData.firstName,
                    lastName: addressData.lastName,
                    phoneNumber: addressData.phoneNumber,
                    addressName: addressData.addressName,
                    provinceId: addressData.provinceId,
                    districtId: addressData.districtId,
                    wardId: addressData.wardId,
                    email: addressData.email,
                    company: addressData.company ?? ''
                }),
            10
        )
    }

    // Submit form for creating/updating address
    async function onSubmit(values: z.infer<typeof addressSchema>) {
        try {
            const addressData: AddressRequest = {
                ...values,
                email: values.email || '',
                customerId: customer.id,
                id: editingAddress?.id
            }

            if (editingAddress) {
                await addressService.update(editingAddress?.id ?? 0, addressData)
                toast({
                    title: 'Cập nhật thành công',
                    description: 'Địa chỉ của bạn đã được cập nhật',
                    variant: 'default'
                })
            } else {
                await addressService.create(addressData)
                toast({
                    title: 'Thêm địa chỉ thành công',
                    description: 'Địa chỉ của bạn đã được thêm',
                    variant: 'default'
                })
            }

            // Refresh addresses
            const { payload: response } = await addressService.getAll(customer.id)
            setAddresses(response.items)

            // Reset form and close dialog
            form.reset()
            setIsAddingNew(false)
            setEditingAddress(null)
        } catch (error: any) {
            console.log(error.message || 'Không thể lưu địa chỉ')
        }
    }

    // Delete address
    const handleDeleteAddress = async (addressId: number) => {
        try {
            await addressService.delete(addressId)
            console.log('Địa chỉ đã được xóa')

            // Refresh addresses
            const { payload: response } = await addressService.getAll(customer.id)
            setAddresses(response.items)
        } catch (error: any) {
            console.log(error.message || 'Không thể xóa địa chỉ')
        }
    }

    return (
        <div className='space-y-4'>
            <Button
                onClick={() => {
                    setIsAddingNew(true)
                    form.reset()
                }}
                className='mb-4'
            >
                <PlusCircle className='mr-2 h-4 w-4' />
                Thêm địa chỉ mới
            </Button>

            <div className='grid gap-4'>
                {addresses.map((address) => (
                    <Card key={address.id}>
                        <CardContent className='p-4'>
                            <div className='flex justify-between items-start'>
                                <div>
                                    <div className='font-medium'>
                                        {address.firstName} {address.lastName}
                                    </div>
                                    <div className='text-sm text-gray-600'>{address.phoneNumber}</div>
                                    <div className='text-sm mt-1'>{address.addressDetail}</div>
                                </div>
                                <div className='flex space-x-2'>
                                    <Button variant='outline' size='icon' onClick={() => prepareEditAddress(address)}>
                                        <Pencil className='h-4 w-4' />
                                    </Button>
                                    <Button
                                        variant='outline'
                                        size='icon'
                                        className='text-red-600'
                                        onClick={() => address.id && handleDeleteAddress(address.id)}
                                    >
                                        <Trash2 className='h-4 w-4' />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog
                open={isAddingNew || !!editingAddress}
                onOpenChange={(open) => {
                    if (!open) {
                        setIsAddingNew(false)
                        setEditingAddress(null)
                        form.reset({
                            firstName: '',
                            lastName: '',
                            phoneNumber: '',
                            addressName: '',
                            provinceId: '',
                            districtId: '',
                            wardId: '',
                            email: '',
                            company: ''
                        })
                        setDistricts([])
                        setWards([])
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isAddingNew ? 'Thêm địa chỉ mới' : 'Cập nhật địa chỉ'}</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                            <div className='grid grid-cols-2 gap-4'>
                                <FormField
                                    control={form.control}
                                    name='firstName'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tên</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='lastName'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Họ</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name='phoneNumber'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Số điện thoại</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='addressName'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Địa chỉ chi tiết</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className='grid grid-cols-3 gap-4'>
                                <FormField
                                    control={form.control}
                                    name='provinceId'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tỉnh/Thành</FormLabel>
                                            <Select
                                                onValueChange={(value) => {
                                                    field.onChange(value)
                                                    handleProvinceChange(value)
                                                }}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Chọn tỉnh/thành' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {provinces.map((province) => (
                                                        <SelectItem
                                                            key={province.ProvinceID}
                                                            value={province.ProvinceID.toString()}
                                                        >
                                                            {province.ProvinceName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name='districtId'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Quận/Huyện</FormLabel>
                                            <Select
                                                onValueChange={(value) => {
                                                    field.onChange(value)
                                                    handleDistrictChange(value)
                                                }}
                                                value={field.value}
                                                disabled={!form.getValues('provinceId')}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Chọn quận/huyện' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {districts.map((district) => (
                                                        <SelectItem
                                                            key={district.DistrictID}
                                                            value={district.DistrictID.toString()}
                                                        >
                                                            {district.DistrictName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name='wardId'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phường/Xã</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                disabled={!form.getValues('districtId')}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Chọn phường/xã' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {wards.map((ward) => (
                                                        <SelectItem key={ward.WardCode} value={ward.WardCode}>
                                                            {ward.WardName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <FormField
                                    control={form.control}
                                    name='email'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name='company'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Công ty (Tùy chọn)</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button type='submit' className='w-full'>
                                {isAddingNew ? 'Thêm địa chỉ' : 'Cập nhật địa chỉ'}
                            </Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
