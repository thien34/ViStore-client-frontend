export interface Promotion {
    id: number
    name: string
    discountTypeName: string
    discountAmount: number | null
    discountPercentage: number
    startDateUtc: string
    endDateUtc: string
    limitationTimes: number | null
    status: string
}
