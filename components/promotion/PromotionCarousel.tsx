'use client'
import { Promotion } from '@/interface/discount.interface'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import PromotionCard from './PromotionCard'
import Autoplay from 'embla-carousel-autoplay'

export default function PromotionCarousel({ promotions }: { promotions: Promotion[] }) {
    return (
        <div className='w-full '>
            <Carousel
                opts={{
                    loop: true,
                    align: 'center',
                    skipSnaps: false,
                    duration: 20
                }}
                plugins={[
                    Autoplay({
                        delay: 5000,
                        stopOnInteraction: false,
                        stopOnMouseEnter: true
                    })
                ]}
            >
                <CarouselContent>
                    {promotions.map((promotion) => (
                        <CarouselItem key={promotion.id}>
                            <div className='px-1'>
                                <PromotionCard promotion={promotion} />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </div>
    )
}
