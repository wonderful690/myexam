import { useRef, useEffect } from 'react';
import { FiCheck, FiAlertCircle } from 'react-icons/fi';
import './PhoneInput.css';

export default function PhoneInput({ value, onChange, onBlur, status, ...props }) {
  const inputRef = useRef(null);

  const formatPhone = (digits) => {
    let formatted = '+7';
    
    if (digits.length > 0) {
      formatted += ' (' + digits.substring(0, 3);
    }
    if (digits.length >= 3) {
      formatted += ') ' + digits.substring(3, 6);
    }
    if (digits.length >= 6) {
      formatted += '-' + digits.substring(6, 8);
    }
    if (digits.length >= 8) {
      formatted += '-' + digits.substring(8, 10);
    }
    
    return formatted;
  };

  const handleChange = (e) => {
    const input = e.target;
    let rawValue = input.value;
    
    let digits = rawValue.replace(/\D/g, '');
    
    if (digits.startsWith('8')) {
      digits = '7' + digits.slice(1);
    }
    
    if (digits.length > 0 && digits[0] !== '7') {
      digits = '7' + digits;
    }
    
    digits = digits.slice(0, 11);
    
    const formatted = formatPhone(digits.slice(1));
    onChange(formatted);
  };

  const handleKeyDown = (e) => {
    const input = e.target;
    const cursorPos = input.selectionStart;
    
    if (e.key === 'Backspace') {
      e.preventDefault();
      
      let digitPos = cursorPos - 1;
      while (digitPos >= 0 && !/\d/.test(value[digitPos])) {
        digitPos--;
      }
      
      if (digitPos >= 2) {
        const digits = value.replace(/\D/g, '');
        const newDigits = digits.slice(0, -1);
        const formatted = formatPhone(newDigits.slice(1));
        onChange(formatted);
        
        setTimeout(() => {
          const newPos = Math.min(digitPos, formatted.length);
          input.setSelectionRange(newPos, newPos);
        }, 0);
      }
      return;
    }
    
    if (e.key === 'Delete') {
      e.preventDefault();
      
      let digitPos = cursorPos;
      while (digitPos < value.length && !/\d/.test(value[digitPos])) {
        digitPos++;
      }
      
      if (digitPos < value.length && digitPos >= 2) {
        const digits = value.replace(/\D/g, '');
        const digitIndex = value.slice(0, digitPos).replace(/\D/g, '').length;
        const newDigits = digits.slice(0, digitIndex) + digits.slice(digitIndex + 1);
        const formatted = formatPhone(newDigits.slice(1));
        onChange(formatted);
        
        setTimeout(() => {
          input.setSelectionRange(cursorPos, cursorPos);
        }, 0);
      }
      return;
    }
    
    if (e.key === '-' && cursorPos === value.length) {
      e.preventDefault();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = (e.clipboardData || window.clipboardData).getData('text');
    let digits = pastedText.replace(/\D/g, '');
    
    if (digits.startsWith('8')) {
      digits = '7' + digits.slice(1);
    }
    if (digits.length > 0 && digits[0] !== '7') {
      digits = '7' + digits;
    }
    
    digits = digits.slice(0, 11);
    const formatted = formatPhone(digits.slice(1));
    onChange(formatted);
  };

  const handleFocus = (e) => {
    if (!value) {
      onChange('+7 (');
    }
  };

  const handleBlur = (e) => {
    if (value === '+7 (' || value === '+7') {
      onChange('');
    }
    if (onBlur) onBlur(e);
  };

  useEffect(() => {
    if (inputRef.current && value === '+7 (') {
      inputRef.current.setSelectionRange(4, 4);
    }
  }, [value]);

  return (
    <div className="phone-input-wrapper">
      <input
        ref={inputRef}
        type="tel"
        className={`input input-with-status ${
          status === 'valid' ? 'input-success' : 
          status === 'invalid' ? 'input-error' : ''
        }`}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="+7 (___) ___-__-__"
        maxLength={18}
        inputMode="numeric"
        {...props}
      />
      {status === 'valid' && <FiCheck className="status-icon status-icon-valid" size={18} />}
      {status === 'invalid' && <FiAlertCircle className="status-icon status-icon-error" size={18} />}
    </div>
  );
}