'use client'
import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PersonalInfoForm } from '@/components/profile/PersonalInfoForm'
import { AddressManager } from '@/components/profile/AddressManager'
import { PasswordChange } from '@/components/profile/PasswordChange'
import { OrderHistory } from '@/components/profile/OrderHistory'
import { CustomerFullResponse } from '@/interface/auth.interface'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
    const [customerInfo, setCustomerInfo] = useState<CustomerFullResponse | null>(null)
    const router = useRouter()
    useEffect(() => {
        const userDataString = localStorage.getItem('user')
        const userData = userDataString ? JSON.parse(userDataString) : null
        setCustomerInfo(userData?.customerInfo || null)
        if (!userData) {
            router.push('/login')
        }
    }, [router])

    if (!customerInfo) {
        return <div>Đang tải...</div>
    }

    return (
        <div className='container mx-auto py-6'>
            <h1 className='text-3xl font-bold mb-6'>Hồ sơ của tôi</h1>
            <Tabs defaultValue='personal' className='w-full'>
                <TabsList className='grid w-full grid-cols-3'>
                    <TabsTrigger value='personal'>Thông tin</TabsTrigger>
                    <TabsTrigger value='addresses'>Địa chỉ</TabsTrigger>
                    {/* <TabsTrigger value='password'>Đổi mật khẩu</TabsTrigger> */}
                    <TabsTrigger value='orders'>Đơn hàng</TabsTrigger>
                </TabsList>

                <TabsContent value='personal'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin cá nhân</CardTitle>
                            <CardDescription>Quản lý thông tin cá nhân của bạn</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <PersonalInfoForm customer={customerInfo} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value='addresses'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Địa chỉ</CardTitle>
                            <CardDescription>Quản lý địa chỉ giao hàng của bạn</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AddressManager customer={customerInfo} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value='password'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Thay đổi mật khẩu</CardTitle>
                            <CardDescription>Cập nhật mật khẩu của bạn</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <PasswordChange />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value='orders'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Đơn hàng của tôi</CardTitle>
                            <CardDescription>Lịch sử đơn hàng của bạn</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <OrderHistory />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
