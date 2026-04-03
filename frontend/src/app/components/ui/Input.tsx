import { ClassAttributes, InputHTMLAttributes } from "react";
import { JSX } from "react/jsx-runtime";

export default function Input(props: JSX.IntrinsicAttributes & ClassAttributes<HTMLInputElement> & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="px-4 py-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      {...props}
    />
  );
}