"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface CurrencyInputProps {
  id?: string;
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

/**
 * A currency field that shows thousands separators while resting and raw
 * digits while editing, so typing stays predictable.
 */
export function CurrencyInput({
  id,
  value,
  onChange,
  className,
}: CurrencyInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <input
      ref={inputRef}
      id={id}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      value={isFocused ? draft : value.toLocaleString("en-US")}
      onFocus={() => {
        setDraft(String(value));
        setIsFocused(true);
        requestAnimationFrame(() => inputRef.current?.select());
      }}
      onBlur={() => setIsFocused(false)}
      onChange={(event) => {
        const digits = event.target.value.replace(/[^\d]/g, "");
        setDraft(digits);
        onChange(digits ? Number(digits) : 0);
      }}
      className={cn(
        "w-full rounded-md border border-line-strong bg-surface py-1.5 pl-6 pr-2 text-base font-semibold tabular-nums text-ink transition-colors hover:border-ink-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-[#c98d97]",
        className
      )}
    />
  );
}
