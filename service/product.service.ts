import { Product, ProductDetail } from '@/interface/product.interface'
import http from '@/lib/http'

class ProductService {
    private basePath = '/api/client/products'

    async getRootProducts() {
        const response = await http.get<Product[]>(this.basePath)
        return response
    }

    async getProductsByCategory(categorySlug: string) {
        const response = await http.get<Product[]>(`${this.basePath}/${categorySlug}`)
        return response
    }

    async getProducDetailtBySlug(productSlug: string) {
        const response = await http.get<ProductDetail>(`${this.basePath}/product/${productSlug}`)
        return response
    }
}

const productService = new ProductService()
export default productService
