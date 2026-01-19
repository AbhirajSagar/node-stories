import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"] });

export const metadata = { title: "Azuned" };

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${outfit.variable} antialiased`}>{children}</body>
        </html>
    );
}
