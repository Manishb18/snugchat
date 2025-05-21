"use client"
import React from 'react'
import Header from './_mainChat/Header'
import MessagesSection from './_mainChat/MessagesSection'
import InputSection from './_mainChat/InputSection'
import { useChat } from '@/context/ChatContext'
export default function MainChat() {
  const { selectedUser } = useChat();
  if(!selectedUser){
    return <div className='flex-1 flex flex-col items-center justify-center text-5xl font-semibold'>
    No user selected
  </div>
  }
  return (
    <div className='flex-1 flex flex-col h-full'>
      <Header selectedUser={selectedUser}/>
      <MessagesSection/>
      <InputSection/>
    </div>
  )
}
