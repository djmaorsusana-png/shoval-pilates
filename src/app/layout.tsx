import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  subsets: ["latin", "hebrew"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-heebo",
});

export const metadata: Metadata = {
  title: "Pilates by Shoval",
  description: "מערכת ניהול לקוחות - פילאטיס בשובל",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={heebo.variable}>
      <body className={`${heebo.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
