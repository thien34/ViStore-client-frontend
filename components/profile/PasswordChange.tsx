'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const passwordSchema = z
    .object({
        currentPassword: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
        newPassword: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
        confirmPassword: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Mật khẩu xác nhận không khớp',
        path: ['confirmPassword']
    })

export function PasswordChange() {
    const form = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
    })

    function onSubmit(values: z.infer<typeof passwordSchema>) {
        // TODO: Implement password change logic
        console.log(values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 max-w-md'>
                <FormField
                    control={form.control}
                    name='currentPassword'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mật khẩu hiện tại</FormLabel>
                            <FormControl>
                                <Input type='password' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='newPassword'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mật khẩu mới</FormLabel>
                            <FormControl>
                                <Input type='password' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='confirmPassword'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                            <FormControl>
                                <Input type='password' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type='submit'>Đổi mật khẩu</Button>
            </form>
        </Form>
    )
}
