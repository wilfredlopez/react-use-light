import { useState, useEffect } from 'react';
import { createGlobalStyle, removeGlobalStyle } from './util/createGlobalStyle';

/**
 * toggle between theme styles.
 * @param {'light' | 'dark'} initial
 * @param {string | Record<string, React.CSSProperties>} dark
 * @param {string | Record<string, React.CSSProperties>} light
 * @example
 * const [theme, setTheme, toggleTheme] = useThemeStyles('light', `:root{--app-color: black;}`, `:root{--app-color: white;}`)
 */
export function useThemeStyles(
  initial: 'light' | 'dark',
  dark: string | Record<string, React.CSSProperties>,
  light: string | Record<string, React.CSSProperties>
) {
  const [theme, setTheme] = useState<'light' | 'dark'>(initial);
  const [tagId, setTagId] = useState('');

  useEffect(() => {
    const style = theme === 'dark' ? dark : light;
    removeGlobalStyle(tagId);
    const id = createGlobalStyle(style);
    setTagId(id);
    return () => {
      removeGlobalStyle(id);
    };
  }, [theme, tagId, dark, light]);

  function getToggleThemeString() {
    if (theme === 'dark') {
      return 'light';
    } else {
      return 'dark';
    }
  }

  function toggleTheme() {
    setTheme(getToggleThemeString());
  }

  return [theme, setTheme, toggleTheme] as const;
}
