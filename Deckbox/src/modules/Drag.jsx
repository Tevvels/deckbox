import React from 'react'
import { useDraggable } from '@dnd-kit/react'

function Drag() {
  const {
    
    ref,

  } = useDraggable({
    id: 'draggable',
  });
  
    return (
    <div>
     <button ref={ref}>
        Draggable
        </button>   
    </div>
  )
}

export default Drag