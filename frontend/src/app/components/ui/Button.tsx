import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({ children, ...props }: ButtonProps) {
  return(
    <button
      className="px-4 py-2 rounded bg-blue-500 text-white hover:opacity-90"
      {...props}
    >
      {children}
    </button>
  );
}