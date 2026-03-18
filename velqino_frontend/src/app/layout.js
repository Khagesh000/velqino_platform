import { Geist, Geist_Mono } from "next/font/google";
import './globals.scss'
import './tailwind.css'
import  ReduxProvider  from "@/redux/wholesaler/Provider";
import ClientOnly from "./ClientOnly";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#2563eb",
};

export const metadata = {
  title: "Veltrix Platform - Your Business Solution",
  description: "Connect with wholesalers and retailers seamlessly",
  keywords: "wholesaler, retailer, business, ecommerce, b2b",
  authors: [{ name: "Veltrix" }],
  robots: "index, follow",
  openGraph: {
    title: "Veltrix Platform",
    description: "Connect with wholesalers and retailers seamlessly",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ReduxProvider>
          <ClientOnly> {/* ✅ ALL children now protected */}
            {children}
          </ClientOnly>
        </ReduxProvider>
      </body>
    </html>
  );
}