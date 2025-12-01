import { ReactNode } from "react";
import { Header } from "./Header";
import { BottomNavigation } from "./BottomNavigation";

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showBottomNav?: boolean;
}

export function Layout({ 
  children, 
  showHeader = true, 
  showBottomNav = true 
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {showHeader && <Header />}
      
      <main className={showBottomNav ? "pb-20 md:pb-0" : ""}>
        {children}
      </main>
      
      {showBottomNav && <BottomNavigation />}
    </div>
  );
}
