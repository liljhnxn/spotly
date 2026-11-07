import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Spotly — Find Places. Share Experiences.",
  description:
    "A decentralized place-discovery platform where users share interesting places, hidden gems, and locations worth visiting on Botchain.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-spotly-bg text-spotly-text antialiased selection:bg-spotly-coral selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

