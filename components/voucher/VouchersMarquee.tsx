'use client'
import { Voucher } from '@/interface/voucher.interface'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel'
import VoucherCard from './VoucherCard'

export default function VouchersMarquee({ vouchers }: { vouchers: Voucher[] }) {
    return (
        <Carousel
            opts={{
                dragFree: true
            }}
        >
            <CarouselContent className='-ml-2 px-2'>
                {vouchers.map((voucher: Voucher) => (
                    <CarouselItem className='basis-1/2 pl-2 py-1 sm:basis-1/3 md:basis-1/4 md:pl-4' key={voucher.id}>
                        <VoucherCard voucher={voucher} />
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className='left-0' />
            <CarouselNext className='right-0' />
        </Carousel>
    )
}
