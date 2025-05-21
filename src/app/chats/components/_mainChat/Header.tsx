import Image from 'next/image'
import React from 'react'
import { HiSparkles } from "react-icons/hi";
import { FiSearch } from "react-icons/fi";
import { User } from '@/utils/types';
export default function Header({selectedUser} : {selectedUser : User}) {
  return (
    <header className='w-full py-2 px-6 flex justify-between items-center border-b border-gray-400/25 shadow-xl'>
         <section className='flex items-center gap-4'>
            <Image src={"/avatar.png"} alt='avatar' width={32} height={32}/>
            <div className='flex flex-col justify-between'>
                <h1 className='font-bold'>
                    {selectedUser.name}
                </h1>

                <p className='text-xs text-green-base'>Online</p>
            </div>
         </section>

         <section className='flex items-center gap-4 text-gray-500'>
            <HiSparkles size={20}/>
            <FiSearch size={20}/>
         </section>
    </header>
  )
}
