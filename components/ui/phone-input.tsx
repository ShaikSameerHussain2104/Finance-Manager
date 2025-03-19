"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { useState } from "react"

interface PhoneInputProps {
  id: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  className?: string
}

export function PhoneInput({
  id,
  value,
  onChange,
  placeholder = "Enter phone number",
  required = false,
  className = "",
}: PhoneInputProps) {
  const [focused, setFocused] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-numeric characters except for the + at the beginning
    let phoneNumber = e.target.value
    if (phoneNumber.startsWith("+")) {
      phoneNumber = "+" + phoneNumber.substring(1).replace(/[^0-9]/g, "")
    } else {
      phoneNumber = phoneNumber.replace(/[^0-9]/g, "")
    }

    onChange(phoneNumber)
  }

  return (
    <div className="relative">
      {!value && !focused && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">+91</div>
      )}
      <Input
        id={id}
        type="tel"
        value={value}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        required={required}
        className={`pl-${value || focused ? "3" : "10"} ${className}`}
      />
    </div>
  )
}

