import React,{useMemo} from 'react'


export function useOracleParser(text) {
    return useMemo(()=>{
        if(!text) return [];

        const regex = /\{([^}]+)\}/g;
        const elements = [];
        let lastIndex = 0;
        let match;
        const symbolOverrides = {
            't':'tap',
            'q':'untap',
            'e':'e',
            'chaos':'chaos',
            'tk':'tk',
            'p':'paw',
            'h':'p',
            'inf':'infinity'
        };

        while (( match = regex.exec(text)) !== null) {
            const matchIndex = match.index;
            const symbolCode = match[1].toLowerCase();

            if ( matchIndex > lastIndex) {
                elements.push(text.substring(lastIndex,matchIndex));
            }
            let fontClass = symbolCode.replace('/','');
            
            if(symbolOverrides[fontClass]){
                fontClass = symbolOverrides[fontClass];
            }

            else if (/^[+-]\d+$/.test(fontClass)|| fontClass ==='0'){
                const isPositive = fontClass.startsWith("+");
                const isNegative = fontClass.startsWith("-");
                const value = fontClass.replace(/[+-]/,'');

                if(isPositive) extraClasses = `ms-loyalty-up ms-loyalty-${value}`;
                else if(isNegative) extraClasses = `my-loyalty-down ms-loyalty-${value}`;
                else extraClasses = `ms-loyalty-zero my-loyality-0`;

                fontClass = '';
            } 
            else if (fontClass.startsWith('h') && fontClass.length === 2){
                extraClasses = `ms-half ms-${fontClass[1]}`;
                fontClass = '';
            }

            elements.push(
                <i
                key={`mana-${matchIndex}`}
                className={`ms ms-${fontClass} ms-cost`}
                aria-hidden="true"
                />
            );
            lastIndex = regex.lastIndex;
            console.log(match)
        }
        if(lastIndex < text.length){
            elements.push(text.substring(lastIndex));
        }
        return elements
    },[text]);
}
