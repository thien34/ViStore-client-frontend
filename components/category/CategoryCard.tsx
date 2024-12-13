'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '../ui/button'

interface CategoryCardProps {
    title: string
    description: string
    image: string
    link: string
    className?: string
}

export default function CategoryCard({ title, description, image, link, className }: CategoryCardProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const maxLength = 90
    const shouldShowButton = description.length > maxLength

    const truncatedDescription = isExpanded
        ? description
        : description.slice(0, maxLength) + (shouldShowButton ? '...' : '')

    const handleShowMore = (e: React.MouseEvent) => {
        e.preventDefault()
        setIsExpanded(!isExpanded)
    }

    return (
        <Link href={link}>
            <Card className={cn('group hover:shadow-lg transition-all duration-300 overflow-hidden', className)}>
                <div className='flex h-full flex-col sm:flex-row'>
                    <CardContent
                        className={cn(
                            'flex w-full sm:w-2/5 items-center justify-center p-4 transition-all duration-300',
                            isExpanded && 'hidden sm:h-0 sm:opacity-0 sm:p-0'
                        )}
                    >
                        <Image
                            loading='lazy'
                            alt='Cotton Bag'
                            className='mx-auto rounded-lg object-cover transform group-hover:scale-105 transition-transform duration-300'
                            height={300}
                            width={300}
                            src={image}
                        />
                    </CardContent>
                    <div
                        className={cn(
                            'flex flex-col w-full transition-all duration-300',
                            isExpanded ? 'sm:w-full' : 'sm:w-3/5'
                        )}
                    >
                        <CardHeader className='p-4'>
                            <CardTitle className='text-xl font-semibold mb-2 group-hover:text-primary transition-colors'>
                                {title}
                            </CardTitle>
                            <div className='space-y-2'>
                                <CardDescription className='text-pretty text-sm md:text-base leading-relaxed transition-all duration-300'>
                                    {truncatedDescription}
                                </CardDescription>
                                {shouldShowButton && (
                                    <Button
                                        variant='link'
                                        className='p-0 h-auto text-sm text-primary hover:text-primary/80'
                                        onClick={handleShowMore}
                                    >
                                        {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                    </div>
                </div>
            </Card>
        </Link>
    )
}
