import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { CartResponse } from '@/interface/cart.interface'

interface CartSummaryProps {
    selectedItems: number[]
    items: CartResponse[]
    onCheckout: () => void
    onSelectAll: (checked: boolean) => void
}

export default function CartSummary({ selectedItems, items, onCheckout, onSelectAll }: CartSummaryProps) {
    const selectedProducts = items.filter((item) => selectedItems.includes(item.id))
    const totalPrice = selectedProducts.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
    const totalItems = selectedProducts.reduce((sum, item) => sum + item.quantity, 0)

    return (
        <div className='bg-white p-4 rounded-lg sticky bottom-0 border-t md:border-none shadow-lg md:shadow-none'>
            <div className='flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0'>
                <div className='flex items-center space-x-4'>
                    <Checkbox
                        checked={selectedItems.length === items.length}
                        onCheckedChange={(checked: boolean) => onSelectAll(checked)}
                    />
                    <span>
                        Select All ({selectedItems.length}/{items.length})
                    </span>
                </div>

                <div className='flex-1 md:flex md:justify-end m-2'>
                    <div className='space-y-1 md:text-right'>
                        <div className='text-sm text-gray-500'>Total payment ({totalItems} items):</div>
                        <div className='text-xl text-red-500 font-medium'>${totalPrice.toLocaleString('en-US')}</div>
                    </div>
                </div>

                <Button
                    className='w-full md:w-auto px-8 '
                    size='lg'
                    onClick={onCheckout}
                    disabled={selectedItems.length === 0}
                >
                    Checkout
                </Button>
            </div>
        </div>
    )
}
