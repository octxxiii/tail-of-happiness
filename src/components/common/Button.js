import React from 'react';

const Button = ({ 
  text, 
  onClick, 
  type = 'default', 
  disabled = false,
  className = ''
}) => {
  const baseClasses = "transition-all duration-200 border-2 border-black text-xs px-3 py-2";
  const typeClasses = {
    default: "bg-black text-white hover:bg-white hover:text-black",
    outline: "bg-transparent text-black hover:bg-black hover:text-white",
    danger: "bg-red-600 text-white border-red-600 hover:bg-white hover:text-red-600",
    success: "bg-green-600 text-white border-green-600 hover:bg-white hover:text-green-600"
  };

  return (
    <button
      className={`${baseClasses} ${typeClasses[type]} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button; 