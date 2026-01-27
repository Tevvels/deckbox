import React, { useState } from 'react'
import axios from 'axios'

// Vite exposes env vars on import.meta.env. Use VITE_API_BASE for the frontend.
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

function DeckboxData({onAdd}) {
  const [deckBoxItem,setDeckBoxItem]= useState('');
  const addItem = async()=>{
        try {
                const payload = { task: deckBoxItem, completed: false };
        const response = await axios.post(`${API_BASE}/cardStorage`, payload);
            onAdd(response.data);
            setDeckBoxItem('');
        } catch(error){
                console.error("error creating card", error)
        }
    }
  return (
    <div>DeckboxData

        <input type="text" value ={deckBoxItem} onChange={(e)=>setDeckBoxItem(e.target.value)} />
            <button onClick={addItem}>add Item</button>


    </div>


  )
}

export default DeckboxData