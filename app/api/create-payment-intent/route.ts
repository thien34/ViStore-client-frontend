import { loadStripe } from '@stripe/stripe-js'
export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!)
import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-11-20.acacia'
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    try {
        const { items, orderData } = req.body

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: items.map((item: any) => ({
                price_data: {
                    currency: 'vnd',
                    product_data: {
                        name: item.name
                    },
                    unit_amount: item.price
                },
                quantity: item.quantity
            })),
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_URL}/checkout`,
            metadata: {
                orderId: orderData.orderId
            }
        })

        res.status(200).json({ sessionId: session.id })
    } catch (error) {
        console.error('Error creating Stripe session:', error)
        res.status(500).json({ message: 'Error creating Stripe session' })
    }
}
