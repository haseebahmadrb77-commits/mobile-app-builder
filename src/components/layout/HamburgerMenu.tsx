import { X, Settings, Bookmark, HelpCircle, Info, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { to: "/settings", icon: Settings, label: "Settings" },
  { to: "/bookmarks", icon: Bookmark, label: "Bookmarks" },
  { to: "/help", icon: HelpCircle, label: "Help & Support" },
  { to: "/about", icon: Info, label: "About" },
];

export function HamburgerMenu({ isOpen, onClose }: HamburgerMenuProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-72 bg-card">
        <SheetHeader>
          <SheetTitle className="font-display text-lg">Menu</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 flex flex-col gap-1">
          {menuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </div>

        <Separator className="my-4" />

        <Button
          variant="ghost"
          className="w-full justify-start gap-3 px-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => {
            // TODO: Implement logout
            onClose();
          }}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </SheetContent>
    </Sheet>
  );
}
