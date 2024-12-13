'use client'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'
import authService from '@/service/auth.service'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const formSchema = z.object({
    email: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),
    password: z.string().min(1, 'Mật khẩu là bắt buộc')
})

const LoginPage = () => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true)

        try {
            const response = await authService.login({
                email: values.email,
                rawPassword: values.password
            })

            localStorage.setItem('user', JSON.stringify(response.payload))
            router.push('/')
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Đăng nhập thất bại',
                description: error?.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại',
                duration: 3000
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleSignIn = () => {
        toast({
            variant: 'default',
            title: 'Chức năng đang phát triển',
            description: 'Đăng nhập bằng Google hiện chưa khả dụng.',
            duration: 3000
        })
    }

    return (
        <div className='min-h-screen w-full flex items-center justify-center bg-gray-50/50 p-4'>
            <div className='w-full max-w-md transform transition-all duration-500'>
                <Card className='w-full border-0 shadow-lg'>
                    <CardHeader className='space-y-1 pb-8'>
                        <CardTitle className='text-2xl text-center font-bold'>Chào mừng trở lại</CardTitle>
                        <CardDescription className='text-center'>
                            Đăng nhập vào tài khoản của bạn để tiếp tục
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-6'>
                        {/* Google Sign In Button */}
                        <Button
                            variant='outline'
                            className='w-full h-11 relative hover:bg-gray-50 transition-colors'
                            onClick={handleGoogleSignIn}
                        >
                            <div className='absolute left-4'>
                                <Image src='/icon/google-icon.svg' alt='Google' width={20} height={20} />
                            </div>
                            Tiếp tục với Google
                        </Button>

                        <div className='flex items-center space-x-2'>
                            <Separator className='flex-1' />
                            <span className='text-sm text-gray-400'>OR</span>
                            <Separator className='flex-1' />
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
                                <FormField
                                    control={form.control}
                                    name='email'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Địa chỉ email</FormLabel>
                                            <div className='relative'>
                                                <Mail className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                                                <FormControl>
                                                    <Input
                                                        placeholder='name@example.com'
                                                        className='pl-10 h-11'
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name='password'
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className='flex justify-between items-center'>
                                                <FormLabel>Mật khẩu</FormLabel>
                                                <Link
                                                    href='/forgot-password'
                                                    className='text-sm text-blue-500 hover:text-blue-600 transition-colors'
                                                >
                                                    Quên mật khẩu?
                                                </Link>
                                            </div>
                                            <div className='relative'>
                                                <Lock className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                                                <FormControl>
                                                    <Input
                                                        type={showPassword ? 'text' : 'password'}
                                                        placeholder='Enter your password'
                                                        className='pl-10 pr-10 h-11'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <button
                                                    type='button'
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className='h-4 w-4' />
                                                    ) : (
                                                        <Eye className='h-4 w-4' />
                                                    )}
                                                </button>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type='submit'
                                    className='w-full h-11 text-base font-medium transition-all duration-300 
                                    hover:shadow-lg active:scale-[0.98]'
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                            Đăng nhập...
                                        </>
                                    ) : (
                                        'Đăng nhập'
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>

                    <CardFooter className='flex justify-center pb-8'>
                        <span className='text-sm text-gray-500'>
                            Bạn chưa có tài khoản?{' '}
                            <Link href='/sign-up' className='text-blue-500 hover:text-blue-600 transition-colors'>
                                Đăng ký
                            </Link>
                        </span>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

export default LoginPage
