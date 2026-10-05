import { Home, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ErrorViewProps = {
  /** Server-side error id; safe to show and lets you find the matching log line. */
  digest?: string;
  onRetry: () => void;
};

export function ErrorView({ digest, onRetry }: ErrorViewProps) {
  return (
    <section className="py-24 text-center md:py-32" aria-label="Something went wrong">
      <p className="text-muted-foreground font-mono text-sm tracking-[0.2em]">ERROR</p>

      <h1 className="font-display mt-4 text-4xl font-bold tracking-tight md:text-5xl">
        <span className="from-brand-600 to-brand-400 bg-gradient-to-r bg-clip-text text-transparent">
          Something went wrong
        </span>
      </h1>

      <p className="text-muted-foreground mx-auto mt-4 max-w-md leading-relaxed">
        This page hit an unexpected problem. You can try again, or head back home.
      </p>
      {digest && (
        <p className="text-muted-foreground mt-3 font-mono text-xs">Reference: {digest}</p>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button size="default" className="h-10 gap-2 px-4 text-sm" onClick={onRetry}>
          <RotateCcw size={16} aria-hidden />
          Try again
        </Button>
        <Button
          size="default"
          variant="outline"
          className="h-10 gap-2 px-4 text-sm"
          nativeButton={false}
          render={<a href="/" />}
        >
          <Home size={16} aria-hidden />
          Back home
        </Button>
      </div>
    </section>
  );
}
