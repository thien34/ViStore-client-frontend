import { Info, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function ShippingSection() {
    return (
        <div className='bg-white p-4 rounded-lg mb-4'>
            <div className='flex items-center justify-between mb-2'>
                <div className='flex items-center space-x-2'>
                    <Info className='w-4 h-4 text-green-500' />
                    <span className='font-medium'>Thông tin vận chuyển</span>
                </div>
                <Button variant='ghost' className='text-sm'>
                    Thay đổi
                    <ChevronDown className='ml-1 w-4 h-4' />
                </Button>
            </div>
            <Alert>
                <AlertDescription className='text-sm text-gray-600'>
                    Tiết kiệm ₫30,000 khi vận chuyển cho các đơn hàng trên ₫250,000
                </AlertDescription>
            </Alert>
        </div>
    )
}
