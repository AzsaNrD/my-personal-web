import type { PaymentCategory } from '@/lib/data/payments';
import { payments } from '@/lib/data/payments';
import { PaymentCard } from '@/components/sections/payment-card';

const CATEGORY_META: Record<PaymentCategory, { label: string }> = {
  bank: { label: 'Banks' },
  ewallet: { label: 'E-wallets' },
  international: { label: 'International' },
};

const CATEGORY_ORDER: PaymentCategory[] = ['bank', 'ewallet', 'international'];

export function Payments() {
  return (
    <div className="space-y-10">
      {CATEGORY_ORDER.map((category) => {
        const items = payments.filter((p) => p.category === category);
        if (!items.length) return null;
        const meta = CATEGORY_META[category];
        return (
          <section key={category} className="space-y-3">
            <p className="text-primary font-mono text-xs tracking-[0.2em] uppercase">
              <span className="text-primary/60" aria-hidden>
                //{' '}
              </span>
              {meta.label}
            </p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {items.map((p) => (
                <PaymentCard key={p.slug} p={p} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
