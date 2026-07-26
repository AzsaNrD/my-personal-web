import type { Payment, PaymentCategory } from '@/lib/data/payments';
import { payments } from '@/lib/data/payments';
import { CopyText } from '@/components/ui/copy-text';
import { PaymentIcon } from '@/components/ui/payment-icon';

const CATEGORY_META: Record<PaymentCategory, { label: string }> = {
  bank: { label: 'Banks' },
  ewallet: { label: 'E-wallets' },
  international: { label: 'International' },
};

const CATEGORY_ORDER: PaymentCategory[] = ['bank', 'ewallet', 'international'];

function PaymentCard({ p }: { p: Payment }) {
  return (
    <li>
      <div className="border-border flex items-center gap-3 rounded-xl border p-3">
        <PaymentIcon payment={p} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
            <p className="text-foreground truncate text-sm font-medium">{p.name}</p>
            {p.fullName ? (
              <span className="text-muted-foreground/70 truncate text-xs">{p.fullName}</span>
            ) : null}
          </div>
          {p.accountName ? (
            <p className="text-muted-foreground mt-0.5 truncate text-xs">a/n {p.accountName}</p>
          ) : null}
          <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs">
            {p.identityLabel ? (
              <span className="text-muted-foreground/70 shrink-0 font-mono tracking-wider uppercase">
                {p.identityLabel}
              </span>
            ) : null}
            <span className="text-foreground min-w-0 truncate font-mono">{p.identity}</span>
            <CopyText value={p.identity} label={p.identityLabel ?? p.name} />
          </div>
          {p.note ? (
            <p className="text-muted-foreground/70 mt-1 text-xs leading-snug">{p.note}</p>
          ) : null}
        </div>
      </div>
    </li>
  );
}

export function Payments() {
  return (
    <div className="space-y-10">
      {CATEGORY_ORDER.map((category) => {
        const items = payments.filter((p) => p.category === category);
        if (!items.length) return null;
        const meta = CATEGORY_META[category];
        return (
          <section key={category} className="space-y-3">
            <p className="text-muted-foreground font-mono text-xs tracking-[0.2em] uppercase">
              {meta.label}
            </p>
            <ul className="space-y-2">
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
