export type PaymentCategory = 'bank' | 'ewallet' | 'international';

export type Payment = {
  slug: string;
  name: string;
  fullName?: string;
  category: PaymentCategory;
  identity: string;
  identityLabel?: string;
  accountName?: string;
  iconSrc?: string;
  iconBg?: string;
  iconText?: string;
  note?: string;
};

const ACCOUNT_NAME = 'Azsa Nurwahyudi';
const EWALLET_NUMBER = '085155001570';

export const payments: Payment[] = [
  {
    slug: 'bca',
    name: 'BCA',
    fullName: 'Bank Central Asia',
    category: 'bank',
    identity: '7651450083',
    identityLabel: 'Rek',
    accountName: ACCOUNT_NAME,
    iconSrc: '/icons/payments/BCA.svg',
  },
  {
    slug: 'bank-jakarta',
    name: 'Bank Jakarta',
    fullName: 'eks Bank DKI',
    category: 'bank',
    identity: '50228250298',
    identityLabel: 'Rek',
    accountName: ACCOUNT_NAME,
    iconSrc: '/icons/payments/Jakarta.svg',
  },
  {
    slug: 'seabank',
    name: 'SeaBank',
    category: 'bank',
    identity: '901856092356',
    identityLabel: 'Rek',
    accountName: ACCOUNT_NAME,
    iconSrc: '/icons/payments/SeaBank.svg',
  },
  {
    slug: 'bank-jago',
    name: 'Bank Jago',
    category: 'bank',
    identity: '109109361827',
    identityLabel: 'Rek',
    accountName: ACCOUNT_NAME,
    iconSrc: '/icons/payments/Jago.svg',
  },
  {
    slug: 'gopay',
    name: 'GoPay',
    category: 'ewallet',
    identity: EWALLET_NUMBER,
    identityLabel: 'No HP',
    accountName: ACCOUNT_NAME,
    iconSrc: '/icons/payments/Gopay.svg',
  },
  {
    slug: 'dana',
    name: 'DANA',
    category: 'ewallet',
    identity: EWALLET_NUMBER,
    identityLabel: 'No HP',
    accountName: ACCOUNT_NAME,
    iconSrc: '/icons/payments/DANA.svg',
  },
  {
    slug: 'shopeepay',
    name: 'ShopeePay',
    category: 'ewallet',
    identity: EWALLET_NUMBER,
    identityLabel: 'No HP',
    accountName: ACCOUNT_NAME,
    iconSrc: '/icons/payments/ShopeePay.svg',
  },
  {
    slug: 'paypal',
    name: 'PayPal',
    category: 'international',
    identity: 'azsa.nwhy@gmail.com',
    identityLabel: 'Email',
    accountName: ACCOUNT_NAME,
    iconSrc: '/icons/payments/PayPal.svg',
  },
];
