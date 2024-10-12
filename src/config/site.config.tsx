// /src/config/site.config.tsx
import { Metadata } from 'next';
import logoImg from '@public/ko_gear_250x@2x.png';
import { LAYOUT_OPTIONS } from '@/config/enums';
import { OpenGraph } from 'next/dist/lib/metadata/types/opengraph-types';

enum MODE {
  DARK = 'dark',
  LIGHT = 'light',
}

export const siteConfig = {
  title: 'Ko Gear',
  description: `We promote our athletes and our brands by organizing mega sports events, international championships, and strong retail network.`,
  logo: logoImg,
  icon: logoImg,
  mode: MODE.LIGHT,
  layout: LAYOUT_OPTIONS.HYDROGEN,
  // TODO: favicon
};

export const metaObject = (
  title?: string,
  openGraph?: OpenGraph,
  description: string = siteConfig.description
): Metadata => {
  return {
    title: title ? `${title} - Ko Gear` : siteConfig.title,
    description,
    openGraph: openGraph ?? {
      title: title ? `${title} - Ko Gear dashboard` : siteConfig.title,
      description,
      siteName: 'Ko Gear', // https://developers.google.com/search/docs/appearance/site-names
      images: {
        url: logoImg.src,
        width: 1200,
        height: 630,
      },
      locale: 'en_US',
      type: 'website',
    },
  };
};
