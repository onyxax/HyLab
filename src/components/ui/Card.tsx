import * as React from 'react';

export function Card({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`card ${className}`.trim()} {...props} />;
}

export function CodeBlock({
  title,
  action,
  children,
  className = '',
}: {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`code-block ${className}`.trim()}>
      {(title || action) && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-border-primary">
          {title ? <span className="text-xs text-text-muted font-[family-name:var(--font-jetbrains)]">{title}</span> : <span />}
          {action}
        </div>
      )}
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm">{children}</code>
      </pre>
    </div>
  );
}

export function Badge({
  variant = 'neutral',
  className = '',
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: 'accent' | 'neutral' }) {
  return <span className={`badge ${variant === 'accent' ? 'badge-accent' : 'badge-neutral'} ${className}`.trim()} {...props} />;
}
