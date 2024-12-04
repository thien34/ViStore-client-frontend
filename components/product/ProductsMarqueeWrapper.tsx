import ProductsMarquee from './ProductsMarquee'
import productService from '@/service/product.service'

export default async function ProductsMarqueeWrapper() {
    const { payload: products } = await productService.getRootProducts()
    const defaultImage = '/default/default2.png'
    const productsWithDefaultImages = products.map((product) => ({
        ...product,
        image: product.image || defaultImage
    }))
    return (
        <section className='py-4 md:py-10'>
            <h2 className='p-2 pt-0 text-lg font-medium md:p-4 md:pt-0 md:text-xl'>
                Sản phẩm phổ biến nhất của chúng tôi
            </h2>
            <ProductsMarquee products={productsWithDefaultImages} />
        </section>
    )
}
