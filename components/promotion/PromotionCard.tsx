'use client'
import { Promotion } from '@/interface/discount.interface'
import { useCountdown } from '@/hooks/useCountdown'
import { Card, CardContent } from '../ui/card'
import { Tag, Gift, Clock, Percent } from 'lucide-react'

const gradients = [
    'from-violet-600 to-indigo-600',
    'from-pink-500 to-rose-500',
    'from-amber-500 to-orange-600',
    'from-emerald-500 to-teal-600',
    'from-blue-500 to-cyan-500'
]

const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className='flex flex-col items-center bg-white/20 rounded-md px-2 py-1 min-w-[50px]'>
        <span className='text-lg font-bold'>{value.toString().padStart(2, '0')}</span>
        <span className='text-xs'>{label}</span>
    </div>
)

export default function PromotionCard({ promotion }: { promotion: Promotion }) {
    const now = new Date()
    const startDate = new Date(promotion.startDateUtc)
    const endDate = new Date(promotion.endDateUtc)
    const targetDate = now < startDate ? startDate : endDate
    const timeLeft = useCountdown(targetDate)

    const isStarting = now < startDate
    const isExpired = now > endDate

    // Select gradient based on promotion ID
    const gradientIndex = promotion.id % gradients.length
    const gradient = gradients[gradientIndex]

    return (
        <Card className='h-[160px] w-full overflow-hidden hover:shadow-lg transition-shadow'>
            <CardContent className='relative h-full p-0'>
                <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-90`} />
                <div className='absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 bg-white/10 rounded-full' />
                <div className='absolute bottom-0 left-0 w-24 h-24 -ml-12 -mb-12 bg-white/10 rounded-full' />

                <div className='relative flex items-center justify-between h-full px-6 py-4'>
                    <div className='text-white space-y-3 flex-1'>
                        <div className='flex items-center gap-2'>
                            <Tag className='w-5 h-5' />
                            <h3 className='text-2xl font-bold tracking-tight'>{promotion.name}</h3>
                        </div>

                        <div className='flex items-center gap-6'>
                            <div className='flex items-center gap-2'>
                                <Percent className='w-5 h-5 text-white/90' />
                                <p className='text-lg text-white/90'>Giảm {promotion.discountPercentage}%</p>
                            </div>

                            <div className='flex items-center gap-2'>
                                <Gift className='w-5 h-5 text-white/90' />
                                <p className='text-sm text-white/90'>Cùng nhiều quà tặng bất ngờ chờ đón bạn</p>
                            </div>
                        </div>
                    </div>

                    <div className='text-white'>
                        <div className='flex items-center gap-2 mb-2'>
                            <Clock className='w-4 h-4' />
                            <p className='text-sm font-medium'>
                                {isExpired ? 'Đã kết thúc' : isStarting ? 'Bắt đầu sau:' : 'Kết thúc sau:'}
                            </p>
                        </div>
                        {!isExpired && (
                            <div className='flex gap-2'>
                                {timeLeft.days > 0 && <TimeUnit value={timeLeft.days} label='Ngày' />}
                                <TimeUnit value={timeLeft.hours} label='Giờ' />
                                <TimeUnit value={timeLeft.minutes} label='Phút' />
                                <TimeUnit value={timeLeft.seconds} label='Giây' />
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
