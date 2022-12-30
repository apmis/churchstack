import React from "react";
import AcUnitIcon from "@mui/icons-material/AcUnit";

import {InputBox, InputField, InputLabel} from "./styles";

interface InputProps {
  label?: string;
  inputId?: string;
  errors?: boolean;
  errorText?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (_) => void;
  helperText?: string;
  name?: string;
  type?: string;
  defaultValue?: string;
  value?: any;
  placeholder?: string;
  size?: "small" | "medium";
  disabled?: boolean;
  inputRef?: any;
  register?: any;
  onBlur?: () => void;
  autoComplete?: boolean;
  sx?: {};
  important?: boolean;
}

// Reset Input MUI

// https://stackoverflow.com/questions/57419955/how-to-set-or-clear-value-of-material-ui-input-in-reactjs

const Input: React.FC<InputProps> = ({
  label,
  errorText,
  type = "text",
  name,
  defaultValue = "",
  onChange,
  onKeyDown,
  placeholder,
  // size = 'medium',
  disabled = false,
  register,
  value,
  autoComplete = true,
  onBlur,
  sx,
  inputRef,
  important,
}) => (
  <div>
    <InputBox>
      <InputField
        onChange={onChange}
        type={type}
        defaultValue={defaultValue}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        {...register}
        onBlur={onBlur}
        autoComplete={autoComplete}
        sx={{width: "16px", ...sx}}
        //ref={inputRef}
      />
      <InputLabel className="form__label" htmlFor={name}>
        {label}
        {important && (
          <AcUnitIcon sx={{color: "red", width: "12px", height: "12px"}} />
        )}
      </InputLabel>
    </InputBox>
    {errorText && (
      <label style={{color: "red", fontSize: "0.7rem", textAlign: "left"}}>
        {errorText}
      </label>
    )}
  </div>
);

export default Input;
