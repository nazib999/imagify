"use client"
import React from 'react'
import Link from "next/link";
import Image from "next/image";
import {SignedIn, SignedOut, UserButton} from "@clerk/nextjs";
import {navLinks} from "@/constants";
import {usePathname} from "next/navigation";
import {Button} from "@/components/ui/button";


const Sidebar = () => {
    const pathname = usePathname();
    return (
        <aside className={'sidebar'}>
            <div className={'flex flex-col size-full gap-4'}>
                <Link href={'/'}>
                    <Image src={'/assets/images/logo-text.svg'} alt={'logo'}
                           width={180}
                           height={28}/>
                </Link>

                <nav className={'sidebar-nav'}>
                    <SignedIn>
                        <ul className={'sidebar-nav_elements'}>
                            {navLinks.map((link, i) => {
                                const isActive = link.route===pathname;
                                return (
                                    <li key={link.route} className={`sidebar-nav_element group ${isActive ? 'bg-purple-gradient text-white':'text-gray-700'}`}>
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
                    </SignedIn>

                    <SignedOut>
                        <Button asChild className={'button bg-purple-gradient bg-cover'}>
                            <Link href={'/sign-in'}>Login</Link>
                        </Button>
                    </SignedOut>
                </nav>
            </div>
        </aside>
    )
}
export default Sidebar
