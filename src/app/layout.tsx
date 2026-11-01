import type { Metadata, Viewport } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'Rousseau · El origen de la desigualdad',description:'Una presentación filosófica interactiva en 17 diapositivas. Jean-Jacques Rousseau, 1755.',applicationName:'Rousseau · 1755',icons:{icon:'/icon.svg'}};
export const viewport: Viewport = {width:'device-width',initialScale:1,themeColor:'#101827'};
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return <html lang="es"><body>{children}</body></html>;
}
