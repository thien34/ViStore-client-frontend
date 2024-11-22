type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'

const httpInstance = async function <Response>(path: string, method: Method, data?: unknown, config?: RequestInit) {
    const fullUrl = `${process.env.NEXT_PUBLIC_API_DOMAIN}${path}`
    const requestOptions: RequestInit = {
        method,
        body: data ? JSON.stringify(data) : undefined,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            cache: 'no-store'
        },
        next: { revalidate: 0 },
        credentials: 'include',
        ...config
    }

    try {
        const res = await fetch(fullUrl, requestOptions)
        const payload = await res.json()
        if (!res.ok) {
            throw new Error('Error in fetching data')
        }
        return {
            payload: payload.data as Response,
            status: res.status
        }
    } catch (error) {
        console.error('HTTP request failed:', error)
        throw error
    }
}

const http = {
    get: <Response>(path: string, config?: RequestInit) => httpInstance<Response>(path, 'GET', undefined, config),

    post: <Response>(path: string, data: unknown, config?: RequestInit) =>
        httpInstance<Response>(path, 'POST', data, config),

    put: <Response>(path: string, data: unknown, config?: RequestInit) =>
        httpInstance<Response>(path, 'PUT', data, config),

    delete: <Response>(path: string, config?: RequestInit) => httpInstance<Response>(path, 'DELETE', undefined, config),

    postFromData: async <Response>(path: string, data: FormData, config?: RequestInit) => {
        const fullUrl = `${process.env.NEXT_PUBLIC_API_DOMAIN}${path}`
        const requestOptions: RequestInit = {
            method: 'POST',
            body: data,
            credentials: 'include',
            ...config
        }

        try {
            const res = await fetch(fullUrl, requestOptions)
            const payload = await res.json()
            if (!res.ok) {
                throw new Error('Error in fetching data')
            }
            return {
                payload: payload.data as Response,
                status: res.status
            }
        } catch (error) {
            console.error('HTTP request failed:', error)
            throw error
        }
    }
}

export default http
