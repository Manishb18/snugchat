import React from 'react';
import { 
  BsChatLeftText, 
  BsArrowClockwise, 
  BsPencil, 
  BsList, 
  BsGrid, 
  BsGear,
  BsPeople,
  BsAt,
  BsCardImage
} from 'react-icons/bs';

export default function MainChatSidebar() {
  const iconSize = 16;
  
  return (
    <div className='flex flex-col items-center h-full p-2 gap-6 border-l border-gray-400/25 shadow-lg text-gray-400'>
      <div className='flex flex-col  gap-3'>
        <button className='p-2 hover:bg-gray-200 rounded-md'>
          <BsChatLeftText size={iconSize} />
        </button>
        
        <button className='p-2 hover:bg-gray-200 rounded-md'>
          <BsArrowClockwise size={iconSize} />
        </button>
        
        <button className='p-2 hover:bg-gray-200 rounded-md'>
          <BsPencil size={iconSize} />
        </button>
        
        <button className='p-2 hover:bg-gray-200 rounded-md'>
          <BsList size={iconSize} />
        </button>
        
        <button className='p-2 hover:bg-gray-200 rounded-md'>
          <BsGrid size={iconSize} />
        </button>
        
        <button className='p-2 hover:bg-gray-200 rounded-md'>
          <BsGear size={iconSize} />
        </button>
        
        <button className='p-2 hover:bg-gray-200 rounded-md'>
          <BsPeople size={iconSize} />
        </button>
        
        <button className='p-2 hover:bg-gray-200 rounded-md'>
          <BsAt size={iconSize} />
        </button>
        
        <button className='p-2 hover:bg-gray-200 rounded-md'>
          <BsCardImage size={iconSize} />
        </button>
      </div>
    </div>
  );
}