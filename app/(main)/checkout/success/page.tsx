import React from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const OrderConfirmationPage = () => {
    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-100 p-4'>
            <Card className='w-full max-w-md text-center'>
                <CardHeader className='flex flex-col items-center space-y-4'>
                    <CheckCircle2 size={64} className='text-green-500' />
                    <CardTitle className='text-2xl font-bold text-gray-800'>Đặt Hàng Thành Công</CardTitle>
                </CardHeader>
                <CardContent className='space-y-6'>
                    <div>
                        <p className='text-gray-600 mb-4'>
                            Cảm ơn bạn đã đặt hàng! Đơn hàng của bạn đang được xử lý và sẽ được giao sớm nhất.
                        </p>
                        <p className='text-sm text-gray-500 mb-6'>
                            Mã đơn hàng: <span className='font-bold'>#123456</span>
                        </p>
                    </div>

                    <Link href='/' passHref>
                        <Button className='w-full'>Quay Về Trang Chủ</Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    )
}

export default OrderConfirmationPage
