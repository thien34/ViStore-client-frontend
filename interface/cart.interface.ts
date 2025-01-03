export interface CartResponse {
    id: number
    idProduct: number
    slug: string
    name: string
    image: string
    unitPrice: number
    discountPrice: number
    quantity: number
    quantityProduct: number
    attributeProduct: string
}

export interface CartRequest {
    productId: number
    quantity: number
    customerId: number
}

export interface CartUpdateRequest {
    quantity: number
}
