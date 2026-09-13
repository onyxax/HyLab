import * as React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const variantClass: Record<Variant, string> = {
  primary: 'btn btn-primary',
  secondary: 'btn btn-secondary',
  ghost: 'text-text-muted hover:text-text-primary hover:bg-bg-secondary/80',
};

const sizeClass: Record<Size, string> = {
  sm: 'text-xs py-2 px-3',
  md: 'text-sm py-2 px-5',
  lg: 'text-base py-3 px-8',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button className={`${variantClass[variant]} ${sizeClass[size]} ${className}`.trim()} {...props} />
  );
}
