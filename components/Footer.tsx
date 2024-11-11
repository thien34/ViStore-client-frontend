import { MailIcon, PhoneCallIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import whatsapp from '@/public/WhatsAppButtonGreenSmall.svg'
import { COMPANY_ADDRESS, COMPANY_NAME, OWNER_EMAIL, OWNER_PHONE_1, OWNER_PHONE_2, SITE_NAME } from '@/lib/constants'

export default function Footer() {
    return (
        <footer className='pb-10 md:px-5 md:pb-20'>
            <section className='container mx-auto pt-10'>
                <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
                    <div>
                        <h2 className='mb-3 text-lg font-bold'>Quick Links</h2>
                        <ul className='space-y-2'>
                            <li>
                                <Link href='/about' className='text-sm hover:underline'>
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href='/contact' className='text-sm hover:underline'>
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link href='/terms-of-service' className='text-sm hover:underline'>
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link href='/privacy-policy' className='text-sm hover:underline'>
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href='/return-refund-policy' className='text-sm hover:underline'>
                                    Return and Refund Policy
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h2 className='mb-3 text-lg font-bold'>Contact Us</h2>
                        <div className='mb-3 flex gap-2 text-sm hover:underline'>
                            <MailIcon size={16} />
                            <Link href={`mailto:${OWNER_EMAIL}`}>{OWNER_EMAIL}</Link>
                        </div>
                        <div className='mb-3 flex gap-2 text-sm hover:underline'>
                            <PhoneCallIcon size={16} />
                            <Link href={`tel:${OWNER_PHONE_1}`}>{OWNER_PHONE_1}</Link>
                        </div>
                        <div className='mb-3 flex gap-2 text-sm hover:underline'>
                            <PhoneCallIcon size={16} />
                            <Link href={`tel:${OWNER_PHONE_2}`}>{OWNER_PHONE_2}</Link>
                        </div>
                        <div className='mt-2 flex space-x-4'>
                            <Link href='https://www.facebook.com' className='text-sm hover:underline'>
                                Facebook
                            </Link>
                            <Link href='https://www.twitter.com' className='text-sm hover:underline'>
                                Twitter
                            </Link>
                            <Link href='https://www.instagram.com' className='text-sm hover:underline'>
                                Instagram
                            </Link>
                        </div>
                    </div>
                    <div>
                        <h2 className='mb-3 text-xl font-bold'>{COMPANY_NAME}</h2>
                        <a
                            href='https://maps.app.goo.gl/WFUVauqtHEhiTThW9'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-xs hover:underline md:text-sm'
                        >
                            {COMPANY_ADDRESS}
                        </a>
                    </div>
                </div>
            </section>
            <p className='mt-10 text-center text-sm'>
                © {new Date().getFullYear()} {SITE_NAME}
            </p>
        </footer>
    )
}
