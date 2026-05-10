import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { AuthProvider } from "@/components/AuthProvider";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "TextForge AI — Generative Text Model",
  description: "Generate coherent, high-quality text on any topic using Gemini AI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            var t = localStorage.getItem('tf-theme') || 'dark';
            document.documentElement.setAttribute('data-theme', t);
          })();
        `}} />
      </head>
      <body>
        {/* AuthProvider wraps everything so useSession() works anywhere */}
        <AuthProvider>
          <Navbar />
          <div style={{ paddingTop: "56px" }}>{children}</div>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "var(--bg-2)",
                color: "var(--text-1)",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                fontFamily: "var(--font-sans)",
                fontSize: "14px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              },
              success: { iconTheme: { primary: "#D47E30", secondary: "#1A1208" } },
              error:   { iconTheme: { primary: "#E05050", secondary: "#1A1208" } },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
