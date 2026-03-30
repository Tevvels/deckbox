import React from 'react';
import { useDraggable } from '@dnd-kit/core'; // Change this
import { CSS } from '@dnd-kit/utilities';
function Drag(props) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: 'draggable-1',
    });

    // Optional: add the transform style so it actually moves
    const style = transform ? {
        transform: CSS.Translate.toString(transform)
    } : undefined;

    return (
        <button 
            ref={setNodeRef} 
            style={style}
            {...listeners} 
            {...attributes} 
            className='btn'
        >
            draggable
        </button>
    );
}

export default Drag;