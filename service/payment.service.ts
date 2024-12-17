import { PaymentOSRequest } from '@/interface/payment.interface'

export class PayOSService {
    private static BASE_API_URL = '/api/payment'

    static async createPaymentLink(paymentOSRequest: PaymentOSRequest): Promise<string> {
        try {
            const response = await fetch(this.BASE_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(paymentOSRequest)
            })

            if (!response.ok) {
                throw new Error('Failed to create payment link')
            }

            const data = await response.json()
            return data.checkoutUrl
        } catch (error) {
            console.error('Error creating payment link:', error)
            throw error
        }
    }
}
