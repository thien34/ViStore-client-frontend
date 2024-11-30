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
import { CustomerUpdateRequest } from '@/interface/customer.interface'
import React from 'react'
import { Toaster } from '../ui/toaster'
// Update the ToastOptions type definition
interface ToastOptions {
    duration?: number
    title: string
    description: string
    variant?: 'default' | 'destructive' | null
}

// Định nghĩa schema cho form validation
const personalInfoSchema = z.object({
    email: z.string().email(),
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    gender: z.number().refine((value) => [0, 1, 2].includes(value), {
        message: 'Giới tính không hợp lệ'
    }),
    dateOfBirth: z.string() // Chuyển đổi Date thành string để sử dụng trong form
})

interface PersonalInfoFormProps {
    customer: CustomerFullResponse
    setCustomerInfo: React.Dispatch<React.SetStateAction<CustomerFullResponse | null>>
    toast: (options: ToastOptions) => void
}

export function PersonalInfoForm({ toast, customer, setCustomerInfo }: PersonalInfoFormProps) {
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

    async function onSubmit(values: z.infer<typeof personalInfoSchema>) {
        // TODO: Implement update profile logic
        const customerId = customer.id
        try {
            const updateValues: CustomerUpdateRequest = {
                ...values,
                dateOfBirth: new Date(values.dateOfBirth)
            }
            await customerService.update(customerId, updateValues)
            toast({
                title: 'Update successful',
                description: 'Customer information has been updated.',
                variant: 'default'
            })
            const updatedCustomer = await customerService.getById(customerId)
            setCustomerInfo(updatedCustomer.payload)
            const userData = JSON.parse(localStorage.getItem('user') || '{}')
            userData.customerInfo = updatedCustomer.payload
            localStorage.setItem('user', JSON.stringify(userData))
        } catch (error) {
            toast({
                title: 'Update failed',
                description: 'Customer information update failed',
                variant: 'destructive'
            })
        }
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
                                <FormLabel>First name</FormLabel>
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
                                <FormLabel>Last name</FormLabel>
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
                                <FormLabel>Gender</FormLabel>
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
                                        <SelectItem value='0'>Male</SelectItem>
                                        <SelectItem value='1'>Female</SelectItem>
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
                                <FormLabel>Date of Birth</FormLabel>
                                <FormControl>
                                    <Input type='date' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type='submit'>Update</Button>
            </form>
        </Form>
    )
}
