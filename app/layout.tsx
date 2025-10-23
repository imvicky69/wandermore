import "./globals.css";
import Navbar from "./components/Navbar";
import { AuthContextProvider } from "./context/AuthContext";

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
      <body>
        <AuthContextProvider>
          <Navbar />
          <main className="max-w-5xl mx-auto px-4 py-8">
            {children}
          </main>
        </AuthContextProvider>
      </body>
    </html>
  );
}