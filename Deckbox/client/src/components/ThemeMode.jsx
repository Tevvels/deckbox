import React,{useState,useEffect} from 'react'

function ThemeMode() {
    const [theme,setTheme] = useState("light");

    useEffect(()=> {
        document.documentElement.setAttribute("data-theme",theme);

    },[theme]);
    function toggleTheme(){
        setTheme(theme ==="light"?"dark":"light");
    }

    
  return (
    <>
        <button onClick={toggleTheme}
        className="themeButton"
        >
            <i className="icon-wrapper">{theme ==="light"?"🌙" : "☀️"}</i>
        </button>
    </>
  )
}

export default ThemeMode;