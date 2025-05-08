'use client'

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { User } from 'next-auth';
import { MessageSquare, Shield } from 'lucide-react';

function Navbar() {
  const { data: session } = useSession();
  const user : User = session?.user;

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link href={session ? '/dashboard' : '/'} className="text-xl font-bold mb-4 md:mb-0">
          Mystery Message
        </Link>
        
        {session ? (
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
            <div className="flex space-x-4">
              <Link href="/dashboard" className="flex items-center hover:text-gray-300">
                <MessageSquare className="mr-1 h-4 w-4" />
                Messages
              </Link>
              <Link href="/blocked-ips" className="flex items-center hover:text-gray-300">
                <Shield className="mr-1 h-4 w-4" />
                Blocked IPs
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <span>
                Welcome, {user.username || user.email}
              </span>
              <Button onClick={() => signOut()} className="w-full md:w-auto bg-slate-100 text-black" variant='outline'>
                Logout
              </Button>
            </div>
          </div>
        ) : (
          <Link href="/sign-in">
            <Button className="w-full md:w-auto bg-slate-100 text-black" variant={'outline'}>Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
