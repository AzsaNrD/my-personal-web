// Dark is the fallback when nothing is saved; keep it in sync with DEFAULT_THEME in theme-provider.
const SCRIPT = `(function(){try{var t=localStorage.getItem('theme');var r=t==='dark'||t==='light'?t:'dark';document.documentElement.classList.toggle('dark',r==='dark');document.documentElement.style.colorScheme=r;}catch(e){document.documentElement.classList.add('dark');}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
