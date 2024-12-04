import { COMPANY_ADDRESS, COMPANY_NAME, OWNER_EMAIL, OWNER_NAME, OWNER_PHONE_1, OWNER_PHONE_2 } from '@/lib/constants'
import type { Metadata } from 'next'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'

export const metadata: Metadata = {
    title: 'Contact Us'
}

export default function Contact() {
    return (
        <section className='px-2 py-4'>
            <h2 className='p-4 text-3xl font-medium'>Liên hệ với chúng tôi</h2>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell>Tên công ty:</TableCell>
                        <TableCell>{COMPANY_NAME}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Owner Name:</TableCell>
                        <TableCell>{OWNER_NAME}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Địa chỉ:</TableCell>
                        <TableCell>{COMPANY_ADDRESS}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Số điện thoại:</TableCell>
                        <TableCell>
                            {OWNER_PHONE_1}, {OWNER_PHONE_2}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Email:</TableCell>
                        <TableCell>{OWNER_EMAIL}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </section>
    )
}
