'use client';

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
  }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } }
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={fadeUp} custom={0}>
            <h1 className="font-heading text-4xl font-bold text-card-foreground mb-6">
              Cookie Policy
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </motion.div>

          <motion.div variants={fadeUp} custom={1}>
            <div className="bg-card rounded-lg p-8 border border-border">
              <h2 className="font-heading text-2xl font-semibold text-card-foreground mb-4">
                What Are Cookies?
              </h2>
              
              <div className="space-y-6 text-muted-foreground">
                <p>
                  Cookies are small text files that are stored on your device when you visit Fayda Jobs. They help us remember your preferences and improve your experience.
                </p>
                
                <h3 className="font-semibold text-lg mb-2">Types of Cookies We Use</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Essential Cookies:</strong> Required for basic functionality</li>
                  <li><strong>Performance Cookies:</strong> Help us analyze site usage</li>
                  <li><strong>Functional Cookies:</strong> Remember your preferences</li>
                  <li><strong>Targeting Cookies:</strong> Show relevant content</li>
                </ul>
                
                <h3 className="font-semibold text-lg mb-2">How We Use Cookies</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>To authenticate users and maintain sessions</li>
                  <li>To remember user preferences and settings</li>
                  <li>To analyze website traffic and user behavior</li>
                  <li>To personalize content and job recommendations</li>
                  <li>To provide customer support and security</li>
                </ul>
                
                <h3 className="font-semibold text-lg mb-2">Managing Your Cookies</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Most browsers accept cookies by default</li>
                  <li>You can disable cookies in browser settings</li>
                  <li>Disabling cookies may affect some features</li>
                  <li>You can clear cookies from your browser at any time</li>
                </ul>
                
                <h3 className="font-semibold text-lg mb-2">Third-Party Cookies</h3>
                <p className="mb-4">
                  We may use trusted third-party services that place cookies on your device for analytics and advertising purposes.
                </p>
                
                <h3 className="font-semibold text-lg mb-2">Your Rights</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Right to accept or reject cookies</li>
                  <li>Right to withdraw consent at any time</li>
                  <li>Right to access our services without accepting non-essential cookies</li>
                  <li>Right to request information about data we hold</li>
                </ul>
                
                <div className="bg-muted/50 rounded p-4 mt-6">
                  <h3 className="font-semibold text-lg mb-2">Contact Us</h3>
                  <p className="text-muted-foreground mb-4">
                    If you have questions about our Cookie Policy, please contact us:
                  </p>
                  <div className="space-y-2">
                    <p className="font-medium">📧 Email: privacy@faydajobs.com</p>
                    <p className="font-medium">📞 Phone: +251 900 000 000</p>
                    <p className="font-medium">📍 Address: Bole, Addis Ababa, Ethiopia</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
}
