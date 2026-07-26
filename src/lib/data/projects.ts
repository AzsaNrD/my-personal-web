export type Project = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  repo?: string;
  demo?: string;
};

export const projects: Project[] = [
  {
    slug: 'tempe',
    title: 'TEMPE',
    description:
      'Tugas Emang Perlu Dikerjain. A task and lecture-material manager built for a Human-Computer Interaction course project.',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL'],
    repo: 'https://github.com/AzsaNrD/TEMPE',
    demo: 'https://tempe-two.vercel.app/',
  },
  {
    slug: 'ru-d1-bot',
    title: 'RU-D1 Discord Bot',
    description:
      'Real-time attendance tracker for Minilemon Studio, integrated with our Discord server and backed by MongoDB.',
    tags: ['Node.js', 'Discord.js', 'MongoDB'],
  },
  {
    slug: 'forum-app',
    title: 'Forum App',
    description:
      "Final submission for Dicoding's 'Becoming React Web Developer Expert', featuring Redux state management, Cypress E2E tests, and Storybook component docs.",
    tags: ['React', 'Redux', 'Cypress', 'Storybook'],
    repo: 'https://github.com/AzsaNrD/forum-app',
    demo: 'https://forum-app-sooty.vercel.app/',
  },
  {
    slug: 'apex-stat',
    title: 'Apex Stat',
    description:
      'Look up Apex Legends player stats by username. Built with React and the Apex Legends Status API.',
    tags: ['React', 'API'],
    repo: 'https://github.com/AzsaNrD/apexstat',
    demo: 'https://azsanrd.github.io/apexstat/',
  },
];
