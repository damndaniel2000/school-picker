// Input.tsx

import React from 'react';

interface InputProps {
    label?: string; // Optional label for the input
    name: string; // Name of the input field
    type?: 'text' | 'email' | 'password' | string; // Input type (default: text)
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // Function to handle input change
    placeholder?: string; // Placeholder text
    value: string; // Current value of the input
    // Additional props to be spread to the input element
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

const Input: React.FC<InputProps> = ({
    label,
    name,
    type = 'text',
    onChange,
    placeholder,
    value,
    inputProps,
}) => {
    return (
        <div className="flex flex-col">
            {label && <label htmlFor={name} className="mb-2 text-sm font-medium">{label}</label>}
            <input
                id={name}
                name={name}
                type={type}
                onChange={onChange}
                placeholder={placeholder}
                value={value}
                className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 ease-in-out"
                {...inputProps}
            />
        </div>
    );
};

export default Input;
