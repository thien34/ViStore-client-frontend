'use client'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Mail, Lock, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import authService from '@/service/auth.service'

const LoginPage = () => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await authService.login({
                email: formData.email,
                rawPassword: formData.password
            })

            // Có thể lưu thông tin user vào localStorage hoặc global state ở đây
            localStorage.setItem('user', JSON.stringify(response.payload))

            router.push('/') // hoặc trang sau khi đăng nhập
        } catch (error: any) {
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleSignIn = () => {
        // Xử lý đăng nhập bằng Google
        console.log('Google sign in')
    }

    return (
        <div className='min-h-screen w-full flex items-center justify-center bg-gray-50/50 p-4'>
            <div className='w-full max-w-md transform transition-all duration-500'>
                <Card className='w-full border-0 shadow-lg'>
                    <CardHeader className='space-y-1 pb-8'>
                        <CardTitle className='text-2xl text-center font-bold'>Chào mừng trở lại</CardTitle>
                        <CardDescription className='text-center'>Đăng nhập vào tài khoản của bạn để tiếp tục</CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-6'>
                        {/* Google Sign In Button */}
                        <Button
                            variant='outline'
                            className='w-full h-11 relative hover:bg-gray-50 transition-colors'
                            onClick={handleGoogleSignIn}
                        >
                            <div className='absolute left-4'>
                                <svg width='20' height='20' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
                                    <path
                                        fill='#EA4335'
                                        d='M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z'
                                    />
                                    <path
                                        fill='#4285F4'
                                        d='M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z'
                                    />
                                    <path
                                        fill='#FBBC05'
                                        d='M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z'
                                    />
                                    <path
                                        fill='#34A853'
                                        d='M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z'
                                    />
                                </svg>
                            </div>
                            Tiếp tục với Google
                        </Button>

                        <div className='flex items-center space-x-2'>
                            <Separator className='flex-1' />
                            <span className='text-sm text-gray-400'>OR</span>
                            <Separator className='flex-1' />
                        </div>

                        <form onSubmit={handleSubmit} className='space-y-4'>
                            <div className='space-y-2'>
                                <Label htmlFor='email' className='text-sm font-medium'>
                                    Địa chỉ email
                                </Label>
                                <div className='relative'>
                                    <Mail className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                                    <Input
                                        id='email'
                                        type='email'
                                        placeholder='name@example.com'
                                        className='pl-10 h-11'
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className='space-y-2'>
                                <div className='flex justify-between items-center'>
                                    <Label htmlFor='password' className='text-sm font-medium'>
                                        Mật khẩu
                                    </Label>
                                    <Link
                                        href='/forgot-password'
                                        className='text-sm text-blue-500 hover:text-blue-600 transition-colors'
                                    >
                                        Quên mật khẩu?
                                    </Link>
                                </div>
                                <div className='relative'>
                                    <Lock className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                                    <Input
                                        id='password'
                                        type='password'
                                        placeholder='Enter your password'
                                        className='pl-10 h-11'
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

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
