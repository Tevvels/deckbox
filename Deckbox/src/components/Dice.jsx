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
    <div>Dice

    <button onClick={()=> addDie(4)}> (4 SIDED) </button>
    <button onClick={()=> addDie(6)}> (6 SIDED) </button>
    <button onClick={()=> addDie(8)}> (8 SIDED) </button>
    <button onClick={()=> addDie(10)}> (10 SIDED) </button>
    <button onClick={()=> addDie(12)}> (12 SIDED) </button>
    <button onClick={()=> addDie(20)}> (20 SIDED) </button>
    <button onClick={()=> addDie(100)}> (100 SIDED) </button>
    <button onClick={rollDice}> roll the dice </button>
    <button onClick={resetDice}>Reset Dice</button>
    <div>number of dice {groupOfDice.length}</div>
    <div>{total}</div>
    {dieResults.map((result,index) => (
        <div key={index}> Die {index + 1}: {result} </div>
    ))}

    <Link to ="/dashboard"> Back to Dashboard </Link>

    </div>
  )
}

export default Dice