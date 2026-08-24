"use client";

import LinkNext from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Search,
  CreditCard,
  Menu,
  X,
  Home,
  Users,
  BookOpen,
  CalendarDays,
  MessageCircle,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const logo = "/nacos.png";

const navLinks = [
  { name: "HOME", path: "/", icon: Home },
  { name: "ABOUT", path: "/about-us", icon: Users },
  { name: "EVENTS", path: "/events", icon: CalendarDays },
  { name: "RESOURCES", path: "/resources", icon: BookOpen },
  { name: "CONTACT US", path: "/help", icon: MessageCircle },
];

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Store previous pathname to close the menu during render when route changes
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsMobileMenuOpen(false);
  }

  // Ref to monitor clicks outside the entire header component
  const headerRef = useRef<HTMLElement>(null);

  const isActive = (path: string) => pathname === path;

  // Handle scroll styling
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY > 20;
      setIsScrolled((prev) => (prev !== scrollPos ? scrollPos : prev));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on click/tap outside or Escape key
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  const handleLinkClick = () => setIsMobileMenuOpen(false);

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed w-full z-50 transition-all duration-500 left-1/2 -translate-x-1/2 max-w-7xl px-4 sm:px-6 lg:px-8 bg-transparent border-none",
        isScrolled ? "top-2" : "top-4"
      )}
    >
      <div
        className={cn(
          "transition-all duration-500 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl border px-4 backdrop-blur-md",
          isScrolled 
            ? "bg-white/95 border-primary/20 py-1" 
            : "bg-white/90 border-white/20 py-0"
        )}
      >
        <div className="h-16 flex items-center justify-between">
          <LinkNext href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 transition-transform group-hover:scale-105">
              <Image
                src={logo}
                alt="Logo"
                fill
                sizes="(max-width: 640px) 40px, 44px"
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col uppercase leading-tight text-black">
              <span className="font-bold tracking-tight text-sm sm:text-base">NACOS</span>
              <span className="font-bold tracking-tight text-black/60 text-xs sm:text-sm">FUNAAB</span>
            </div>
          </LinkNext>

          <nav className="hidden lg:flex gap-8">
            {navLinks.map((link) => (
              <LinkNext
                key={link.path}
                href={link.path}
                className={cn(
                  "uppercase whitespace-nowrap font-bold tracking-tight transition-colors relative text-sm",
                  isActive(link.path) ? "text-primary" : "text-gray-600 hover:text-primary"
                )}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full -bottom-1.5" />
                )}
              </LinkNext>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-2 sm:gap-3">
            {/* Find Receipt - Hidden on very small phones */}
            <LinkNext 
              href="/receipts" 
              className="hidden sm:flex items-center gap-2 px-4 h-10 rounded-xl bg-primary/10 text-primary font-bold text-xs transition-colors hover:bg-primary/20"
            >
              <Search className="w-3.5 h-3.5" /> Find Receipt
            </LinkNext>

            {/* Pay Dues */}
            <LinkNext 
              href="/pay" 
              className="flex items-center gap-2 px-4 h-10 rounded-xl bg-primary text-white font-bold text-xs shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 active:scale-95"
            >
              <CreditCard className="w-3.5 h-3.5" /> Pay Dues
            </LinkNext>
            
            <button
              onClick={() => setIsMobileMenuOpen((p) => !p)}
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
              className="lg:hidden flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 w-10 h-10 border border-gray-100 transition-colors hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "lg:hidden absolute top-full left-0 right-0 transition-all duration-300 mt-2 px-4",
          isMobileMenuOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-4 pointer-events-none"
        )}
      >
        <div className="bg-white/95 backdrop-blur-md border border-gray-100 shadow-2xl rounded-2xl overflow-hidden p-2">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <LinkNext
                key={link.path}
                href={link.path}
                onClick={handleLinkClick}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-xl font-bold text-sm transition-colors",
                  isActive(link.path) ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <link.icon className="w-4 h-4" /> {link.name}
              </LinkNext>
            ))}
          </div>

          {/* Quick Actions for Mobile */}
          <div className="grid grid-cols-2 gap-2 p-2 border-t mt-1">
            <LinkNext 
              href="/receipts" 
              onClick={handleLinkClick}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-50 text-gray-600 font-bold text-xs transition-colors"
            >
              <Search className="w-3.5 h-3.5" /> Receipts
            </LinkNext>
            <LinkNext 
              href="/pay" 
              onClick={handleLinkClick}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white font-bold text-xs transition-colors"
            >
              <CreditCard className="w-3.5 h-3.5" /> Pay Now
            </LinkNext>
          </div>
        </div>
      </div>
    </header>
  );
}