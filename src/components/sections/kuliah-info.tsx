import { meta } from '@/lib/data/kuliah';

type Item = { label: string; value: string };

export function KuliahInfo() {
  const items: Item[] = [
    { label: 'Prodi', value: meta.prodi },
    { label: 'Universitas', value: meta.university },
    { label: 'Angkatan', value: String(meta.angkatan) },
    { label: 'Kelas', value: meta.kelas },
    { label: 'Lokasi', value: meta.kampus },
  ].filter((it) => it.value && it.value !== 'TBD');

  if (!items.length) return null;

  return (
    <section>
      <p className="text-muted-foreground font-mono text-xs tracking-[0.18em] uppercase">Profil</p>
      <dl className="border-border bg-card mt-3 grid grid-cols-2 gap-x-4 gap-y-4 rounded-xl border p-4 sm:grid-cols-3">
        {items.map((it) => (
          <div key={it.label} className="min-w-0">
            <dt className="text-muted-foreground/70 font-mono text-[10px] tracking-wider uppercase">
              {it.label}
            </dt>
            <dd className="text-foreground mt-1 truncate text-sm font-medium">{it.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
