import { Category } from '@/interface/category.interface'
import http from '@/lib/http'

class CategoryService {
    private basePath = '/api/client/categories'

    async getRootCategories() {
        const response = await http.get<Category[]>(this.basePath)
        return response
    }
}

const categoryService = new CategoryService()
export default categoryService
