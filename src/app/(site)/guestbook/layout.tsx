import { PageHeader } from '@/components/layouts/page-header';

/** Header lives in the layout so it is not re-mounted (and re-animated) when loading.tsx swaps to the page. */
export default function GuestbookLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="py-12">
      <PageHeader
        eyebrow="Guestbook"
        jp="ゲストブック"
        title="Guestbook"
        description="Want to drop a message or say hi? No account needed."
      />
      {children}
    </section>
  );
}
