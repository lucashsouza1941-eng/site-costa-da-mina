// Fontes servidas pelo próprio site (next/font baixa no build; nenhuma
// chamada ao Google no navegador).
import { Barlow, Barlow_Condensed, Caveat, Inter } from 'next/font/google';

export const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-barlow-condensed',
  display: 'swap',
});

export const barlow = Barlow({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-barlow',
  display: 'swap',
});

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const caveat = Caveat({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-caveat',
  display: 'swap',
});

export const classesDasFontes = [barlowCondensed.variable, barlow.variable, inter.variable, caveat.variable].join(' ');
