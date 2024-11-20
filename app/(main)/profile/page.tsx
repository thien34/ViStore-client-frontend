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
        return <div>Loading...</div>
    }

    return (
        <div className='container mx-auto py-6'>
            <h1 className='text-3xl font-bold mb-6'>My Profile</h1>
            <Tabs defaultValue='personal' className='w-full'>
                <TabsList className='grid w-full grid-cols-4'>
                    <TabsTrigger value='personal'>Information</TabsTrigger>
                    <TabsTrigger value='addresses'>Address</TabsTrigger>
                    <TabsTrigger value='password'>Change password</TabsTrigger>
                    <TabsTrigger value='orders'>Order</TabsTrigger>
                </TabsList>

                <TabsContent value='personal'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>Manage your personal information</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <PersonalInfoForm customer={customerInfo} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value='addresses'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Address</CardTitle>
                            <CardDescription>Manage your shipping addresses</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AddressManager customer={customerInfo} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value='password'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Change Password</CardTitle>
                            <CardDescription>Update your password</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <PasswordChange />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value='orders'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Order History</CardTitle>
                            <CardDescription>View your order history</CardDescription>
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
