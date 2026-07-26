import type { Metadata } from 'next';
import { Payments } from '@/components/sections/payments';
import { PageHeader } from '@/components/layouts/page-header';

export const metadata: Metadata = {
  title: 'Pay',
  description: 'Bank accounts, e-wallets, and PayPal for sending payments to me.',
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  alternates: { canonical: undefined },
};

export default function PayPage() {
  return (
    <div className="py-12">
      <PageHeader
        eyebrow="Pay"
        jp="支払い"
        title="Transfer & e-wallet"
        description="Bank accounts, e-wallets, and PayPal for friends who owe me coffee. Tap any number to copy."
      />
      <Payments />
    </div>
  );
}
