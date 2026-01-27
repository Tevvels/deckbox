import React, { useEffect, useRef, useState } from 'react'

function Dropdown({options, onSelect}) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const dropdownref = useRef(null);
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    }
    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        onSelect(option);
        setIsOpen(false);
    }
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownref.current && !dropdownref.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownref]);
    
  return (
    <div>
        <div ref={dropdownref} className="dropdown">
            <button onClick={toggleDropdown} className="dropdown-toggle">
                {selectedOption ? selectedOption.label : 'Select an option'}
            </button>
            {isOpen && (
                <ul className="dropdown-menu">
                    {options.map((option) => (
                        <li key={option.value} onClick={() => handleOptionSelect(option)}>
                            {option.label}
                        </li>   
                    ))}
                </ul>
            )}
        </div>
    </div>
  )
}

export default Dropdown