import Billboard from '@/components/Billboard'
import CategoryCardSection from '@/components/category/CategoryCardSection'
import ProductMarquee from '@/components/product/ProductsMarqueeWrapper'
import VouchersMarquee from '@/components/voucher/VouchersMarqueeWrapper'

export default function Home() {
    return (
        <main className='px-2'>
            <Billboard />
            <VouchersMarquee />
            <ProductMarquee />
            <CategoryCardSection />
        </main>
    )
}
