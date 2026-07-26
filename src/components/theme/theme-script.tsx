// Dark is the intended look of this theme, so it wins when the visitor has no
// saved preference. Change the fallback to `s` to follow the OS setting instead.
const SCRIPT = `(function(){try{var t=localStorage.getItem('theme');var r=t==='dark'||t==='light'?t:'dark';document.documentElement.classList.toggle('dark',r==='dark');document.documentElement.style.colorScheme=r;}catch(e){document.documentElement.classList.add('dark');}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
