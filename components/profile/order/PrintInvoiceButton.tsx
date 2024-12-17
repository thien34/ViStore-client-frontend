'use client'

import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

const PrintInvoiceButton = () => {
    const handlePrint = () => {
        window.print()
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='outline' size='icon' className='focus-visible:ring-0 rounded-full'>
                    <MoreHorizontal className='h-4 w-4' />
                    <span className='sr-only'>More actions</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='border-none rounded-xl'>
                <DropdownMenuItem onClick={handlePrint} className='rounded-xl'>
                    Tải hóa đơn
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default PrintInvoiceButton
