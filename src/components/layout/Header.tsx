import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Search, User, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/shared/SearchBar";
import { HamburgerMenu } from "./HamburgerMenu";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-semibold text-foreground">
            Karwan Auliya
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link 
            to="/categories" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Categories
          </Link>
          <Link 
            to="/books/general" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Books
          </Link>
          <Link 
            to="/books/islamic" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Islamic Books
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Search Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="text-muted-foreground hover:text-primary"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Profile */}
          <Link to="/login">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-primary"
            >
              <User className="h-5 w-5" />
            </Button>
          </Link>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(true)}
            className="text-muted-foreground hover:text-primary md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Search Bar (Expandable) */}
      {isSearchOpen && (
        <div className="border-t border-border/40 bg-card px-4 py-3 animate-slide-up">
          <SearchBar 
            onSearch={(query) => {
              console.log("Search:", query);
              setIsSearchOpen(false);
            }}
            placeholder="Search books, authors, categories..."
          />
        </div>
      )}

      {/* Mobile Menu */}
      <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
}
