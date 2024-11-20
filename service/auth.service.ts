import { CustomerFullResponse, LoginRequest } from '@/interface/auth.interface'
import http from '@/lib/http'

class AuthService {
    private basePath = '/api/client/auth'

    async login(loginRequest: LoginRequest) {
        const response = await http.post<CustomerFullResponse>(`${this.basePath}/login`, loginRequest)
        return response
    }
}

const authService = new AuthService()
export default authService
