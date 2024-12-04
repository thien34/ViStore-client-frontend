import ProductCard from '@/components/product/ProductCard'
import { Product } from '@/interface/product.interface'
import productService from '@/service/product.service'

type Props = {
    params: { categorySlug: string }
}

export default async function CategoryPage({ params }: Props) {
    const { payload: products } = await productService.getProductsByCategory(params.categorySlug)

    return (
        <section className='px-2 py-4'>
            {products && products.length > 0 ? (
                <section className='flex flex-col items-center justify-center'>
                    {/* todo: lay dung ten slug category */}
                    <h2 className='my-4 p-4 text-3xl font-medium'>{products[0].categoryName}</h2>
                    <div className='grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5'>
                        {products.map((product: Product, index: number) => (
                            <ProductCard key={index} product={product} />
                        ))}
                    </div>
                </section>
            ) : (
                <p className='p-4 text-2xl'>Xin lỗi không tìm thấy sản phẩm: {params.categorySlug}</p>
            )}
        </section>
    )
}
