import { PaymentOSRequest } from '@/interface/payment.interface'
import PayOS from '@payos/node'
import { NextResponse } from 'next/server'

const payOS = new PayOS(process.env.PAYOS_CLIENT_ID!, process.env.PAYOS_API_KEY!, process.env.PAYOS_CHECKSUM_KEY!)

export async function POST(req: Request) {
    const YOUR_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN

    const { amount, description, items }: PaymentOSRequest = await req.json()

    const body = {
        orderCode: Number(String(Date.now()).slice(-6)),
        amount,
        description,
        items,
        returnUrl: `${YOUR_DOMAIN}`,
        cancelUrl: `${YOUR_DOMAIN}`,
        expiration: 60 * 30 // expires in 30 minutes
    }

    try {
        const res = await payOS.createPaymentLink(body)
        return NextResponse.json({ checkoutUrl: res.checkoutUrl })
    } catch (error) {
        console.error('Error creating payment link:', error)
    }
}
