import Image from 'next/image'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { CartResponse } from '@/interface/cart.interface'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

interface CartItemProps {
    item: CartResponse
    isSelected: boolean
    onSelect: (id: number) => void
    onUpdateQuantity: (id: number, quantity: number) => void
    onRemove: (id: number) => void
}

export default function CartItem({ item, isSelected, onSelect, onUpdateQuantity, onRemove }: CartItemProps) {
    return (
        <div className='p-4 bg-white rounded-lg'>
            <div className='flex items-start space-x-4'>
                <Checkbox checked={isSelected} onCheckedChange={() => onSelect(item.id)} className='mt-2' />

                <div className='w-24 h-24 relative flex-shrink-0 rounded-lg overflow-hidden'>
                    <Link href={`/product/${item.slug}`}>
                        <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes='(max-width: 96px) 100vw, 96px'
                            className='object-cover'
                            priority
                        />
                    </Link>
                </div>

                <div className='flex-1 space-y-2'>
                    <div className='flex items-start justify-between'>
                        <div className='space-y-1 flex-1'>
                            <h3 className='font-medium line-clamp-2 '>{item.name}</h3>
                            <div className='flex items-center space-x-2 text-sm text-gray-500'>
                                <span>{item.attributeProduct}</span>
                            </div>
                        </div>
                        <Button
                            variant='ghost'
                            size='icon'
                            className='text-gray-400 hover:text-red-500'
                            onClick={() => onRemove(item.id)}
                        >
                            <Trash2 className='w-4 h-4' />
                        </Button>
                    </div>

                    <div className='flex items-center justify-between'>
                        <div className='text-red-500 font-medium'>
                            {item.discountPrice > 0 ? (
                                <div className='flex gap-2 items-center'>
                                    <p className='font-medium text-primary'> {formatCurrency(item.discountPrice)}</p>
                                    <p className='text-xs text-gray-500 line-through'>
                                        {formatCurrency(item.unitPrice)}
                                    </p>
                                </div>
                            ) : (
                                <p className='font-medium text-primary'> {formatCurrency(item.unitPrice)}</p>
                            )}
                        </div>
                        <div className='space-y-1'>
                            <div className='text-xs text-right text-gray-500 '>Có sẵn: {item.quantityProduct}</div>
                            <div className='flex items-center space-x-2'>
                                <Button
                                    variant='outline'
                                    size='icon'
                                    className='h-8 w-8'
                                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                >
                                    <Minus className='w-3 h-3' />
                                </Button>

                                <Input
                                    type='text'
                                    value={item.quantity}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value)
                                        if (!isNaN(value) && value >= 1) {
                                            onUpdateQuantity(item.id, value)
                                        }
                                    }}
                                    className='w-14 h-8 text-center p-1'
                                    min='1'
                                />

                                <Button
                                    variant='outline'
                                    size='icon'
                                    className='h-8 w-8'
                                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                >
                                    <Plus className='w-3 h-3' />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
