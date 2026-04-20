import { AuthProvider } from "@/providers/AuthProvider";
import { ClientProviders } from "../providers/ClientProvider";
import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export const metadata = {
  title: "LCHSVCT-CTU | Admin",
  description: "Student Activity Management System - Admin Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ClientProviders>{children}</ClientProviders>
        </AuthProvider>
      </body>
    </html>
  );
}
