// types/checkout.ts
export interface ProductVariant {
    id: string
    name: string
    attributes: {
        [key: string]: string // Example: { "Size": "L", "Color": "Red" }
    }
}

export interface CartItem {
    id: string
    productId: string
    productName: string
    variant: ProductVariant
    price: number
    quantity: number
    image: string
}

export interface Discount {
    id: string
    type: 'percentage' | 'fixed'
    value: number
    code?: string
    description: string
}

export interface ShippingCalculation {
    fee: number
    service_id: number
    service_name: string
    estimated_delivery_time: string
}

export interface OrderSummary {
    subtotal: number
    shippingFee: number
    discounts: {
        promotions: number
        vouchers: number
    }
    total: number
}
