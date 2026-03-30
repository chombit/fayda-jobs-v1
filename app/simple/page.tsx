'use client';

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SimpleHomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Fayda Jobs
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Find Your Career Opportunity in Ethiopia
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">Browse Jobs</h3>
              <p className="text-muted-foreground">
                Discover thousands of verified job opportunities
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">Post Jobs</h3>
              <p className="text-muted-foreground">
                Reach qualified candidates across Ethiopia
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">Career Advice</h3>
              <p className="text-muted-foreground">
                Get tips and guidance for your job search
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
