import React from "react";

interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({ id, label, type, placeholder, value, onChange }) => {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <br />
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <br />
    </div>
  );
};

export default InputField;