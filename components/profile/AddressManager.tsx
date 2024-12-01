'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PlusCircle, Pencil, Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Textarea } from '@/components/ui/textarea'
import { CustomerFullResponse } from '@/interface/auth.interface'
import addressService from '@/service/address.service'
import { District, Province, Ward } from '@/interface/address.interface'
import { toast } from '../ui/use-toast'

const addressSchema = z.object({
    firstName: z.string().min(1, 'Họ là bắt buộc'),
    lastName: z.string().min(1, 'Tên là bắt buộc'),
    phone: z.string().min(10, 'Số điện thoại không hợp lệ'),
    address: z.string().min(5, 'Địa chỉ phải có ít nhất 5 ký tự'),
    province: z.string().min(1, 'Vui lòng chọn tỉnh/thành'),
    district: z.string().min(1, 'Vui lòng chọn quận/huyện'),
    ward: z.string().min(1, 'Vui lòng chọn phường/xã'),
    isDefault: z.boolean().default(false)
})
interface ToastOptions {
    duration?: number
    title: string
    description: string
    variant?: 'default' | 'destructive' | null
}

interface PersonalInfoFormProps {
    customer: CustomerFullResponse
    toast: (options: ToastOptions) => void
}

interface Address {
    id: number
    fullName: string
    phone: string
    address: string
    isDefault: boolean
    provinceId: string
    districtId: string
    wardId: string
}

