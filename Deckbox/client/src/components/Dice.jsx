import React, {  useState,useRef } from 'react'
import { Link } from 'react-router-dom';
const rollingDie = (sides) =>{
    console.log(`rolled a ${sides} -sided die and got ${Math.floor(Math.random()*sides)+1}`)
}

function Dice() {
    const [groupOfDice,setGroupOfDice] = useState([]);
    const [dieResults,setDieResults] = useState([]);
    const [total, setTotal] = useState(0);



    const diceFaceValues = [4, 6, 8, 10, 12, 20, 100];
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
};
const resetDice = () => {
    setGroupOfDice([]);
    setDieResults([]);
    setTotal(0);
};


  return (
      <div className='dice dice_container'>

    <div className='dice_buttons'>
    {diceFaceValues.map((sides,index) => (
        <button key={index} className='dice_button buttons' onClick={() => addDie(sides)}>Add D{sides}</button>
    ))}

    <button className=' buttons dice_button dice_button-roll' onClick={rollDice}> roll the dice </button>
    <button className='buttons dice_button dice_button-reset' onClick={resetDice}>Reset Dice</button>
    <span className='dice_span dice_span-number' >number of dice {groupOfDice.length}</span>
    <span className="dice_span dice_span-total">{total}</span>
    {dieResults.map((result,index) => (
        <span className='dice_span dice_span-die' key={index}> Die {index + 1}: {result} </span>
    ))}

    <Link className='links dice_link' to ="/dashboard"> Back to Dashboard </Link>

    </div>
    </div>
  )
}

export default Dice