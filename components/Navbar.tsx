'use client'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu'
import { Category } from '@/interface/category.interface'
import Link from 'next/link'

export default function Navbar({ categories }: { categories: Category[] }) {
    return (
        <NavigationMenu className='hidden md:block'>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <Link href='/' passHref legacyBehavior>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>Trang chủ</NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className='grid w-max grid-cols-2 gap-2 p-2'>
                            {categories.map((category: Category, index: number) => (
                                <li key={index}>
                                    <Link href={`/category/${category.slug}`} legacyBehavior passHref>
                                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                            {category.name}
                                        </NavigationMenuLink>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link href='/about' passHref legacyBehavior>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>Về chúng tôi</NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link href='/contact' passHref legacyBehavior>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>Liên hệ với chúng tôi</NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}
