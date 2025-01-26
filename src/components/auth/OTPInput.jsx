import React, { useRef } from 'react';

const OTPInput = ({ otp, setOtp }) => {
  const inputRefs = useRef([]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return; // Prevent non-numeric input

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input field if not empty
    if (element.value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      {otp.map((data, index) => (
        <input
          key={index}
          type="text"
          maxLength="1"
          value={data}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          ref={(el) => (inputRefs.current[index] = el)}
          className="focus:outline-brand-blue w-[40px] h-[40px] text-center text-brand-blue text-2xl border border-brand-blue rounded-md"
        />
      ))}
    </div>
  );
};

export default OTPInput;
