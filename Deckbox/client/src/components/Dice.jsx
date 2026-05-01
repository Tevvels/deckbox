import React, {  useState,useRef } from 'react'
import { Link } from 'react-router-dom';
const rollingDie = (sides) =>{
    console.log(`rolled a ${sides} -sided die and got ${Math.floor(Math.random()*sides)+1}`)
}

function Dice() {
    const [groupOfDice,setGroupOfDice] = useState([]);
    const [dieResults,setDieResults] = useState([]);
    const [total, setTotal] = useState(0);

    const addDie = (sides) =>{
 setGroupOfDice(prevDice => [...prevDice,sides]) 
};
    const rollDice = () => {
   const newRollResults = groupOfDice.map(sides => {
    return Math.floor(Math.random()* sides) + 1
   }) 

   const newTotal = newRollResults.reduce((sum,value)=> sum + value, 0)
   setDieResults(newRollResults)
   setTotal(newTotal);
   console.log(total)
   console.log(dieResults)
};
const resetDice = () => {
    setGroupOfDice([]);
    setDieResults([]);
    setTotal(0);
};


  return (
    <div className='dice dice_container'>

    <button className='dice_button dice_button-four' onClick={()=> addDie(4)}> (4 SIDED) </button>
    <button className='dice_button dice_button-six' onClick={()=> addDie(6)}> (6 SIDED) </button>
    <button className='dice_button dice_button-eight' onClick={()=> addDie(8)}> (8 SIDED) </button>
    <button className='dice_button dice_button-ten' onClick={()=> addDie(10)}> (10 SIDED) </button>
    <button className='dice_button dice_button-twelve' onClick={()=> addDie(12)}> (12 SIDED) </button>
    <button className='dice_button dice_button-twenty' onClick={()=> addDie(20)}> (20 SIDED) </button>
    <button className='dice_button dice_button-hundred' onClick={()=> addDie(100)}> (100 SIDED) </button>
    <button className='dice_button dice_button-roll' onClick={rollDice}> roll the dice </button>
    <button className='dice_button dice_button-reset' onClick={resetDice}>Reset Dice</button>
    <span className='dice_span dice_span-number' >number of dice {groupOfDice.length}</span>
    <span className="dice_span dice_span-total">{total}</span>
    {dieResults.map((result,index) => (
        <span className='dice_span dice_span-die' key={index}> Die {index + 1}: {result} </span>
    ))}

    <Link className='links dice_link' to ="/dashboard"> Back to Dashboard </Link>

    </div>
  )
}

export default Dice