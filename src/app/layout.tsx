import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "Spiritual Results — Learn from thousands of years of wisdom",
  description:
    "A safe, soothing space for spiritual growth and cross-faith dialogue. Learn from Christianity, Islam, Buddhism, Sufism, Hinduism, and more — at your own pace.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://spiritualresults.org",
  ),
  openGraph: {
    title: "Spiritual Results",
    description: "Connect with ancient wisdom. Modern format. Your pace.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#B8893C",
          colorBackground: "#FFFFFF",
          colorText: "#2A2218",
          colorTextSecondary: "#5C4F3D",
          colorInputBackground: "#FAF7EE",
          colorInputText: "#2A2218",
          colorNeutral: "#2A2218",
          borderRadius: "0.5rem",
          fontFamily: "Inter, system-ui, sans-serif",
        },
        elements: {
          card: "shadow-md border border-[#E8DFC6]",
          formButtonPrimary:
            "bg-[#B8893C] hover:bg-[#A07728] text-white font-medium",
        },
      }}
    >
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
