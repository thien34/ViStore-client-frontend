import Billboard from '@/components/Billboard'
import CategoryCardSection from '@/components/category/CategoryCardSection'
import ProductMarquee from '@/components/product/ProductsMarqueeWrapper'
import PromotionCarouselWrapper from '@/components/promotion/PromotionCarouselWrapper'
import VouchersMarquee from '@/components/voucher/VouchersMarqueeWrapper'

export default function Home() {
    return (
        <main className='px-2'>
            <Billboard />
            <PromotionCarouselWrapper />
            <VouchersMarquee />
            <ProductMarquee />
            <CategoryCardSection />
        </main>
    )
}
