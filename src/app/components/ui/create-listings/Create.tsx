'use client';

import { Info } from 'lucide-react';
import { useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import PageContext from '../../contextprovider';

type SafetyDetailsForm = {
  securityCamera: boolean;
  noiseMonitor: boolean;
  weapons: boolean;
};

export default function SafetyDetails() {
  const { i18 } = useContext(PageContext);
  const { control } = useForm<SafetyDetailsForm>({
    defaultValues: {
      securityCamera: false,
      noiseMonitor: false,
      weapons: false,
    },
  });

  const create =
    typeof i18?.CREATELISTING?.PRICE === 'object'
      ? i18.CREATELISTING.PRICE
      : {};
  return (
    <form className="max-w-[700px] mx-auto flex flex-col gap-10">
      {/* Heading */}
      <div>
        <h1 className="text-3xl font-bold">
          {(typeof create.TITLE === 'string' && create.TITLE) ||
            'Share safety details'}
        </h1>
        <div className="mt-4">
          <p className="font-semibold flex items-center gap-1">
            {(typeof create.DESC1 === 'string' && create.DESC1) ||
              'Does your place have any of these?'}
            <span
              title="Disclose any safety equipment for transparency"
              className="text-lg"
            >
              <Info />
            </span>
          </p>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="flex flex-col gap-5">
        <Controller
          name="securityCamera"
          control={control}
          render={({ field }) => (
            <label className="flex justify-between items-center text-lg cursor-pointer">
              <span>
                {(typeof create.CHECKBOX1 === 'string' && create.CHECKBOX1) ||
                  'Exterior security camera present'}
              </span>
              <input
                type="checkbox"
                className="w-5 h-5 accent-black"
                checked={field.value}
                onChange={e => field.onChange(e.target.checked)}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
              />
            </label>
          )}
        />
        <Controller
          name="noiseMonitor"
          control={control}
          render={({ field }) => (
            <label className="flex justify-between items-center text-lg cursor-pointer">
              <span>
                {(typeof create.CHECKBOX2 === 'string' && create.CHECKBOX2) ||
                  'Noise decibel monitor present'}
              </span>
              <input
                type="checkbox"
                className="w-5 h-5 accent-black"
                checked={field.value}
                onChange={e => field.onChange(e.target.checked)}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
              />
            </label>
          )}
        />
        <Controller
          name="weapons"
          control={control}
          render={({ field }) => (
            <label className="flex justify-between items-center text-lg cursor-pointer">
              <span>
                {(typeof create.CHECKBOX3 === 'string' && create.CHECKBOX3) ||
                  'Weapon(s) on the property'}
              </span>
              <input
                type="checkbox"
                className="w-5 h-5 accent-black"
                checked={field.value}
                onChange={e => field.onChange(e.target.checked)}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
              />
            </label>
          )}
        />
      </div>

      {/* Divider */}
      <hr className="border-gray-300 mt-4" />

      {/* Informational text */}
      <div className="text-sm text-gray-700 space-y-2">
        <p className="font-semibold text-gray-900">
          {' '}
          {(typeof create.TITLE2 === 'string' && create.TITLE2) ||
            'Important things to know'}
        </p>
        <p>
          {(typeof create.DESC2 === 'string' && create.DESC2) ||
            ' Security cameras that monitor indoor spaces are not allowed even if they’re turned off. All exterior security cameras must be disclosed.'}
        </p>
        <p>
          {(typeof create.PARA === 'string' && create.PARA) ||
            "Be sure to comply with your local laws and review Staygenx's"}
          <a href="#" className="underline">
            {' '}
            {(typeof create.LINK1 === 'string' && create.LINK1) ||
              'anti-discrimination policy'}
          </a>
          {(typeof create.AND === 'string' && create.AND) || 'and'}{' '}
          <a href="#" className="underline">
            {(typeof create.LINK2 === 'string' && create.LINK2) ||
              'guest and host fees'}
          </a>
          .
        </p>
      </div>
    </form>
  );
}
