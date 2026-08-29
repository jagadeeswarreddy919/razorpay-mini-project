'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from './logo';
import { Search, Menu, X, User, LogOut, ChevronDown, Activity, Building2, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onOpenLookup?: (initialQuery?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLookup }) => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; phoneNumber: string } | null>(null);
  const [portalsOpen, setPortalsOpen] = useState(false);

  const [activeSection, setActiveSection] = useState<string>('hero');

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

  useEffect(() => {
    const sectionIds = ['hero', 'how-it-works', 'features', 'buildathon', 'faq'];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140; // navbar offset
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(id);
            return;
          }
        }
      }
      setActiveSection('hero');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'hero', label: 'Home' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'features', label: 'Features' },
    { id: 'buildathon', label: 'About Us' },
    { id: 'faq', label: 'FAQ' },
  ];

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80; // sticky header height offset
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
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
        <nav className="hidden md:flex items-center gap-1.5 p-1 bg-slate-100/80 border border-slate-200/70 rounded-full text-xs font-semibold">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-4 py-1.5 rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-purple-700 font-bold shadow-sm border border-slate-200/80 scale-[1.02]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {link.label}
              </button>
            );
          })}
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
              <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 text-xs font-semibold text-slate-700">
                <button
                  onClick={() => { setPortalsOpen(false); router.push('/customer'); }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-blue-600" /> Customer Payment Center
                </button>
                <button
                  onClick={() => { setPortalsOpen(false); router.push('/support'); }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-purple-600" /> Support Desk Portal
                </button>
                <button
                  onClick={() => { setPortalsOpen(false); router.push('/operations'); }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                >
                  <Activity className="w-4 h-4 text-emerald-600" /> Operations Desk
                </button>
                <button
                  onClick={() => { setPortalsOpen(false); router.push('/merchant'); }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                >
                  <Building2 className="w-4 h-4 text-amber-600" /> Merchant Resolution Portal
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
          <div className="flex flex-col space-y-1 text-sm font-semibold text-slate-700">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-left px-4 py-2 rounded-xl transition-all ${
                    isActive
                      ? 'bg-purple-50 text-purple-700 font-bold border border-purple-200'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-200 flex flex-col gap-2">
            <button
              onClick={() => { setMobileMenuOpen(false); router.push('/customer'); }}
              className="w-full py-2.5 text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4 text-blue-600" /> Customer Center
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); router.push('/support'); }}
              className="w-full py-2.5 text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-purple-600" /> Support Desk
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); router.push('/operations'); }}
              className="w-full py-2.5 text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center gap-2"
            >
              <Activity className="w-4 h-4 text-emerald-600" /> Operations Desk
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); router.push('/merchant'); }}
              className="w-full py-2.5 text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center gap-2"
            >
              <Building2 className="w-4 h-4 text-amber-600" /> Merchant Portal
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); router.push('/login'); }}
              className="w-full py-3 text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full shadow-md flex items-center justify-center gap-2 mt-2"
            >
              Track My Payment →
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
