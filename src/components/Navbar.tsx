"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plane, Menu, X, Globe } from "lucide-react";
import { useState } from "react";

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिंदी" },
  { code: "ta", name: "தமிழ்" },
  { code: "te", name: "తెలుగు" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState("en");

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/plan", label: "Plan Trip" },
    { href: "/booking", label: "Bookings" },
    { href: "/guide", label: "Local Guide" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-sky-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
              TripWise
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-sky-600"
                    : "text-slate-600 hover:text-sky-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-slate-600 hover:bg-sky-50 transition-colors">
                <Globe className="w-4 h-4" />
                <span className="text-sm hidden sm:inline">
                  {languages.find((l) => l.code === language)?.name}
                </span>
              </button>
              <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-sky-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`w-full px-4 py-2 text-sm text-left hover:bg-sky-50 first:rounded-t-lg last:rounded-b-lg ${
                      language === lang.code ? "text-sky-600 bg-sky-50" : "text-slate-600"
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-sky-50"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-sky-100">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block px-6 py-3 text-sm font-medium ${
                pathname === link.href
                  ? "text-sky-600 bg-sky-50"
                  : "text-slate-600 hover:bg-sky-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
