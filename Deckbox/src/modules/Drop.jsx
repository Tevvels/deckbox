import { useDroppable } from '@dnd-kit/core';
import React,{useState} from 'react'

function Drop({id,children}) {
    const [isDropped, setIsDropped] = useState(false);
    const {setNodeRef,isOver} = useDroppable({id});
    const style={
        border: isOver ? '2px solid green': '2px dashed gray',
        padding: '20px',
        minHeight: '100px',
        backgroundColor: isOver ? '#f0fff0' : 'transparent',
    };
  return (
    <div ref={setNodeRef}
        style={style}
    >
        {isOver ? 'drop here' : 'waiting for a draggble item'}
        {children}
        </div>
  )
}

export default Drop