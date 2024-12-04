import { Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

interface VoucherData {
    id: string
    code: string
    discount: number
    minSpend: number
}

export default function VoucherSection() {
    const vouchers: VoucherData[] = [
        {
            id: '1',
            code: 'SHOP15K',
            discount: 15000,
            minSpend: 50000
        }
    ]

    return (
        <Accordion type='single' collapsible className='mb-4'>
            <AccordionItem value='vouchers'>
                <AccordionTrigger className='hover:no-underline'>
                    <div className='flex items-center space-x-2 text-orange-500'>
                        <Tag className='w-4 h-4' />
                        <span>Mã giảm giá</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <div className='space-y-2 p-2'>
                        {vouchers.map((voucher) => (
                            <div
                                key={voucher.id}
                                className='flex items-center justify-between p-2 border rounded-lg cursor-pointer hover:bg-gray-50'
                            >
                                <div>
                                    <div className='font-medium'>
                                        Giảm giá ${voucher.discount.toLocaleString('vi-VN')}
                                    </div>
                                    <div className='text-sm text-gray-500'>
                                        Chi tiêu tối thiểu ₫{voucher.minSpend.toLocaleString('vi-VN')}
                                    </div>
                                </div>
                                <Button variant='outline' size='sm'>
                                    Áp dụng
                                </Button>
                            </div>
                        ))}
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}
