import { Voucher } from '@/interface/voucher.interface'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import { useCountdown } from '@/hooks/useCountdown'
import { toast } from '@/components/ui/use-toast'

export default function VoucherCard({ voucher }: { voucher: Voucher }) {
    const now = new Date()
    const startDate = new Date(voucher.startDateUtc)
    const endDate = new Date(voucher.endDateUtc)
    const targetDate = now < startDate ? startDate : endDate
    const timeLeft = useCountdown(targetDate)

    const formatCountdown = () => {
        if (now < startDate) {
            return `Bắt đầu sau: ${timeLeft.days} ngày ${timeLeft.hours}h ${timeLeft.minutes}p`
        }
        if (now < endDate) {
            return `Còn lại: ${timeLeft.days} ngày ${timeLeft.hours}h ${timeLeft.minutes}p`
        }
        return 'Đã hết hạn'
    }

    const handleCopyCode = () => {
        navigator.clipboard.writeText(voucher.couponCode)
        toast({
            title: 'Đã sao chép mã giảm giá',
            description: `Mã ${voucher.couponCode} đã được sao chép vào clipboard`,
            duration: 2000
        })
    }

    return (
        <Card className='relative flex h-full w-full flex-col justify-between bg-white shadow-md hover:shadow-lg transition-shadow'>
            <div className='absolute -right-1 -top-1 z-10'>
                <div className='bg-red-500 text-white px-3 py-1 text-sm font-medium rounded-tl-md rounded-br-md'>
                    {voucher.usePercentage ? `${voucher.discountPercentage}%` : formatCurrency(voucher.discountAmount!)}
                </div>
            </div>
            <CardHeader className='p-4'>
                <div className='space-y-1'>
                    <h3 className='font-semibold text-lg'>
                        {voucher.usePercentage
                            ? `Giảm ${voucher.discountPercentage}% đơn hàng`
                            : `Giảm ${formatCurrency(voucher.discountAmount!)}`}
                    </h3>
                    {voucher.maxDiscountAmount && (
                        <p className='text-sm text-gray-600'>Giảm tối đa {formatCurrency(voucher.maxDiscountAmount)}</p>
                    )}
                </div>
            </CardHeader>
            <CardContent className='p-4 pt-0'>
                <div className='space-y-2'>
                    <div className='flex items-center text-sm text-gray-600'>
                        <span className='font-medium'>Đơn tối thiểu:</span>
                        <span className='ml-1'>{formatCurrency(voucher.minOderAmount)}</span>
                    </div>
                    <div className='text-sm text-gray-600'>{formatCountdown()}</div>
                </div>
            </CardContent>
            <CardFooter className='p-4 pt-0'>
                <div className='w-full'>
                    <div
                        className='bg-gray-100 p-2 text-center rounded-md border border-dashed border-gray-300 cursor-pointer hover:bg-gray-200 transition-colors'
                        onClick={handleCopyCode}
                    >
                        <span className='font-mono font-semibold text-gray-800'>{voucher.couponCode}</span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}
