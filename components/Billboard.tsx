'use client'

import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import Banner1 from '../public/banner/banner1.webp'
import Banner2 from '../public/banner/banner2.webp'
import Banner3 from '../public/banner/banner3.webp'
import { AspectRatio } from './ui/aspect-ratio'

export default function Billboard() {
    return (
        <div className='flex-1 py-4'>
            <Carousel
                opts={{
                    loop: true,
                    align: 'start'
                }}
                plugins={[
                    Autoplay({
                        delay: 4000,
                        stopOnInteraction: false,
                        stopOnMouseEnter: true
                    })
                ]}
            >
                <CarouselContent>
                    <CarouselItem>
                        <AspectRatio ratio={2 / 1}>
                            <Image
                                className='w-full rounded-lg'
                                src={Banner1}
                                alt=''
                                priority
                                width={1920}
                                height={960}
                            />
                        </AspectRatio>
                    </CarouselItem>
                    <CarouselItem>
                        <AspectRatio ratio={2 / 1}>
                            <Image
                                className='w-full rounded-lg'
                                src={Banner2}
                                alt='Customize your with your own design and preference.'
                                width={1920}
                                height={960}
                                priority
                            />
                        </AspectRatio>
                    </CarouselItem>
                    <CarouselItem>
                        <AspectRatio ratio={2 / 1}>
                            <Image
                                className='w-full rounded-lg'
                                src={Banner3}
                                alt='Customize your with your own design and preference.'
                                width={1920}
                                height={960}
                                priority
                            />
                        </AspectRatio>
                    </CarouselItem>
                </CarouselContent>
            </Carousel>
        </div>
    )
}
