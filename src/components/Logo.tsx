
import React from "react";

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "h-10 w-10" }) => {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="40" height="40" rx="8" fill="currentColor" className="text-accent" />
      <path
        d="M20 8C13.373 8 8 13.373 8 20C8 26.627 13.373 32 20 32C26.627 32 32 26.627 32 20C32 13.373 26.627 8 20 8ZM20 30C14.477 30 10 25.523 10 20C10 14.477 14.477 10 20 10C25.523 10 30 14.477 30 20C30 25.523 25.523 30 20 30Z"
        fill="white"
      />
      <path
        d="M25 16H22V14C22 13.448 21.552 13 21 13H19C18.448 13 18 13.448 18 14V16H15C14.448 16 14 16.448 14 17V19C14 19.552 14.448 20 15 20H18V26C18 26.552 18.448 27 19 27H21C21.552 27 22 26.552 22 26V20H25C25.552 20 26 19.552 26 19V17C26 16.448 25.552 16 25 16Z"
        fill="white"
      />
    </svg>
  );
};

export default Logo;
