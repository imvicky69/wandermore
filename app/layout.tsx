import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { AuthContextProvider } from "./context/AuthContext"; // <-- 1. IMPORT

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Wandermore",
  description: "Two friends, one journey.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContextProvider> {/* <-- 2. WRAP YOUR COMPONENTS */}
          <Navbar />
          <main className="max-w-5xl mx-auto px-4 py-8">
            {children}
          </main>
        </AuthContextProvider> {/* <-- 3. CLOSE THE WRAPPER */}
      </body>
    </html>
  );
}