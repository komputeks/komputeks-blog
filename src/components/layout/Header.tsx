'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Sun, Moon, Monitor, User, LogOut, Settings, PenTool } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';
import { useAuth } from '@/providers/AuthProvider';
import { mainNav, siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { user, signOut, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <PenTool className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">{siteConfig.shortName}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <div className="relative">
              <button
                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                className="p-2 rounded-md hover:bg-accent transition-colors"
                aria-label="Toggle theme"
              >
                {resolvedTheme === 'dark' ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </button>
              {themeMenuOpen && (
                <div className="absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-popover border">
                  <div className="py-1">
                    <button
                      onClick={() => { setTheme('light'); setThemeMenuOpen(false); }}
                      className={cn(
                        'flex items-center w-full px-4 py-2 text-sm hover:bg-accent',
                        theme === 'light' && 'bg-accent'
                      )}
                    >
                      <Sun className="h-4 w-4 mr-2" /> Light
                    </button>
                    <button
                      onClick={() => { setTheme('dark'); setThemeMenuOpen(false); }}
                      className={cn(
                        'flex items-center w-full px-4 py-2 text-sm hover:bg-accent',
                        theme === 'dark' && 'bg-accent'
                      )}
                    >
                      <Moon className="h-4 w-4 mr-2" /> Dark
                    </button>
                    <button
                      onClick={() => { setTheme('system'); setThemeMenuOpen(false); }}
                      className={cn(
                        'flex items-center w-full px-4 py-2 text-sm hover:bg-accent',
                        theme === 'system' && 'bg-accent'
                      )}
                    >
                      <Monitor className="h-4 w-4 mr-2" /> System
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            {!loading && (
              <div className="relative">
                {user ? (
                  <>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent transition-colors"
                    >
                      {user.user_metadata?.avatar_url ? (
                        <img
                          src={user.user_metadata.avatar_url}
                          alt={user.user_metadata?.name || 'User'}
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                          <User className="h-4 w-4" />
                        </div>
                      )}
                    </button>
                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-popover border">
                        <div className="py-1">
                          <Link
                            href="/profile"
                            className="flex items-center px-4 py-2 text-sm hover:bg-accent"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <User className="h-4 w-4 mr-2" /> Profile
                          </Link>
                          <Link
                            href="/admin"
                            className="flex items-center px-4 py-2 text-sm hover:bg-accent"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Settings className="h-4 w-4 mr-2" /> Dashboard
                          </Link>
                          <button
                            onClick={() => { signOut(); setUserMenuOpen(false); }}
                            className="flex items-center w-full px-4 py-2 text-sm hover:bg-accent text-red-600"
                          >
                            <LogOut className="h-4 w-4 mr-2" /> Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="text-sm font-medium px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-accent transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
