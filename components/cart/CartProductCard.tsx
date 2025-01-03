import { DeleteIcon, MinusIcon, PlusIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { CartResponse } from '@/interface/cart.interface'
import { formatCurrency } from '@/lib/utils'

export default function CartProductCard({
    product,
    addToCart,
    removeFromCart,
    deleteFromCart
}: {
    addToCart: (Item: CartResponse) => void
    removeFromCart: (Item: CartResponse) => void
    deleteFromCart: (Item: CartResponse) => void
} & { product: CartResponse }) {
    return (
        <Card className='mb-2 p-1'>
            <CardContent className='grid w-full grid-cols-[auto_1fr] p-0'>
                <Link className='min-w-fit' href={`/product/${product.slug}`}>
                    <Image
                        src={product.image}
                        width={110}
                        height={110}
                        alt={product.name}
                        priority
                        className='rounded-lg'
                    />
                </Link>
                <div className='flex flex-col justify-between gap-2 pl-2 md:pl-4'>
                    <div className='w-full'>
                        <div className='line-clamp-2 text-sm font-medium leading-tight'>{product.name}</div>
                        {product.discountPrice > 0 ? (
                            <div className='flex gap-2 items-center'>
                                <p className='font-medium text-primary'> {formatCurrency(product.discountPrice)}</p>
                                <p className='text-xs text-gray-500 line-through'>
                                    {formatCurrency(product.unitPrice)}
                                </p>
                            </div>
                        ) : (
                            <p className='font-medium text-primary'> {formatCurrency(product.unitPrice)}</p>
                        )}
                        <div className='text-xs text-gray-500 bg-gray-100 inline-block p-1 m-1 rounded'>
                            {product.attributeProduct}
                        </div>
                    </div>
                    <div className='flex flex-row items-center justify-end gap-1'>
                        <div className='flex w-min flex-row gap-1 rounded-lg border p-1'>
                            <Button
                                className='h-5 w-5'
                                variant={'ghost'}
                                size={'icon'}
                                onClick={() => addToCart(product)}
                            >
                                <PlusIcon size={15} />
                            </Button>
                            <span className='min-w-5 px-1 text-center text-sm'>{product.quantity}</span>
                            <Button
                                className='h-5 w-5'
                                variant={'ghost'}
                                size={'icon'}
                                onClick={() => removeFromCart(product)}
                            >
                                <MinusIcon size={15} />
                            </Button>
                        </div>
                        <Button
                            className='h-6 w-6'
                            variant={'destructive'}
                            size={'icon'}
                            onClick={() => deleteFromCart(product)}
                        >
                            <DeleteIcon size={15} />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
