export function StatsSection() {
  return (
    <section className="border-y border-border-primary">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-[auto_1fr] gap-6 md:gap-10 items-center py-6">
          <div className="flex items-baseline gap-4">
            <div className="text-[40px] font-bold tracking-[-0.03em] leading-none tabular text-text-primary">18,039</div>
            <div className="text-sm leading-tight">
              <div className="font-medium">icons</div>
              <div className="text-xs text-text-muted">10 sources · MIT/Apache/ISC</div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-6 md:justify-end text-sm border-t md:border-t-0 border-border-primary pt-4 md:pt-0">
            <div className="flex items-center gap-2"><span className="text-xl font-bold tabular">14</span><span className="text-text-muted">categories</span></div>
            <span className="hidden sm:block w-px h-6 bg-border-primary" />
            <div className="flex items-center gap-2"><span className="text-xl font-bold tabular">3</span><span className="text-text-muted">SVG · PNG · WebP</span></div>
            <span className="hidden sm:block w-px h-6 bg-border-primary" />
            <div className="text-xs text-text-muted">No auth · Edge cached · <span className="text-text-secondary">~42ms</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
