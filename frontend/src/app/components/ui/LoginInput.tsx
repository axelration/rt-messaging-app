import { InputHTMLAttributes, useState } from "react";
import { MdOutlineAlternateEmail, MdLockOutline, MdVisibilityOff, MdVisibility } from "react-icons/md";

export default function LoginInput(props: InputHTMLAttributes<HTMLInputElement>) {
  const [showPassword, setShowPassword] = useState(false);
  const passwordValue = String(props.value ?? "");

  if (props.id === "email") {
    return (
      <div className="relative">
        <MdOutlineAlternateEmail className="absolute left-3 top-1/4 text-gray-400" />
        <input
          type="email"
          className="px-4 py-2 pl-10 mb-2 border border-gray-300 rounded w-full focus:ring-1"
          {...props}
        />
      </div>
    );
  }

  if (props.id === "password") {
    const hasPassword = passwordValue !== "";
    return (
      <div className="relative">
        {hasPassword ? (
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute left-3 top-1/4 text-gray-400"
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
          </button>
        ) : (
          <MdLockOutline className="absolute left-3 top-1/4 text-gray-400" />
        )}
        <input
          {...props}
          type={showPassword && hasPassword ? "text" : "password"}
          className="px-4 py-2 pl-10 mb-2 border border-gray-300 rounded w-full focus:ring-1"
        />
      </div>
    );
  }

  return (
    <input
      className="px-4 py-2 mb-2 border border-gray-300 rounded w-full focus:ring-1"
      {...props}
    />
  );
}