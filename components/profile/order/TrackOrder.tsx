import { Folder, Tree } from '@/components/ui/file-tree'
import { CircleDot } from 'lucide-react'
import { cn, formatDateTime } from '@/lib/utils'
import { listStatus } from './StatusOrder'
import { OrderStatusHistoryResponse } from '@/interface/order.interface'

type PackageOpenProps = {
    tracks: OrderStatusHistoryResponse[]
}

const TrackOrder = ({ tracks }: PackageOpenProps) => {
    const initialExpandedItems = tracks.map(({ id }) => String(id))
    return (
        <div className='relative flex flex-col items-center justify-center bg-background'>
            <Tree initialExpandedItems={initialExpandedItems} className='rounded-md bg-background'>
                {tracks.map((track) => {
                    const status = listStatus.find((status) => status.id === track.status)
                    return (
                        <Folder
                            className={cn('gap-3 font-semibold')}
                            IconClose={<CircleDot className='size-4' style={{ color: status?.color }} />}
                            IconOpen={<CircleDot className='size-4' style={{ color: status?.color }} />}
                            indicatorClassName={'ml-0.5 mt-0.5'}
                            key={track.id}
                            element={status?.name || 'Không x định'}
                            value={String(track.id)}
                        >
                            <div className='ml-3 flex flex-col items-start space-y-1 py-3'>
                                <p>{track.notes}</p>
                                <p className='text-gray-500'>{formatDateTime(track.paidDate)}</p>
                            </div>
                        </Folder>
                    )
                })}
            </Tree>
        </div>
    )
}

export default TrackOrder
