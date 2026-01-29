import "./globals.css";

export const metadata = {
  title: "Carmah",
  description: "Design engineer portfolio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
