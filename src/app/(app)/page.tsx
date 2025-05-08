'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MessageSquare, Shield, Lock, UserRound, Sparkles, ChevronRight, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center py-24 md:py-32 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/5 to-background"></div>
        
        {/* Animated background dots */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute w-full h-full" style={{ 
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)', 
            backgroundSize: '30px 30px' 
          }}></div>
        </div>
        
        <div className="container px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-glow">
              Anonymity Meets Connection
            </h1>
            <p className="text-lg md:text-xl mb-10 text-muted-foreground">
              Send and receive anonymous messages without revealing your identity. 
              Get honest feedback and engage in meaningful conversations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  Get Started <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Mystery Message?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="subtle-card card-hover">
              <CardHeader>
                <Lock className="h-12 w-12 text-primary mb-4" />
                <CardTitle>100% Anonymous</CardTitle>
                <CardDescription>Your identity is completely protected. Send messages without revealing who you are.</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="subtle-card card-hover">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Full Control</CardTitle>
                <CardDescription>Block unwanted messages and control who can contact you.</CardDescription>
              </CardHeader>
            </Card>

            <Card className="subtle-card card-hover">
              <CardHeader>
                <Sparkles className="h-12 w-12 text-primary mb-4" />
                <CardTitle>AI Suggestions</CardTitle>
                <CardDescription>Get AI-powered message suggestions when you're stuck for words.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials/Examples Section */}
      <section className="py-16 md:py-24 bg-secondary/5">
        <div className="container px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What People Are Saying</h2>
          
          <Carousel
            plugins={[Autoplay({ delay: 3000 })]}
            className="w-full max-w-4xl mx-auto"
            opts={{
              loop: true,
            }}
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2 p-4">
                  <Card className="h-full subtle-card border-primary/10">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <UserRound className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">{message.title}</CardTitle>
                      </div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-4 w-4 fill-primary text-primary" />
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="italic">"{message.content}"</p>
                    </CardContent>
                    <CardFooter>
                      <p className="text-xs text-muted-foreground">{message.received}</p>
                    </CardFooter>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-2 mt-8">
              <CarouselPrevious variant="ghost" />
              <CarouselNext variant="ghost" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-primary/5 to-background"></div>
        <div className="container px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-lg mb-8 text-muted-foreground">
              Create your account in seconds and start sending and receiving anonymous messages today.
            </p>
            <Link href="/sign-up">
              <Button size="lg" className="px-8">
                Create Your Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-xl font-bold mb-4 md:mb-0">Mystery Message</div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Mystery Message. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
