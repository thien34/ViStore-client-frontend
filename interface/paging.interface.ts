export interface PagingResponse<T> {
    totalItems: number
    totalPages: number
    items: T[]
}

export interface PagingRequest<T = Record<string, number>> {
    pageNo: number
    pageSize: number
    sortBy?: string
    sortDir?: number
    keywords?: string
    filters?: T
}
