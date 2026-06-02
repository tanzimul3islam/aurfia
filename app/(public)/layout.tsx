import CookieBanner from "@/components/CookieBanner";
import Footer from "@/components/footer";
import Header from "@/components/header";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div>
        
          <div className="min-h-dvh flex flex-col">
          <Header />
          <main className="flex-1 p-8">{children}</main>
           <Footer />
          <CookieBanner /> 
        </div>
      </div>
  );
}
