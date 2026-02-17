import { ReactNode, ChangeEvent } from 'react';
import {
  Control,
  FieldError,
  ControllerRenderProps,
  FieldValues,
  Path,
} from 'react-hook-form';

// Label
type LabelType = {
  value?: string;
  className?: string;
};

interface InputBoxProps<T extends FieldValues = FieldValues> {
  label: string;
  name: Path<T>;
  type?:
    | 'text'
    | 'password'
    | 'email'
    | 'phone'
    | 'number'
    | 'price'
    | 'file'
    | 'checkbox'
    | 'single-select'
    | 'multi-select'
    | 'dob'
    | 'alphanumeric'
    | 'string';
  control: Control<T>; // ✅ no union with undefined
  error?: FieldError | undefined;
  className?: string;
  options?: string[];
  onChange?: (value: string | number | boolean) => void;
  value?: string | number;
  readOnly?: boolean;
  borderClass?: string;
  onBlur?: (e: ChangeEvent<HTMLInputElement>) => void;
}

// Base Input Props
interface BaseInputProps {
  field: ControllerRenderProps<FieldValues, string>;
  type: string;
  className: string;
  value?: string | number | undefined;
  placeholder?: string;
  props?: Record<string, unknown>;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onInput?: (e: ChangeEvent<HTMLInputElement, unknown>) => void;
  readOnly?: boolean;
  borderClass?: string;
}

// Text Input Props
interface TextInputProps {
  field?: ControllerRenderProps<FieldValues, string>;
  label: string;
  type: string;
  onChange?: (e: ControllerRenderProps<FieldValues, string, unknown>) => void;
  readOnly?: boolean;
  value?: string | number | undefined;
  borderClass?: string;
  error?: FieldError;
}

// Phone Input Props
interface PhoneInputProps {
  field: ControllerRenderProps<FieldValues, string>;
  label: string;
  onChange?: (value: string) => void;
  borderClass?: string;
}

// Password Input Props
interface PasswordInputProps {
  field: ControllerRenderProps<FieldValues, string, unknown>;
  label: string;
  onChange?: (value: string | unknown) => void;
  borderClass?: string;
  error?: FieldError;
}

// Checkbox
type CheckboxSizeVariantType = 'small' | 'medium' | 'large' | string;

type CheckboxType = {
  value: string;
  className?: string;
  onChange?: (value: boolean) => void;
  size?: CheckboxSizeVariantType;
  checked?: boolean;
};

interface CheckboxProps {
  label: LabelType;
  checkBox: CheckboxType;
}

// Range Slider
interface DualRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  className?: string;
}

// Textarea
export interface TextAreaInputProps {
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  value: string;
  limit?: number;
  placeholder?: string;
  readOnly?: boolean;
}

interface TextAreaProps {
  label: LabelType;
  textArea: TextAreaInputProps;
}

// Input Box - Checkbox/Radio
interface BoxInputProps {
  field: ControllerRenderProps<FieldValues, string>;
  type: string;
  className?: string;
  onInput?: (e: ChangeEvent<HTMLInputElement>) => void;
}

// Checkbox with label
interface CheckProps {
  field: ControllerRenderProps<FieldValues, string>;
  label: LabelType;
  className?: string;
}

// Select
interface SingleSelectProps {
  field?: ControllerRenderProps<FieldValues, string>;
  children: ReactNode;
}

interface MultiSelectProps {
  buttonLabel?: string;
  children: ReactNode;
  field?: ControllerRenderProps<FieldValues, string>;
  placeholder: string;
}

export {
  InputBoxProps,
  BaseInputProps,
  TextInputProps,
  PhoneInputProps,
  PasswordInputProps,
  CheckboxSizeVariantType,
  LabelType,
  CheckboxType,
  CheckboxProps,
  DualRangeSliderProps,
  TextAreaProps,
  TextAreaInputProps,
  BoxInputProps,
  CheckProps,
  SingleSelectProps,
  MultiSelectProps,
};
