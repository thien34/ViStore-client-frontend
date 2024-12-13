'use client'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Mail, Lock, User, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const SignUpPage = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // Giả lập đăng ký
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setIsLoading(false)
    }

    const handleGoogleSignUp = () => {
        // Xử lý đăng ký bằng Google
        console.log('Đăng ký Google')
    }

    return (
        <div className='min-h-screen w-full flex items-center justify-center bg-gray-50/50 p-4'>
            <div className='w-full max-w-md transform transition-all duration-500'>
                <Card className='w-full border-0 shadow-lg'>
                    <CardHeader className='space-y-1 pb-8'>
                        <CardTitle className='text-2xl text-center font-bold'>Tạo tài khoản</CardTitle>
                        <CardDescription className='text-center'>Nhập thông tin của bạn để bắt đầu</CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-6'>
                        {/* Google Sign Up Button */}
                        <Button
                            variant='outline'
                            className='w-full h-11 relative hover:bg-gray-50 transition-colors'
                            onClick={handleGoogleSignUp}
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

                        <form onSubmit={handleSubmit} className='space-y-4'>
                            {/* Full Name Input */}
                            <div className='space-y-2'>
                                <Label htmlFor='fullName' className='text-sm font-medium'>
                                    Họ và tên
                                </Label>
                                <div className='relative'>
                                    <User className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                                    <Input
                                        id='fullName'
                                        type='text'
                                        placeholder='John Doe'
                                        className='pl-10 h-11'
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email Input */}
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

                            {/* Password Input */}
                            <div className='space-y-2'>
                                <Label htmlFor='password' className='text-sm font-medium'>
                                    Mật khẩu
                                </Label>
                                <div className='relative'>
                                    <Lock className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                                    <Input
                                        id='password'
                                        type='password'
                                        placeholder='Create a password'
                                        className='pl-10 h-11'
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Confirm Password Input */}
                            <div className='space-y-2'>
                                <Label htmlFor='confirmPassword' className='text-sm font-medium'>
                                    Xác nhận mật khẩu
                                </Label>
                                <div className='relative'>
                                    <Lock className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                                    <Input
                                        id='confirmPassword'
                                        type='password'
                                        placeholder='Confirm your password'
                                        className='pl-10 h-11'
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Terms and Conditions Checkbox */}
                            <div className='flex items-center space-x-2'>
                                <Checkbox id='terms' required />
                                <label
                                    htmlFor='terms'
                                    className='text-sm text-gray-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                                >
                                    Tôi đồng ý với{' '}
                                    <Link href='/terms-of-service' className='text-blue-500 hover:text-blue-600'>
                                        Điều khoản dịch vụ
                                    </Link>{' '}
                                    and{' '}
                                    <Link href='/privacy-policy' className='text-blue-500 hover:text-blue-600'>
                                        Chính sách bảo mật
                                    </Link>
                                </label>
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
                                        Tạo tài khoản...
                                    </>
                                ) : (
                                    'Tạo tài khoản'
                                )}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className='flex justify-center pb-8'>
                        <span className='text-sm text-gray-500'>
                            Bạn đã có tài khoản?{' '}
                            <Link href='/login' className='text-blue-500 hover:text-blue-600 transition-colors'>
                                Đăng nhập
                            </Link>
                        </span>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

export default SignUpPage
