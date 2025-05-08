'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { User } from 'next-auth';
import { MessageSquare, Shield, Menu, X, LogOut, User as UserIcon } from 'lucide-react';

function Navbar() {
  const { data: session } = useSession();
  const user : User = session?.user;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="gradient-bg shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href={session ? '/dashboard' : '/'} className="text-white text-xl font-bold tracking-wider flex items-center space-x-2">
            <span>Mystery Message</span>
          </Link>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop navigation */}
          {session ? (
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/dashboard" className="flex items-center text-white hover:text-white/80 transition-colors">
                <MessageSquare className="mr-1.5 h-4 w-4" />
                <span>Messages</span>
              </Link>
              <Link href="/blocked-ips" className="flex items-center text-white hover:text-white/80 transition-colors">
                <Shield className="mr-1.5 h-4 w-4" />
                <span>Blocked IPs</span>
              </Link>
              <div className="flex items-center pl-6 border-l border-white/20">
                <span className="text-white mr-4 flex items-center">
                  <UserIcon className="h-4 w-4 mr-1.5" />
                  {user.username || user.email}
                </span>
                <Button 
                  onClick={() => signOut()} 
                  className="bg-white/20 text-white hover:bg-white/30 transition-colors"
                  size="sm"
                  variant="ghost"
                >
                  <LogOut className="h-4 w-4 mr-1.5" />
                  Logout
                </Button>
              </div>
            </div>
          ) : (
            <div className="hidden md:block">
              <Link href="/sign-in">
                <Button className="bg-white/20 text-white hover:bg-white/30" variant="ghost">
                  Login
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-3">
            {session ? (
              <>
                <Link href="/dashboard" className="flex items-center text-white py-2" onClick={toggleMenu}>
                  <MessageSquare className="mr-2 h-5 w-5" />
                  <span>Messages</span>
                </Link>
                <Link href="/blocked-ips" className="flex items-center text-white py-2" onClick={toggleMenu}>
                  <Shield className="mr-2 h-5 w-5" />
                  <span>Blocked IPs</span>
                </Link>
                <div className="pt-2 border-t border-white/20 mt-2">
                  <div className="text-white py-2 flex items-center">
                    <UserIcon className="mr-2 h-5 w-5" />
                    {user.username || user.email}
                  </div>
                  <Button 
                    onClick={() => {
                      signOut();
                      toggleMenu();
                    }} 
                    className="w-full justify-start text-white bg-white/10 hover:bg-white/20"
                    variant="ghost"
                  >
                    <LogOut className="mr-2 h-5 w-5" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <Link href="/sign-in" onClick={toggleMenu}>
                <Button className="w-full justify-start text-white bg-white/10 hover:bg-white/20" variant="ghost">
                  Login
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
