import { ExternalLink, FolderOpen } from 'lucide-react';
import { materi } from '@/lib/data/kuliah';

export function KuliahMateri() {
  const items = [...materi].filter((m) => m.driveUrl).sort((a, b) => a.semester - b.semester);

  return (
    <section>
      <p className="text-muted-foreground font-mono text-xs tracking-[0.18em] uppercase">
        Arsip Materi
      </p>
      {items.length === 0 ? (
        <p className="text-muted-foreground border-border mt-3 rounded-xl border border-dashed p-6 text-sm">
          Belum ada link materi.
        </p>
      ) : (
        <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {items.map((m) => (
            <li key={m.semester}>
              <a
                href={m.driveUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="group border-border hover:border-primary/40 hover:bg-secondary/40 flex items-center gap-3 rounded-xl border p-4 transition-colors"
              >
                <span className="bg-muted text-muted-foreground inline-flex size-9 shrink-0 items-center justify-center rounded-md">
                  <FolderOpen size={16} aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-foreground group-hover:text-primary text-sm font-semibold transition-colors">
                    Semester {m.semester}
                  </p>
                  <p className="text-muted-foreground truncate text-xs">
                    {m.label ?? 'Buka di Google Drive'}
                  </p>
                </div>
                <ExternalLink size={14} aria-hidden className="text-muted-foreground shrink-0" />
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
