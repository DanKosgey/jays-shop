import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ChatWidget } from "@/components/chat-widget";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
