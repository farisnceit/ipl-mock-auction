import { Metadata } from 'next';

export const siteConfig = {
  name: "IPL Auction 2025",
  description: "Interactive IPL auction simulation with AI-powered bidding, real-time updates, and modern UI. Experience the thrill of the IPL auction!",
  url: "https://ipl-mock-auction.netlify.app",
  ogImage: "https://ipl-mock-auction.netlify.app/og-image.png",
  links: {
    //twitter: "https://twitter.com/iplauction",
    github: "https://github.com/farisnceit/ipl-mock-auction",
  },
};

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "IPL",
    "Auction",
    "Cricket",
    "IPL 2025",
    "Cricket Auction",
    "Fantasy Cricket",
    "Cricket Game",
    "IPL Teams",
    "Cricket Players",
    "Auction Simulation",
  ],
  authors: [
    {
      name: "Mohamed Fariz",
      url: "https://github.com/farisnceit",
    },
  ],
  creator: "Mohamed Fariz",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "IPL Auction 2025",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-site-verification",
  },
}; 