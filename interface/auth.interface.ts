export interface LoginRequest {
    email: string
    rawPassword: string
}

export interface CustomerFullResponse {
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
