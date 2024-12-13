import VouchersMarquee from './VouchersMarquee'
import voucherService from '@/service/voucher.service'

export default async function VouchersMarqueeWrapper() {
    const { payload: vouchers } = await voucherService.getAllIsPublished()
    return (
        <section className='py-4 md:py-10'>
            <h2 className='p-2 pt-0 text-lg font-medium md:p-4 md:pt-0 md:text-xl'>Voucher khuyến mãi</h2>
            <VouchersMarquee vouchers={vouchers} />
        </section>
    )
}
