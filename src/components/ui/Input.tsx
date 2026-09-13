import * as React from 'react';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => {
    return <input ref={ref} className={`input ${className}`.trim()} {...props} />;
  }
);
Input.displayName = 'Input';

export function SearchInput({
  value,
  onChange,
  onClear,
  placeholder = 'Search...',
  className = '',
}: {
  value: string;
  onChange: (v: string) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`.trim()}>
      <svg
        className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full pl-11 pr-20 py-3.5 text-base rounded-xl border border-border-primary bg-bg-card text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
      />
      {value && onClear && (
        <button
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs text-text-muted hover:text-text-primary bg-bg-secondary rounded-md transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  );
}
