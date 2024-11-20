'use client'
import { useState } from 'react'
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

const addressSchema = z.object({
    fullName: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
    phone: z.string().min(10, 'Số điện thoại không hợp lệ'),
    address: z.string().min(5, 'Địa chỉ phải có ít nhất 5 ký tự'),
    province: z.string().min(1, 'Vui lòng chọn tỉnh/thành'),
    district: z.string().min(1, 'Vui lòng chọn quận/huyện'),
    ward: z.string().min(1, 'Vui lòng chọn phường/xã'),
    isDefault: z.boolean().default(false)
})

interface PersonalInfoFormProps {
    customer: CustomerFullResponse
}

type Address = {
    id: number
    fullName: string
    phone: string
    address: string
    province: string
    district: string
    ward: string
    isDefault: boolean
}

export function AddressManager({ customer }: PersonalInfoFormProps) {
    const [addresses, setAddresses] = useState<Address[]>([
        {
            id: 1,
            fullName: 'Nguyễn Văn A',
            phone: '0123456789',
            address: '123 Đường ABC',
            province: 'Hồ Chí Minh',
            district: 'Quận 1',
            ward: 'Phường Bến Nghé',
            isDefault: true
        }
    ])
    const [isAddingNew, setIsAddingNew] = useState(false)
    const [editingAddress, setEditingAddress] = useState<Address | null>(null)

    const loadAddresses = async () => {
        const { payload: response } = await addressService.getAll(customer.id)
        // setAddresses(response)
    }

    const form = useForm<z.infer<typeof addressSchema>>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            fullName: '',
            phone: '',
            address: '',
            province: '',
            district: '',
            ward: '',
            isDefault: false
        }
    })

    function onSubmit(values: z.infer<typeof addressSchema>) {
        // TODO: Implement address save logic
        console.log(values)
        setIsAddingNew(false)
        setEditingAddress(null)
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
                                    <div className='text-sm mt-1'>
                                        {address.address}, {address.ward}, {address.district}, {address.province}
                                    </div>
                                </div>
                                <div className='flex space-x-2'>
                                    <Button variant='outline' size='icon' onClick={() => setEditingAddress(address)}>
                                        <Pencil className='h-4 w-4' />
                                    </Button>
                                    <Button
                                        variant='outline'
                                        size='icon'
                                        className='text-red-600'
                                        onClick={() => {
                                            // TODO: Implement delete logic
                                        }}
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
                onOpenChange={() => {
                    setIsAddingNew(false)
                    setEditingAddress(null)
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isAddingNew ? 'Thêm địa chỉ mới' : 'Chỉnh sửa địa chỉ'}</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                            <FormField
                                control={form.control}
                                name='fullName'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Họ tên</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

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

                            <div className='grid grid-cols-3 gap-4'>
                                <FormField
                                    control={form.control}
                                    name='province'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tỉnh/Thành</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
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
                                                <Input {...field} />
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
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button type='submit'>{isAddingNew ? 'Thêm địa chỉ' : 'Cập nhật'}</Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
