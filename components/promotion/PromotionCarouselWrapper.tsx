import PromotionCarousel from './PromotionCarousel'
import discountService from '@/service/discount.service'

export default async function PromotionCarouselWrapper() {
    const { payload: promotions } = await discountService.getAll()
    return (
        <>
            <h2 className='p-2 pt-0 text-lg font-medium md:p-4 md:pt-0 md:text-xl'>Đợt giảm giá - Không lo về giá</h2>
            <PromotionCarousel promotions={promotions} />
        </>
    )
}
