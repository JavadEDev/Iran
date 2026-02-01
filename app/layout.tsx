import type { Metadata } from "next";
import "../styles/globals.css";
import { ToastProvider } from "@/components/ToastProvider";

export const metadata: Metadata = {
  title: "Iranian Revolution Memorial",
  description: "A bilingual memorial and documentation website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
