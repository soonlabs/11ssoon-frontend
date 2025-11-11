import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fixNumber = (value: unknown, decimals: number = 6, needPadZero: boolean = false) => {
  if (typeof value !== 'string' && typeof value !== 'number') {
    return '0';
  }
  const [integerPart, decimalPart = ''] = value.toString().split('.');
  let truncatedDecimal = decimalPart.substring(0, decimals);
  if (needPadZero && decimalPart.length < decimals) {
    truncatedDecimal = truncatedDecimal.padEnd(decimals, '0');
  }

  return `${integerPart}${truncatedDecimal ? `.${truncatedDecimal}` : ''}`;
};

export function formatAddress(
  address?: string,
  prefixLength = 6,
  suffixLength = 4
): string {
  if (!address) return '';
  if (address.length <= prefixLength + suffixLength) return address;

  return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`;
}

