export interface Voucher {
    id: number
    name: string
    discountTypeName: string
    discountAmount: number | null
    discountPercentage: number | null
    startDateUtc: string
    endDateUtc: string
    limitationTimes: number
    status: string
    requiresCouponCode: boolean
    couponCode: string
    maxDiscountAmount: number | null
    minOderAmount: number
    usePercentage: boolean
    isCumulative: boolean
    appliedCustomerIds: string[] | null
    isPublished: boolean
    usageCount: number
}

export interface Vouchers {
    items: Voucher[]
}

export interface VouchersPagingResponse {
    data: Vouchers
}
