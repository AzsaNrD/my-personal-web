import Image from 'next/image';
import type { Payment } from '@/lib/data/payments';

export function PaymentIcon({ payment }: { payment: Payment }) {
  if (payment.iconSrc) {
    return (
      <span className="ring-border/50 inline-flex size-10 shrink-0 items-center justify-center rounded-sm bg-white p-1 ring-1">
        <Image
          src={payment.iconSrc}
          alt=""
          width={32}
          height={32}
          className="size-full object-contain"
        />
      </span>
    );
  }
  return (
    <span
      className={`${payment.iconBg ?? 'bg-muted'} inline-flex size-10 shrink-0 items-center justify-center rounded-sm font-mono text-xs font-bold tracking-tight text-white`}
    >
      {payment.iconText ?? payment.name[0]}
    </span>
  );
}
