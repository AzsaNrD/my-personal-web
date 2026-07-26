'use client';

import { useEffect } from 'react';
import { siteConfig } from '@/lib/site-config';

const ART = `
   ╭─────────────────────╮
   │   ◯  ──╮            │
   │   ╱    │            │
   │  ╱     │   ╲        │
   │ ╱______│____╲       │
   │      AZSA          │
   ╰─────────────────────╯
`;

export function ConsoleGreeting() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const w = window as Window & { __azsaGreeted?: boolean };
    if (w.__azsaGreeted) return;
    w.__azsaGreeted = true;

    const headingStyle =
      'color: #34d399; font-family: monospace; font-size: 12px; line-height: 1.4;';
    const titleStyle = 'color: #34d399; font-size: 18px; font-weight: bold;';
    const labelStyle = 'color: #a1a1aa; font-family: monospace;';
    const valueStyle = 'color: #fafafa; font-family: monospace;';

    console.log(`%c${ART}`, headingStyle);
    console.log(`%cHey, you found the console.`, titleStyle);
    console.log(
      `%c→ ${labelStyle.includes(';') ? '' : ''}%cIf you're peeking around, that's pretty cool.`,
      labelStyle,
      valueStyle,
    );
    console.log(' ');
    console.log(`%cwho   %c${siteConfig.name}`, labelStyle, valueStyle);
    console.log(`%cwhere %c${siteConfig.url}`, labelStyle, valueStyle);
    console.log(`%cmail  %c${siteConfig.email}`, labelStyle, valueStyle);
    console.log(`%csrc   %chttps://github.com/AzsaNrD/my-personal-web`, labelStyle, valueStyle);
    console.log(' ');
    console.log(
      `%c// got an opportunity, idea, or just want to say hi? drop a message :)`,
      'color: #e879f9; font-style: italic; font-family: monospace;',
    );
    console.log(' ');
    console.log(
      `%c⠀⠀⠀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡠⡄⠀⠀
⢰⠒⠒⢻⣿⣶⡒⠒⠒⠒⠒⠒⠒⠒⠒⠒⡶⠊⣰⣓⡒⡆
⢸⢸⢻⣭⡙⢿⣿⣍⡉⠉⡇⣯⠉⠉⣩⠋⢀⣔⠕⢫⡇⡇
⢸⢸⣈⡻⣿⣶⣽⡸⣿⣦⡇⣧⠠⠊⣸⢶⠋⢁⡤⠧⡧⡇
⢸⢸⠻⣿⣶⣝⠛⣿⣮⢻⠟⣏⣠⠞⠁⣼⡶⠋⢀⣴⡇⡇
⢸⢸⣿⣶⣍⠻⠼⣮⡕⢁⡤⢿⢁⡴⠊⣸⣵⠞⠋⢠⡇⡇
⢸⢘⣛⡻⣿⣧⢳⣿⣧⠎⢀⣾⠋⡠⠞⢱⢇⣠⡴⠟⡇⡇
⢸⢸⠹⣿⣷⣎⣉⣻⢁⡔⢁⢿⡏⢀⣤⢾⡟⠁⣀⣎⡇⡇
⢸⢸⠲⣶⣭⡛⠚⢿⢋⡔⢁⣼⠟⢋⣠⣼⠖⠋⢁⠎⡇⡇
⢸⢸⢤⣬⣛⠿⠞⣿⢋⠔⣉⣾⠖⠋⢁⣯⡴⠞⢃⠂⡇⡇
⢸⢸⠀⢙⣻⢿⣧⣾⡵⠚⣉⣯⠶⠛⣹⣧⠤⢮⠁⠀⡇⡇
⠸⣘⠢⣄⠙⠿⢷⡡⠖⣋⣽⠥⠒⣩⣟⣤⣔⣁⡤⠖⣃⠇
⠀⠀⠙⠢⢍⣻⡿⠒⢉⣴⣗⣚⣽⣋⣀⣤⣊⠥⠒⠉⠀⠀
⠀⠀⠀⢀⣔⠥⠒⢮⣙⠾⠀⠷⣚⡭⠞⠉⠛⠦⣀⠀⠀⠀
⠀⠀⠀⠉⠀⠀⠀⠀⠈⠑⠒⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀

       SHINZOU WO SASAGEYO! 心臓を捧げよ!
       (dedicate your heart ⚔)`,
      'color: #34d399; font-family: monospace; font-size: 11px; line-height: 1.05;',
    );
  }, []);

  return null;
}
