import ProductDetailCard from '@/components/product/ProductDetailCard'
import ProductDetailInfo from '@/components/product/ProductDetailInfo'
import ProductsMarqueeWrapper from '@/components/product/ProductsMarqueeWrapper'
import { SITE_NAME, SITE_URL } from '@/lib/constants'
import productService from '@/service/product.service'

export const dynamicParams = false

type Props = {
    params: { productSlug: string }
}

const ProductPage = async ({ params }: Props) => {
    const { payload: product } = await productService.getProducDetailtBySlug(params.productSlug)

    const jsonLd = {
        '@context': SITE_URL,
        '@type': 'Product',
        name: product.name,
        image: product.images[0],
        description: product.fullDescription,
        brand: {
            '@type': 'Brand',
            name: SITE_NAME
        }
    }

    return (
        <div className='px-2'>
            <ProductDetailCard product={product} />
            <ProductsMarqueeWrapper />
            <ProductDetailInfo product={product} />
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        </div>
    )
}

export default ProductPage
