import React, { useState, createRef } from "react";
import "@ant-design/v5-patch-for-react-19";
import { Input, InputRef } from "antd";

interface OtpInputProps {
  length?: number;
  onChange: (value: string) => void;
  value: string;
  isDisabled?: boolean;
}

const OtpInputComponent: React.FC<OtpInputProps> = ({
  length = 6,
  onChange,
  value,
  isDisabled = false,
}) => {
  const [otp, setOtp] = useState<string[]>(
    value.split("").concat(Array(length - value.length).fill("")),
  );
  const inputRefs = Array(length)
    .fill(0)
    .map(() => createRef<InputRef>());

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) {
      return;
    }

    if (value.length > 1) {
      value = value.slice(-1);
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    onChange(newOtp.join(""));

    if (value && index < length - 1) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (
      !/^\d$/.test(e.key) &&
      !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
    ) {
      e.preventDefault();
      return;
    }

    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = pastedData
        .split("")
        .concat(Array(length - pastedData.length).fill(""));
      setOtp(newOtp);
      onChange(pastedData);
      inputRefs[Math.min(pastedData.length, length - 1)].current?.focus();
    }
  };

  return (
    <div className="flex gap-2 justify-center my-8">
      {Array(length)
        .fill(0)
        .map((_, index) => (
          <Input
            key={index}
            ref={inputRefs[index]}
            value={otp[index]}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            maxLength={1}
            pattern="[0-9]*"
            inputMode="numeric"
            disabled={isDisabled}
            className="w-10 h-10 text-center text-xl font-semibold"
          />
        ))}
    </div>
  );
};

export default OtpInputComponent;
