import React, { useState } from 'react';

interface PillProps {
    text: string;
    onClick: (text: string) => void;
}

const Pill: React.FC<PillProps> = ({ text, onClick }) => {
    const [isSelected, setIsSelected] = useState(false);

    const handleClick = () => {
        setIsSelected(!isSelected);
        onClick(text);
    };

    return (
        <button
            className={`
        px-3 py-2 rounded-full border-2 font-medium
        ${isSelected && 'bg-blue-500 text-white border-blue-500'}
      `}
            onClick={handleClick}
        >
            {text}
        </button>
    );
};

export default Pill;
