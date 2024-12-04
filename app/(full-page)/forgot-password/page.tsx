'use client'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, ArrowLeft, Loader2, Check } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'

const ForgotPasswordPage = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // Giả lập gửi email
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setIsLoading(false)
        setIsSubmitted(true)
    }

    return (
        <div className='min-h-screen w-full flex items-center justify-center bg-gray-50/50 p-4'>
            <div className='w-full max-w-md transform transition-all duration-500'>
                <Card className='w-full border-0 shadow-lg'>
                    <CardHeader className='space-y-1 pb-8'>
                        <Button
                            variant='ghost'
                            className='w-8 h-8 p-0 absolute left-4 top-4'
                            onClick={() => window.history.back()}
                        >
                            <ArrowLeft className='h-4 w-4' />
                        </Button>

                        <CardTitle className='text-2xl text-center font-bold'>Đặt lại mật khẩu của bạn</CardTitle>
                        <CardDescription className='text-center'>
                            Nhập địa chỉ email của bạn và chúng tôi&apos;sẽ gửi cho bạn hướng dẫn đặt lại mật khẩu của bạn
                        </CardDescription>
                    </CardHeader>

                    <CardContent className='space-y-6'>
                        {isSubmitted ? (
                            // Success State
                            <div className='space-y-6'>
                                <div className='flex flex-col items-center justify-center space-y-4'>
                                    <div className='h-12 w-12 rounded-full bg-green-100 flex items-center justify-center'>
                                        <Check className='h-6 w-6 text-green-600' />
                                    </div>
                                    <Alert>
                                        <AlertDescription className='text-center'>
                                            Chúng ta&apos;đã gửi liên kết đặt lại mật khẩu đến <strong>{email}</strong>.Vui lòng kiểm tra email của bạn và làm theo hướng dẫn để đặt lại mật khẩu của bạn.
                                        </AlertDescription>
                                    </Alert>
                                </div>
                                <div className='space-y-4'>
                                    <Button
                                        className='w-full h-11'
                                        onClick={() => {
                                            setIsSubmitted(false)
                                            setEmail('')
                                        }}
                                    >
                                        Gửi lại
                                    </Button>
                                    <Button
                                        variant='outline'
                                        className='w-full h-11'
                                        onClick={() => window.history.back()}
                                    >
                                        Quay lại đăng nhập
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            // Input State
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
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
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
                                            Gửi hướng dẫn...
                                        </>
                                    ) : (
                                        'Send instructions'
                                    )}
                                </Button>
                            </form>
                        )}
                    </CardContent>

                    <CardFooter className='flex justify-center pb-8'>
                        <span className='text-sm text-gray-500'>
                            Bạn nhớ mật khẩu của bạn?{' '}
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

export default ForgotPasswordPage
