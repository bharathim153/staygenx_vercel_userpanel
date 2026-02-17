export interface Country {
  name: string;
  code: string; // E.g., "+91"
  length: number; // Expected number of digits (excluding country code)
}

export const countries: Country[] = [
  { name: 'India', code: '+91', length: 10 },
  { name: 'United States', code: '+1', length: 10 },
  { name: 'Australia', code: '+61', length: 9 },
  { name: 'United Arab Emirates', code: '+971', length: 9 },
  { name: 'Afghanistan', code: '+93', length: 9 },
  { name: 'Belgium', code: '+32', length: 9 },
  { name: 'Bangladesh', code: '+880', length: 10 },
];
