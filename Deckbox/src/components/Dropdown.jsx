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
    console.log(options)
  return (
    <div className="dropdown dropdown_container">
        <div ref={dropdownref} className="dropdown_container-sub">
            <button onClick={toggleDropdown} className="buttons dropdown_toggle">
                {selectedOption ? selectedOption.label : 'Select an option'}
            </button>
            {isOpen && (
                <ul className="list dropdown_list">
                    {options.map((option) => (
                        <li className='listItem dropdown_listItem' key={option.value} onClick={() => handleOptionSelect(option)}>
                            {option.div}
                        </li>   
                    ))}
                </ul>
            )}
        </div>
    </div>
  )
}

export default Dropdown