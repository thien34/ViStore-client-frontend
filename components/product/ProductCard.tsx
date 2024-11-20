import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Product } from '@/interface/product.interface'

export default function ProductCard({ product }: { product: Product }) {
    return (
        <Link href={`/product/${product.slug}`}>
            <Card className='flex h-full w-fit flex-col justify-around'>
                <CardHeader className='flex items-center justify-center p-1'>
                    <Image
                        src={product.image}
                        width={220}
                        height={220}
                        alt={product.name}
                        loading='lazy'
                        className='rounded-md object-cover'
                    />
                </CardHeader>
                <CardContent className='p-2 pt-0'>
                    <CardTitle className='line-clamp-2 max-w-[200px] text-sm font-medium leading-tight sm:text-base'>
                        {product.name}
                    </CardTitle>
                    <CardDescription className='text-sm'>{product.categoryName}</CardDescription>
                </CardContent>
                <CardFooter className='w-full p-2 pt-0 justify-between'>
                    {product.discountPrice > 0 ? (
                        <div className='flex'>
                            <p className='font-medium text-primary'>&#36; {product.discountPrice}</p>
                            <p className='text-xs ml-1 bg-red-200 text-red-600 p-[3px] rounded-sm'>
                                -{Math.round(((product.unitPrice - product.discountPrice) / product.unitPrice) * 100)}%
                            </p>
                        </div>
                    ) : (
                        <p className='font-medium text-primary'>&#36; {product.unitPrice}</p>
                    )}
                    <div className='text-xs text-gray-500'>Sold: {product.sold}</div>
                </CardFooter>
            </Card>
        </Link>
    )
}
