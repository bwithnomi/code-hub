'use client';

import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";

interface EditableTextProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

export function EditableText({
  value,
  onChange,
  placeholder = "Click to edit",
  className = "",
}: EditableTextProps) {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  useEffect(() => {
    setTempValue(value)
  }, [value]);

  const handleBlur = () => {
    setEditing(false);
    onChange(tempValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleBlur();
    } else if (e.key === "Escape") {
      setTempValue(value);
      setEditing(false);
    }
  };

  return editing ? (
    <Input
      ref={inputRef}
      value={tempValue}
      onChange={(e) => setTempValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={className}
    />
  ) : (
    <span
      onClick={() => setEditing(true)}
      className={`cursor-pointer hover:underline ${value ? "" : "text-muted-foreground"} ${className}`}
    >
      {value || placeholder}
    </span>
  );
}
