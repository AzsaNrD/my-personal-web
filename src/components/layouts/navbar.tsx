import { SwitchTheme } from '../ui/switch-theme';

export function Navbar() {
  return (
    <nav className='flex justify-end mt-9'>
      <SwitchTheme />
    </nav>
  );
}
