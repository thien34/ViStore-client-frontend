export interface CustomerFullRequest {
    id: number

    customerGuid: string

    email: string

    firstName: string

    lastName: string

    gender: number

    dateOfBirth: Date

    customerRoles: number[]

    active: boolean
}

export interface CustomerUpdateRequest {
    firstName: string
    lastName: string
    gender: number
    dateOfBirth: Date
}