import { ExternalLink, FileText, Globe } from 'lucide-react';
import { resources, type ResourceLink } from '@/lib/data/kuliah';

function pickIcon(url: string) {
  if (url.includes('drive.google.com') || url.toLowerCase().endsWith('.pdf')) {
    return FileText;
  }
  return Globe;
}

function ResourceCard({ r }: { r: ResourceLink }) {
  const Icon = pickIcon(r.url);
  return (
    <li>
      <a
        href={r.url}
        target="_blank"
        rel="noreferrer noopener"
        className="group border-border hover:border-primary/40 hover:bg-secondary/40 flex items-center gap-3 rounded-xl border p-4 transition-colors"
      >
        <span className="bg-muted text-muted-foreground inline-flex size-9 shrink-0 items-center justify-center rounded-md">
          <Icon size={16} aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-foreground group-hover:text-primary truncate text-sm font-semibold transition-colors">
            {r.name}
          </p>
          {r.description ? (
            <p className="text-muted-foreground truncate text-xs">{r.description}</p>
          ) : null}
        </div>
        <ExternalLink size={14} aria-hidden className="text-muted-foreground shrink-0" />
      </a>
    </li>
  );
}

export function KuliahTautan() {
  if (!resources.length) return null;
  return (
    <section>
      <p className="text-muted-foreground font-mono text-xs tracking-[0.18em] uppercase">Tautan</p>
      <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {resources.map((r) => (
          <ResourceCard key={r.slug} r={r} />
        ))}
      </ul>
    </section>
  );
}
