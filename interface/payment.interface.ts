export interface PaymentItem {
    idProduct: number
    name: string
    quantity: number
    price: number
    discountPrice?: number
}

export interface PaymentOSRequest {
    // orderCode: number
    amount: number
    description: string
    items?: PaymentItem[]
}
