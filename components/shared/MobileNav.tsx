"use client"
import React from 'react'
import Link from "next/link";
import Image from "next/image";
import {SignedIn, UserButton} from "@clerk/nextjs";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {navLinks} from "@/constants";
import {usePathname} from "next/navigation";

const MobileNav = () => {
    const pathname = usePathname()
    return (
        <header className={'header'}>

            <Link href={'/'} className={'flex items-center gap-2 md:py-2'}>
                <Image src={'/assets/images/logo-text.svg'} alt={'logo'}
                       width={180}
                       height={28}/>
            </Link>

            <nav className={'flex gap-2'}>
                <SignedIn>
                    <UserButton afterSignOutUrl={'/'} />

                    <Sheet>
                        <SheetTrigger>
                            <Image src={'/assets//icons/menu.svg'} alt={'menu'}
                            width={32}
                            height={32} className={''}/>
                        </SheetTrigger>
                        <SheetContent className={'sheet-content sm:w-64'}>
                            <SheetTitle></SheetTitle>
                          <>
                          <Image src={'/assets/images/logo-text.svg'} alt={'logo'}
                                 width={152}
                                 height={28}/>
                          </>

                            <ul className={'header-nav_elements'}>
                                {navLinks.map((link, i) => {
                                    const isActive = link.route===pathname;
                                    return (
                                        <li key={link.route} className={`text-dark-700 whitespace-nowrap  flex ${isActive && 'gradient-text'}`}>
                                            <Link href={link.route} className={'sidebar-link'}>
                                                <Image src={link.icon} alt={link.label}
                                                       width={24}
                                                       height={24}/>
                                                <span className={`${isActive && 'brightness-200'}`}>
                                                {link.label}
                                            </span>
                                            </Link>
                                        </li>
                                    )
                                })}

                                <li className={'flex-center cursor-pointer gap-2 p-4'}>
                                    <UserButton afterSignOutUrl={'/'} showName/>
                                </li>

                            </ul>
                        </SheetContent>
                    </Sheet>


                </SignedIn>
            </nav>
        </header>
    )
}
export default MobileNav
