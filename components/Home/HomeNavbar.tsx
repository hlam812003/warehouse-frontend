'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'

import { Navbar } from '@/types'

export default function HomeNavbar({ navItems }: { navItems: Navbar[] }) {
  const pathname = usePathname()

  return (
    <nav className="w-full h-16 fixed top-[.5rem] flex items-center justify-between">
      <div className="w-1/3 text-[1.75rem] uppercase font-bold ml-[2rem]">cofee td.</div>
      <div className="w-1/3 flex justify-center">
        <div className="flex items-center gap-5">
          {navItems.map(({ name, href }) => (
            <div key={href} className="relative group">
              <Link
                href={href}
                className={`text-[.95rem] transition-all duration-250 ease-in-out font-light
                  ${pathname === href ? 'text-[#62c5ff]' : 'text-white hover:text-[#62c5ff]'}`}
              >
                {name}
                <span
                  className={`absolute left-0 -bottom-[.08rem] h-[.05rem] bg-[#62c5ff] transition-all duration-250 ease-in-out
                    ${pathname === href ? 'w-full' : 'w-0 group-hover:w-full'}`}
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div className="w-1/3 flex justify-end mr-[1rem]">
        <Link href="/dashboard">
          <button className="relative inline-flex h-[2.5rem] outline-none overflow-hidden rounded-full p-[.08rem] focus:outline-none">
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#35B5FF_0%,#393BB2_50%,#35B5FF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-[.85rem] py-1 text-[.85rem] capitalize font-medium text-white backdrop-blur-3xl">
              dashboard
            </span>
          </button>
        </Link>
      </div>
    </nav>
  )
}