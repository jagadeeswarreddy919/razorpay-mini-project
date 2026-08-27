'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from './logo';
import { Search, Menu, X, User, LogOut, ChevronDown } from 'lucide-react';

interface NavbarProps {
  onOpenLookup?: (initialQuery?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLookup }) => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; phoneNumber: string } | null>(null);
  const [portalsOpen, setPortalsOpen] = useState(false);

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/auth/me');
        const json = await res.json();
        if (json.success && json.user) {
          setUser(json.user);
        }
      } catch (err) {
        setUser(null);
      }
    }
    checkSession();
  }, []);

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push(`/#${id}`);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/85 border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Left: Logo */}
        <a href="/" className="flex items-center gap-2 group">
          <Logo />
        </a>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
          <button onClick={() => handleNavClick('hero')} className="text-purple-600 font-bold hover:text-purple-700 transition-colors">
            Home
          </button>
          <button onClick={() => handleNavClick('how-it-works')} className="hover:text-slate-900 transition-colors">
            How It Works
          </button>
          <button onClick={() => handleNavClick('features')} className="hover:text-slate-900 transition-colors">
            Features
          </button>
          <button onClick={() => handleNavClick('buildathon')} className="hover:text-slate-900 transition-colors">
            About Us
          </button>
          <button onClick={() => handleNavClick('faq')} className="hover:text-slate-900 transition-colors">
            FAQ
          </button>
        </nav>

        {/* Right: CTA Actions */}
        <div className="hidden lg:flex items-center gap-3">
          
          {/* Portals Dropdown Pill */}
          <div className="relative">
            <button
              onClick={() => setPortalsOpen(!portalsOpen)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-full shadow-sm flex items-center gap-1.5 transition-all"
            >
              Portals <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {portalsOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 text-xs font-semibold text-slate-700">
                <button
                  onClick={() => { setPortalsOpen(false); router.push('/customer'); }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-blue-600" /> Customer Center
                </button>
                <button
                  onClick={() => { setPortalsOpen(false); router.push('/support'); }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                >
                  <Search className="w-4 h-4 text-purple-600" /> Support Desk
                </button>
              </div>
            )}
          </div>

          {user ? (
            <>
              <button
                onClick={() => router.push('/customer')}
                className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-full shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all hover:scale-105"
              >
                <User className="w-4 h-4" />
                Payment Center
              </button>
              <button
                onClick={handleLogout}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 border border-slate-200 rounded-full flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5 text-slate-400" />
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => router.push('/login')}
              className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-full shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all hover:scale-105"
            >
              Track My Payment →
            </button>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 border-b border-slate-200 px-6 py-6 space-y-4 backdrop-blur-xl animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-3 text-sm font-semibold text-slate-700">
            <button onClick={() => handleNavClick('hero')} className="text-left py-2 text-purple-600 font-bold">
              Home
            </button>
            <button onClick={() => handleNavClick('how-it-works')} className="text-left py-2 hover:text-slate-900">
              How It Works
            </button>
            <button onClick={() => handleNavClick('features')} className="text-left py-2 hover:text-slate-900">
              Features
            </button>
            <button onClick={() => handleNavClick('buildathon')} className="text-left py-2 hover:text-slate-900">
              About Us
            </button>
            <button onClick={() => handleNavClick('faq')} className="text-left py-2 hover:text-slate-900">
              FAQ
            </button>
          </div>

          <div className="pt-4 border-t border-slate-200 flex flex-col gap-3">
            <button
              onClick={() => { setMobileMenuOpen(false); router.push('/customer'); }}
              className="w-full py-3 text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center gap-2"
            >
              Customer Center
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); router.push('/support'); }}
              className="w-full py-3 text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center gap-2"
            >
              Support Desk
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); router.push('/login'); }}
              className="w-full py-3 text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full shadow-md flex items-center justify-center gap-2"
            >
              Track My Payment →
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
