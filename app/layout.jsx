import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "Carmah",
  description: "Design engineer portfolio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
