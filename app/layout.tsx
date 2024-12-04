import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Provider from "./components/WagmiProvider";
import Navbar from "./components/Navbar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const appUrl = "https://tickertool.xyz";

const frame = {
  version: "next",
  imageUrl: `${appUrl}/og-image.png`,
  button: {
    title: "Deploy Token",
    action: {
      type: "launch_frame",
      name: "Ticker Tool",
      url: appUrl,
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#1f1f1f",
    },
  },
};

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Ticker Tool | Uniswap Liquidity Farm",
    description: "Create, launch and earn uniswap liquidity fee from your own memecoin with no cut by protocol",
    openGraph: {
      title: "Ticker Tool | Uniswap Liquidity Farm",
      description: "Create, launch and earn uniswap liquidity fee from your own memecoin with no cut by protocol",
      url: "https://tickertool.xyz",
      images: [
        {
          url: "https://tickertool.xyz/og-image.png",
          width: 1200,
          height: 600,
          alt: "Ticker Tool",
        },
      ],
      siteName: 'Ticker Tool',
    },
    twitter: {
      card: 'summary_large_image',
      title: "Ticker Tool | Uniswap Liquidity Farm",
      description: "Create, launch and earn uniswap liquidity fee from your own memecoin with no cut by protocol",
      images: ["https://tickertool.xyz/og-image.png"],
    },
    icons: "/favicon.ico",
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-mono antialiased bg-[#1f1f1f] text-white`}
      >

        <Provider>
          <Navbar />
          <main>{children}</main>
          <footer className="text-center pt-10">
            <p>
              &copy; {new Date().getFullYear()} Built with ❤ By{" "}
              <span className="font-semibold"><a target="_blank" href="https://warpcast.com/joebaeda" className="text-blue-600">Joebada</a></span>
            </p>
          </footer>
        </Provider>

      </body>
    </html>
  );
}