export function AddressManager({ customer, toast }: PersonalInfoFormProps) {
    const [addresses, setAddresses] = useState<Address[]>([])
    const [isAddingNew, setIsAddingNew] = useState(false)
    const [editingAddress, setEditingAddress] = useState<Address | null>(null)
    const [provinces, setProvinces] = useState<Province[]>([])
    const [districts, setDistricts] = useState<District[]>([])
    const [wards, setWards] = useState<Ward[]>([])

    const loadAddresses = async () => {
        try {
            const { payload: response } = await addressService.getAll(customer.id)
            if (response?.items) {
                const fetchedAddresses = response.items.map((item: any, index: number) => ({
                    id: item.id!,
                    fullName: `${item.firstName} ${item.lastName}`,
                    phone: item.phoneNumber,
                    address: item.addressDetail,
                    isDefault: index === 0,
                    provinceId: item.provinceId,
                    districtId: item.districtId,
                    wardId: item.wardId
                }))

                setAddresses(fetchedAddresses)
            }
        } catch (error) {
            console.error('Error loading addresses:', error)
        }
    }

    useEffect(() => {
        loadAddresses()
    }, [customer.id])

    const form = useForm<z.infer<typeof addressSchema>>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            phone: '',
            address: '',
            province: '',
            district: '',
            ward: '',
            isDefault: false
        }
    })

    async function onSubmit(values: z.infer<typeof addressSchema>) {
        const addressRequest = {
            firstName: values.firstName,
            lastName: values.lastName,
            phoneNumber: values.phone,
            addressName: values.address,
            provinceId: values.province,
            districtId: values.district,
            wardId: values.ward,
            customerId: customer.id
        }

        try {
            if (editingAddress) {
                await addressService.update(editingAddress.id, addressRequest)
                toast({
                    title: 'Update address successful',
                    description: 'Address updated successfully',
                    variant: 'default'
                })
            } else {
                await addressService.create(addressRequest)
                toast({
                    title: 'Create address successful',
                    description: 'Address created successfully',
                    variant: 'default'
                })
            }

            setIsAddingNew(false)
            setEditingAddress(null)
            await loadAddresses()
            form.reset()
        } catch (error) {
            toast({
                title: 'Address update failed',
                description: 'Failed to update the address',
                variant: 'destructive'
            })
        }
    }

    useEffect(() => {
        const loadProvinces = async () => {
            try {
                const response = await addressService.getProvinces()
                setProvinces(response.map((p: Province) => ({ fullName: p.fullName, code: p.code })))
            } catch (error) {
                console.error('Error loading provinces:', error)
            }
        }
        loadProvinces()
    }, [])
    useEffect(() => {
        if (editingAddress) {
            const fetchAddressDetails = async () => {
                try {
                    const { payload: data } = await addressService.getById(editingAddress.id)
                    if (data) {
                        form.setValue('firstName', data.firstName || '')
                        form.setValue('lastName', data.lastName || '')
                        form.setValue('phone', data.phoneNumber)
                        form.setValue('address', data.addressName)
                        form.setValue('province', data.provinceId)
                        form.setValue('district', data.districtId)
                        form.setValue('ward', data.wardId)
                        handleProvinceChange(data.provinceId)
                        handleDistrictChange(data.districtId)
                    }
                } catch (error) {
                    console.error('Error fetching address details:', error)
                }
            }

            fetchAddressDetails()
        }
    }, [editingAddress, form])

    const handleProvinceChange = async (provinceCode: string) => {
        try {
            const response = await addressService.getDistricts(provinceCode)
            setDistricts(response.map((d: District) => ({ fullName: d.fullName, code: d.code })))

            if (!editingAddress) {
                setWards([])
                form.setValue('district', '')
                form.setValue('ward', '')
            }
        } catch (error) {
            console.error('Error loading districts:', error)
        }
    }

    const handleDistrictChange = async (districtCode: string) => {
        try {
            const response = await addressService.getWards(districtCode)
            setWards(response.map((w: any) => ({ fullName: w.fullName, code: w.code })))

            if (!editingAddress) {
                form.setValue('ward', '')
            }
        } catch (error) {
            console.error('Error loading wards:', error)
        }
    }

    return (
        <div className='space-y-4'>
            <Button onClick={() => setIsAddingNew(true)} className='mb-4'>
                <PlusCircle className='mr-2 h-4 w-4' />
                New address
            </Button>

            <div className='grid gap-4'>
                {addresses.map((address) => (
                    <Card key={address.id}>
                        <CardContent className='p-4'>
                            <div className='flex justify-between items-start'>
                                <div>
                                    <div className='font-medium'>
                                        {address.fullName}{' '}
                                        {address.isDefault && (
                                            <span className='text-sm text-blue-600 ml-2'>[Mặc định]</span>
                                        )}
                                    </div>
                                    <div className='text-sm text-gray-600'>{address.phone}</div>
                                    <div className='text-sm mt-1' style={{ whiteSpace: 'pre-line' }}>
                                        {address.address}
                                    </div>
                                </div>
                                <div className='flex space-x-2'>
                                    <Button variant='outline' size='icon' onClick={() => setEditingAddress(address)}>
                                        <Pencil className='h-4 w-4' />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog
                open={isAddingNew || !!editingAddress}
                onOpenChange={() => {
                    setIsAddingNew(false)
                    setEditingAddress(null)
                    form.reset()
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isAddingNew ? 'Thêm địa chỉ mới' : 'Chỉnh sửa địa chỉ'}</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                            <div className='flex space-x-4'>
                                <FormField
                                    control={form.control}
                                    name='firstName'
                                    render={({ field }) => (
                                        <FormItem className='flex-1'>
                                            <FormLabel>Họ</FormLabel>
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
                                        <FormItem className='flex-1'>
                                            <FormLabel>Tên</FormLabel>
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
                                name='phone'
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
                                name='address'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Địa chỉ</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='province'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tỉnh/Thành</FormLabel>
                                        <FormControl>
                                            <select
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e)
                                                    handleProvinceChange(e.target.value)
                                                }}
                                                className='border rounded w-full px-3 py-2 text-sm'
                                            >
                                                <option value=''>Chọn tỉnh/thành</option>
                                                {provinces.map((province) => (
                                                    <option key={province.code} value={province.code}>
                                                        {province.fullName}
                                                    </option>
                                                ))}
                                            </select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='district'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Quận/Huyện</FormLabel>
                                        <FormControl>
                                            <select
                                                {...field}
                                                disabled={!form.watch('province')}
                                                onChange={(e) => {
                                                    field.onChange(e)
                                                    handleDistrictChange(e.target.value)
                                                }}
                                                className='border rounded w-full px-3 py-2 text-sm'
                                            >
                                                <option value=''>Chọn quận/huyện</option>
                                                {districts.map((district) => (
                                                    <option key={district.code} value={district.code}>
                                                        {district.fullName}
                                                    </option>
                                                ))}
                                            </select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='ward'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phường/Xã</FormLabel>
                                        <FormControl>
                                            <select
                                                {...field}
                                                disabled={!form.watch('district')}
                                                className='border rounded w-full px-3 py-2 text-sm'
                                            >
                                                <option value=''>Chọn phường/xã</option>
                                                {wards.map((ward) => (
                                                    <option key={ward.code} value={ward.code}>
                                                        {ward.fullName}
                                                    </option>
                                                ))}
                                            </select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type='submit'>{isAddingNew ? 'Thêm địa chỉ' : 'Cập nhật'}</Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
