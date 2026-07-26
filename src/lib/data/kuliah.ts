export type SemesterMateri = {
  semester: number;
  label?: string;
  driveUrl: string;
};

export type ResourceLink = {
  slug: string;
  name: string;
  description?: string;
  url: string;
};

export const meta = {
  prodi: 'Sistem Informasi',
  university: 'Universitas Gunadarma',
  angkatan: 2022,
  kelas: '4KA17',
  totalSemester: 8,
  kampus: 'Kampus Depok',
};

export const materi: SemesterMateri[] = [
  {
    semester: 1,
    driveUrl:
      'https://drive.google.com/drive/folders/110-JMqAHFl8Ia_JeMwLLU6gbL0rA3bXO?usp=drive_link',
  },
  {
    semester: 2,
    driveUrl:
      'https://drive.google.com/drive/folders/1oPYXhVXjd5VnfElxip5NqRABt_-RI207?usp=drive_link',
  },
  {
    semester: 3,
    driveUrl:
      'https://drive.google.com/drive/folders/1umgJI2REjFA1bVNMKr3VSI84AmZT8yWO?usp=drive_link',
  },
  {
    semester: 4,
    driveUrl:
      'https://drive.google.com/drive/folders/10DFuHob32RXtyCgfAC7hSO8OXiUWo7ST?usp=drive_link',
  },
  {
    semester: 5,
    driveUrl:
      'https://drive.google.com/drive/folders/10E1MNwgchpNfS2TDmX0aX48euhEZlRJK?usp=drive_link',
  },
  {
    semester: 6,
    driveUrl:
      'https://drive.google.com/drive/folders/10EjKIzOAk3ZZDMFjvKC_2xQXPc6-pIk4?usp=drive_link',
  },
  {
    semester: 7,
    driveUrl:
      'https://drive.google.com/drive/folders/10IRYUXVBAHNJHH98MRnTVZgaONAxcmIh?usp=drive_link',
  },
  {
    semester: 8,
    driveUrl:
      'https://drive.google.com/drive/folders/10FzLHdFOeQeGdm20LVTJd012BLYKIsRM?usp=drive_link',
  },
];

export const resources: ResourceLink[] = [
  {
    slug: 'pedoman-skripsi',
    name: 'Pedoman Skripsi',
    description: 'Panduan TA · PDF',
    url: 'https://drive.google.com/file/d/1NTRX7Qr_xMeWL2s5Zm2n66U5LOoPAJcu/view',
  },
  {
    slug: 'baak',
    name: 'BAAK Gunadarma',
    description: 'Akademik & administrasi',
    url: 'https://baak.gunadarma.ac.id/',
  },
  {
    slug: 'jurusan-si',
    name: 'Jurusan Sistem Informasi',
    description: 'Web jurusan SI · FIKTI',
    url: 'https://fikti.gunadarma.ac.id/sisinformasi/',
  },
  {
    slug: 'vclass',
    name: 'V-Class',
    description: 'Platform pembelajaran online',
    url: 'https://v-class.gunadarma.ac.id/',
  },
];
