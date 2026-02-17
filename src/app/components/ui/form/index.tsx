'use client';
import React, { useState } from 'react';
import {
  Control,
  Controller,
  FieldValues,
  ControllerRenderProps,
} from 'react-hook-form';

// import 'react-phone-number-input/style.css';

import {
  BaseInputProps,
  InputBoxProps,
  PasswordInputProps,
  TextInputProps,
} from './form.d';
import { Eye, EyeOff } from 'lucide-react';

/* ---------------------------- Base Input ---------------------------- */
export const BaseInput: React.FC<BaseInputProps> = ({
  field,
  value,
  type = 'text',
  className,
  onChange,
  placeholder = '',
  props,
  onInput,
  readOnly,
}) => (
  <input
    {...field}
    {...props}
    value={field?.value ?? value ?? ''}
    type={type}
    readOnly={readOnly}
    onChange={e => {
      if (field) field.onChange(e);
      if (onChange) onChange(e);
    }}
    className={`${className}`}
    placeholder={placeholder}
    onInput={onInput}
  />
);

/* ---------------------------- Text Input ---------------------------- */
export const TextInput: React.FC<TextInputProps> = ({
  field,
  label,
  type,
  error,
  onChange,
  readOnly = false,
  value,
  borderClass = `border  ${
    error
      ? 'border-[#FF0000] focus:ring-[#FF0000]'
      : 'border-[#000] focus:ring-[#000]'
  }`,
}) => {
  return (
    <div className="relative w-full">
      <BaseInput
        field={field as ControllerRenderProps<FieldValues, string>}
        type={type}
        readOnly={readOnly}
        value={value}
        className={`peer block w-full h-14 rounded-md px-3 pb-2.5 pt-6 text-sm text-black-900 focus:outline-none bg-transparent ${borderClass}`}
        onInput={e => {
          if (type === 'number') {
            // allow only digits
            e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '');
          } else if (type === 'text') {
            // allow only alphabets (A-Z, a-z) and spaces
            e.currentTarget.value = e.currentTarget.value.replace(
              /[^A-Za-z\s]/g,
              ''
            );
          } else if (type === 'alphanumeric') {
            e.currentTarget.value = e.currentTarget.value.replace(
              /[^A-Za-z0-9\s]/g,
              ''
            );
          }
          // For email, do not restrict or auto-append .com, let validation handle it
        }}
        onChange={onChange}
      />
      <label
        className={`text-[16px] absolute left-1.5 top-4 origin-[0] -translate-y-3 scale-75 transform duration-150 
     peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 
     peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-gray-600 px-2 ${
       error
         ? 'text-red-500 peer-focus:text-red-600'
         : 'peer-focus:text-gray-600'
     }`}
      >
        {label}
      </label>
    </div>
  );
};

/* ---------------------------- Phone Input ---------------------------- */
// const PhoneInputField: React.FC<PhoneInputProps & { borderClass?: string }> = ({
//   field,
//   label,
//   onChange,
//   borderClass = 'border border-gray-500',
// }) => {
//   const formattedValue = field.value?.startsWith('+')
//     ? field.value
//     : `+1${field.value?.replace(/\D/g, '')}`;

//   return (
//     <div className={`relative rounded-md px-4 pt-4 pb-4 w-full ${borderClass}`}>
//       <PhoneInput
//         {...field}
//         defaultCountry="US"
//         international
//         countryCallingCodeEditable={false}
//         onChange={(value) => {
//           field.onChange(value);
//           if (onChange && typeof value === 'string') {
//             onChange(value);
//           }
//         }}
//         value={formattedValue}
//         className="w-full border-none outline-none bg-transparent"
//       />
//       <label className="absolute left-4 top-2 text-sm px-2 text-gray-500">{label}</label>
//     </div>
//   );
// };

/* ---------------------------- Password Input ---------------------------- */
const PasswordInputField: React.FC<
  PasswordInputProps & { borderClass?: string }
> = ({
  field,
  label,
  onChange,
  error,
  borderClass = `border  ${error ? 'border-[#0000] focus:ring-[#FF0000]' : 'border-[#000] focus:ring-[#000]'}`,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full">
      <BaseInput
        field={field}
        type={showPassword ? 'text' : 'password'}
        onChange={onChange}
        className={`peer block w-full px-4 pb-2 pt-6 rounded-md focus:outline-1 focus:ring-1 focus:ring-black-900 bg-transparent ${borderClass}`}
      />
      <label className="absolute left-4 top-4 origin-[0] -translate-y-3 scale-75 transform duration-150 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-gray-600 px-2">
        {label}
      </label>
      <div
        className="absolute right-3 top-4 text-gray-500"
        onClick={() => setShowPassword(!showPassword)}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? <Eye /> : <EyeOff />}
      </div>
    </div>
  );
};

/* ---------------------------- File Input ---------------------------- */
const FileInputField: React.FC<{
  field: ControllerRenderProps<FieldValues, string>;
  label: string;
  onChange?: (files: FileList | null) => void;
  borderClass?: string;
}> = ({ field, label, onChange, borderClass = 'border border-gray-500' }) => (
  <div className="relative w-full">
    <input
      type="file"
      onChange={e => {
        field.onChange(e.target.files);
        if (onChange) {
          onChange(e.target.files);
        }
      }}
      className={`block w-full text-sm px-4 py-2 rounded-md ${borderClass}`}
    />
    <label className="absolute left-4 top-2 px-2 text-gray-500">{label}</label>
  </div>
);

/* ---------------------------- Price Input ---------------------------- */
const PriceInput: React.FC<TextInputProps & { borderClass?: string }> = ({
  field,
  label,
  type = 'string',
  onChange,
  borderClass = '',
}) => {
  return (
    <div className=" ">
      <BaseInput
        field={field as ControllerRenderProps<FieldValues, string>}
        type={type}
        onChange={onChange}
        className={`text-8xl max-w-[600px] text-center font-bold border-none focus:outline-none focus:ring-0 bg-transparent ${borderClass}`}
      />
      <label className="absolute left-4 top-4 text-xl text-gray-600 px-2">
        {label}
      </label>
    </div>
  );
};

/* ---------------------------- Main InputBox Component ---------------------------- */
const InputBox = <T extends FieldValues>({
  label,
  name,
  type = 'text',
  control,
  error,
  className = '',
  onChange,
  readOnly = false,
  borderClass,
}: InputBoxProps<T>) => {
  return (
    <div className={`relative ${className}`}>
      <Controller
        name={name}
        control={control as Control<T>}
        rules={{
          required: `${label || name} is required`,
        }}
        render={({ field }) => {
          const handleChange = (value: string | number) => {
            field.onChange(value);
            if (onChange) onChange(value);
          };

          return (
            <>
              {type === 'password' ? (
                <PasswordInputField
                  field={{ ...field, onChange: handleChange }}
                  label={label}
                  borderClass={borderClass}
                  error={error}
                />
              ) : type === 'price' ? (
                <PriceInput
                  field={{ ...field, onChange: handleChange }}
                  label={label}
                  type={type}
                  borderClass={borderClass}
                />
              ) : type === 'file' ? (
                <FileInputField
                  field={{ ...field, onChange: handleChange }}
                  label={label}
                  borderClass={borderClass}
                />
              ) : (
                <TextInput
                  field={{ ...field, onChange: handleChange }}
                  label={label}
                  type={type}
                  readOnly={readOnly}
                  borderClass={borderClass}
                  error={error}
                />
              )}
            </>
          );
        }}
      />
    </div>
  );
};

export default InputBox;
