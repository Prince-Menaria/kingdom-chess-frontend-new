import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/providers";
export const metadata: Metadata = {
  title: "Kingdom Chess | Play. Learn. Compete.",
  description: "A modern online chess tournament platform.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
