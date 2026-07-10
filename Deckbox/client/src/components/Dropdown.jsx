import React, { useEffect, useRef, useState } from "react";

function Dropdown({ options = [], onSelect, placeholder = "Select an option",classN }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
  };

  // Close dropdown when clicking anywhere else on the page
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`dropdown ${classN || ''}`}  ref={dropdownRef}>
      <div className="dropdown_container">
        <button 
          type="button" 
          onClick={toggleDropdown} 
          className="buttons dropdown_toggle"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          {/* Use .div or .label depending on what you pass from the parent */}
          {selectedOption ? (selectedOption.div || selectedOption.value) : placeholder}
        </button>

        {isOpen && (
          <ul className="list dropdown_list" role="listbox">
            {options.map((option) => (
              <li
                key={option.value}
                className="listItem dropdown_list-item"
                onClick={() => handleOptionSelect(option)}
                role="option"
                aria-selected={selectedOption?.value === option.value}
              >
                {option.div || option.value}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dropdown;
