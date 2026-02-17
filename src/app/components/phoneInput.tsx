import { useState, useEffect } from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { countries } from '@/utils/countires';
import { ChevronDown } from 'lucide-react';

interface Props {
  control?: Control;
  errors?: FieldErrors;
  onPhoneChange?: (val: { phoneCode: string; phone: string }) => void;
  code?: string;
  phoneno?: string;
  readonly?: boolean;
}

export default function PhoneInputSection({
  control,
  errors,
  onPhoneChange,
  code,
  phoneno,
  readonly = false,
}: Props) {
  const [selectedCode, setSelectedCode] = useState(code || countries[0].code);
  const [maxLength, setMaxLength] = useState(countries[0].length);

  useEffect(() => {
    const country = countries.find(c => c.code === selectedCode);
    if (country) {
      setMaxLength(country.length);
    }
  }, [selectedCode]);

  return (
    <div className="flex gap-3 w-full">
      {/* Country Selector */}
      <div className="w-[25%]">
        <Controller
          name="phoneCode"
          control={control}
          disabled={readonly}
          defaultValue={countries[0].code}
          render={({ field }) => (
            <div className="relative">
              <select
                {...field}
                value={selectedCode}
                onChange={e => {
                  const selected = e.target.value;
                  field.onChange(selected);
                  setSelectedCode(selected);
                  if (onPhoneChange) {
                    onPhoneChange({ phoneCode: selected, phone: '' });
                  }
                }}
                className="p-[15px] w-full rounded-lg border border-[#000] focus:ring-0 focus:rounded-lg focus:outline-none appearance-none"
              >
                {countries.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.code}
                  </option>
                ))}
              </select>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronDown size={16} />
              </span>
            </div>
          )}
        />
      </div>

      {/* Phone Input */}
      <div className="relative w-[75%]">
        <Controller
          name="phone"
          control={control}
          rules={{
            required: 'Phone number is required',
            pattern: {
              value: /^[0-9]+$/,
              message: 'Only digits allowed',
            },
            validate: value => {
              debugger;
              const country = countries.find(c => c.code === selectedCode);
              if (country && value?.length !== country.length) {
                return `Enter valid number`;
              }
              return true;
            },
          }}
          render={({ field }) => {
            const hasValue = !!field.value || !!phoneno;
            const value =
              phoneno !== '' && phoneno !== undefined ? phoneno : field.value;
            console.log('Rendering', phoneno, field.value, value);
            return (
              <div className="relative w-full">
                <input
                  {...field}
                  type="tel"
                  value={value || ''}
                  readOnly={readonly}
                  maxLength={maxLength}
                  onChange={e => {
                    const raw = e.target.value.replace(/\D/g, '');
                    const trimmed = raw.slice(0, maxLength);
                    field.onChange(trimmed);
                    if (onPhoneChange) {
                      onPhoneChange({
                        phoneCode: selectedCode,
                        phone: trimmed,
                      });
                    }
                  }}
                  className={`peer w-full px-4 pt-6 pb-2 text-sm rounded-lg border focus:outline-none focus:rounded-lg
                    ${errors?.phone ? 'border-red-500' : 'border-[#000] focus:ring-black'}`}
                />
                <label
                  className={`absolute left-4 text-sm text-gray-500 transition-all pointer-events-none
                    ${hasValue ? 'top-1 text-xs' : 'top-4'} peer-focus:top-1 peer-focus:text-xs`}
                >
                  Phone Number
                </label>
                {errors?.phone && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phone.message as string}
                  </p>
                )}
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}
