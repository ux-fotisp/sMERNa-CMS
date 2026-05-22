"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, FileText, Briefcase, Tag } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate data loading
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load data. Please try again later.");
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-background p-4">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="py-6 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary flex items-center">
            <span className="text-3xl mr-2">🐍</span> sMERNa CMS
          </h1>
          <nav>
            <ul className="flex space-x-4">
              <li><Link href="/login" className="text-primary hover:text-primary/80">Login</Link></li>
              <li><Link href="/register" className="text-primary hover:text-primary/80">Register</Link></li>
              <li><Link href="/explore/listings" className="text-primary hover:text-primary/80">Public Listings</Link></li>
              <li><Link href="/dummy-content" className="text-primary hover:text-primary/80">Dummy Content</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex space-x-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        ) : (
          <>
            <section className="mb-16 relative">
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path d="M50 10 C 80 10, 80 50, 50 50 C 20 50, 20 90, 50 90" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </div>
              <h2 className="text-4xl font-bold mb-8 text-center">Welcome to sMERNa CMS</h2>
              <p className="text-xl text-center mb-8">A slithering Content Management System built with the MERN stack.</p>
              <div className="flex justify-center space-x-4">
                <Link href="/login">
                  <Button size="lg">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </Link>
                <Link href="/explore/listings">
                  <Button variant="outline" size="lg">Browse Listings</Button>
                </Link>
              </div>
            </section>

            <section className="grid md:grid-cols-3 gap-8 mb-16">
              <Card className="bg-card text-card-foreground border-2 border-primary">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-6 w-6" />
                    Blogging
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Create and manage your blog posts with ease. Organize content with categories and tags.</p>
                </CardContent>
              </Card>
              <Card className="bg-card text-card-foreground border-2 border-primary">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Briefcase className="mr-2 h-6 w-6" />
                    Business
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Manage your business content, products, and services all in one place.</p>
                </CardContent>
              </Card>
              <Card className="bg-card text-card-foreground border-2 border-primary">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Tag className="mr-2 h-6 w-6" />
                    Taxonomy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Organize your content with a flexible taxonomy system including categories and tags.</p>
                </CardContent>
              </Card>
            </section>

            <section className="text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to slither into content management?</h2>
              <p className="mb-8">Join our pit and start creating content today.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/register">
                  <Button size="lg">Sign Up Now</Button>
                </Link>
                <Link href="/explore/listings">
                  <Button variant="outline" size="lg">See Public Listings</Button>
                </Link>
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="bg-card text-card-foreground py-8 mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2023 sMERNa CMS. All rights reserved. 🐍</p>
        </div>
      </footer>
    </div>
  );
}