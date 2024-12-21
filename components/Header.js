'use client'
import Link from 'next/link'
import React from 'react'
import { FaBars } from 'react-icons/fa'

const Header = () => {
  return (
    <header className='bg-black text-white flex justify-between align-middle sticky top-0 z-50'>
      <Link href={'/'} className='text-3xl font-bold font-serif pl-3 pt-1'>BLOG...</Link>

      <nav>
        <span><FaBars className='text-2xl m-2' /></span>
      </nav>
    </header>
  )
}

export default Header
