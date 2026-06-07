import CookieBanner from "@/components/CookieBanner";
import DiscountBanner from "@/components/DiscountBanner";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { ChatWidget } from "@/components/chat/chat-widget";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className="min-h-dvh flex flex-col">
        <div className="sticky top-0 z-50">
          <DiscountBanner />
          <Header />
        </div>
        <main className="flex-1 p-4 md:p-8">{children}</main>
        <Footer />
        <CookieBanner /> 
      </div>
      <ChatWidget />
    </div>
  );
}
