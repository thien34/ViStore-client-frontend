'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CustomerFullResponse } from '@/interface/auth.interface'
import customerService from '@/service/customer.service'

const personalInfoSchema = z.object({
    email: z.string().email(),
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    gender: z.number().refine((value) => [0, 1].includes(value), {
        message: 'Giới tính không hợp lệ'
    }),
    dateOfBirth: z.string()
})

interface PersonalInfoFormProps {
    customer: CustomerFullResponse
}

export function PersonalInfoForm({ customer }: PersonalInfoFormProps) {
    const form = useForm<z.infer<typeof personalInfoSchema>>({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: {
            email: customer.email,
            firstName: customer.firstName,
            lastName: customer.lastName,
            gender: customer.gender,
            dateOfBirth: new Date(customer.dateOfBirth).toISOString().split('T')[0]
        }
    })

    function onSubmit(values: z.infer<typeof personalInfoSchema>) {
        customerService
            .update(customer.id, {
                ...values,
                dateOfBirth: new Date(values.dateOfBirth),
                customerRoles: customer.customerRoles,
                active: customer.active
            })
            .then((response) => {
                console.log('Profile updated successfully', response.payload)
            })
            .catch((error) => {
                console.error('Error updating profile', error)
            })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input {...field} disabled />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

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

                <div className='grid grid-cols-2 gap-4'>
                    <FormField
                        control={form.control}
                        name='gender'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Giới tính</FormLabel>
                                <Select
                                    onValueChange={(value) => field.onChange(Number(value))}
                                    value={String(field.value)}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Chọn giới tính' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value='0'>Nam</SelectItem>
                                        <SelectItem value='1'>Nữ</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='dateOfBirth'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ngày sinh</FormLabel>
                                <FormControl>
                                    <Input type='date' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type='submit'>Cập nhật</Button>
            </form>
        </Form>
    )
}
