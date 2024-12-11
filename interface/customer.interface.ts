import { PagingResponse } from './paging.interface'

export interface Customer {
    id?: number | null
    firstName: string
    lastName: string
    gender?: number
    dateOfBirth?: Date | null
    customerRoles: number[]
    active?: boolean
}
export type CustomerPagingResponse = PagingResponse<Customer>
