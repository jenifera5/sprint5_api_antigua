import React, { useState, useRef, useEffect } from "react";

interface DropdownProps {
  label: React.ReactNode;
  children: React.ReactNode;
}

export function DropdownMenu({ label, children }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="rounded-full p-1 hover:bg-gray-200"
      >
        {label}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border border-gray-200 rounded-lg z-50">
          {children}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
    >
      {children}
    </button>
  );
}
