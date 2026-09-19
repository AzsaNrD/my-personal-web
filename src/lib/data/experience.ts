export type ExperienceItem = {
  slug: string;
  type: 'work' | 'education' | 'program';
  role: string;
  org: string;
  /** Sub-unit or department, shown as a secondary line under org. */
  orgDetail?: string;
  description?: string;
  location?: string;
  period: string;
  current?: boolean;
};

export const experience: ExperienceItem[] = [
  {
    slug: 'bssn-internship',
    type: 'work',
    role: 'Programmer / IT Engineer',
    org: 'Badan Siber dan Sandi Negara (BSSN)',
    orgDetail:
      'Direktorat Keamanan Siber dan Sandi Teknologi Informasi dan Komunikasi, Media, dan Transportasi, Deputi Bidang Keamanan Siber dan Sandi Perekonomian',
    location: 'Depok, Jawa Barat',
    period: 'Sep 2026 - Present',
    current: true,
  },
  {
    slug: 'gunadarma',
    type: 'education',
    role: 'Sistem Informasi',
    org: 'Universitas Gunadarma',
    location: 'Depok, Jawa Barat',
    period: '2022 - 2026',
  },
  {
    slug: 'asah-dicoding',
    type: 'program',
    role: 'Machine Learning Cohort',
    org: 'Asah led by Dicoding',
    description:
      'Participating in the Asah 2025 Machine Learning program, focusing on foundational concepts of machine learning, data processing using Python, and the practical application of AI algorithms for technology-based industry use cases.',
    period: 'Aug 2025 - Jan 2026 · 6 mos',
  },
];
