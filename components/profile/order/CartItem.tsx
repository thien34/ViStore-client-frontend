'use client'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import Image from 'next/image'
import { useId } from 'react'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { CheckedState } from '@radix-ui/react-checkbox'
import { formatCurrency } from '@/lib/utils'
import { Product } from '../OrderItem'

type CartItemProps = {
    product: Product
    isSelect?: boolean
    checked?: boolean
    isOrder?: boolean
    onCheck?: (checked: CheckedState) => void
}

const CartItem = ({ product, isSelect, checked, onCheck, isOrder }: CartItemProps) => {
    const id = useId()
    return (
        <div className='border-b last:border-b-0 pb-4 flex gap-4'>
            <div className='flex items-start gap-x-2'>
                {isSelect && <Checkbox id={id} onCheckedChange={onCheck} checked={checked} />}
                <Label htmlFor={id}>
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={100}
                        height={100}
                        className='size-20 object-cover border rounded-xl'
                    />
                </Label>
            </div>
            <div className='text-sm flex-1 space-y-1.5'>
                <div className='flex items-center justify-between'>
                    <h4 className='line-clamp-1'>{product.name}</h4>
                    {!isOrder && (
                        <Button variant='ghost' className='text-red-500 p-1 hover:text-red-500'>
                            <Trash />
                        </Button>
                    )}
                </div>
                <p className='text-muted-foreground'>
                    {product.attributes.map((variant) => `${variant.name}: ${variant.value}`).join(', ')}
                </p>
                <div className='flex items-start justify-between'>
                    <p className='flex items-center gap-x-3'>
                        <div className='text-primary font-medium'>
                            {formatCurrency(product.discountPrice ?? product.unitPrice)}
                        </div>
                        <div className='line-through text-gray-500'>{formatCurrency(product.unitPrice)}</div>
                    </p>
                    <div className=''>
                        <p>
                            Số lượng: <span className='font-medium'>{product.quantity}</span>
                        </p>
                        <p>
                            Tổng:{' '}
                            <span className='font-medium'>
                                {formatCurrency((product.discountPrice ?? product.unitPrice) * product.quantity)}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartItem
