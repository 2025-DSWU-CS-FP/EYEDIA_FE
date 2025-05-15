import { twMerge } from 'tailwind-merge';

function cn(...classes: (string | undefined)[]) {
  return twMerge(classes);
}

export default cn;
