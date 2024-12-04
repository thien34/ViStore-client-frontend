import Link from 'next/link'

export const runtime = 'edge'

export default function NotFound() {
    return (
        <div className='flex h-[60vh] flex-col items-center justify-center text-center'>
            <h2 className='mb-4 text-2xl font-bold'>Không tìm thấy trang</h2>
            <Link className='underline' href='/'>
                Về trang chủ
            </Link>
        </div>
    )
}
