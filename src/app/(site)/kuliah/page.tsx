import type { Metadata } from 'next';
import { meta } from '@/lib/data/kuliah';
import { KuliahInfo } from '@/components/sections/kuliah-info';
import { KuliahMateri } from '@/components/sections/kuliah-materi';
import { KuliahTautan } from '@/components/sections/kuliah-tautan';
import { PageHeader } from '@/components/layouts/page-header';

export const metadata: Metadata = {
  title: 'Kuliah',
  description: 'Arsip materi perkuliahan dan tautan penting.',
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  alternates: { canonical: undefined },
};

export default function KuliahPage() {
  return (
    <div className="py-12">
      <PageHeader
        eyebrow="Kuliah"
        jp="大学"
        title="Arsip Kuliah"
        description={`Arsip materi ${meta.totalSemester} semester ${meta.prodi} di ${meta.university}, plus tautan yang masih kepakai.`}
      />
      <div className="[&>*:not(:first-child)]:border-border [&>*:not(:first-child)]:mt-10 [&>*:not(:first-child)]:border-t [&>*:not(:first-child)]:pt-10">
        <KuliahInfo />
        <KuliahMateri />
        <KuliahTautan />
      </div>
    </div>
  );
}
