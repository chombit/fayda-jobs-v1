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

export default function TermsOfServicePage() {
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
              Terms of Service
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </motion.div>

          <motion.div variants={fadeUp} custom={1}>
            <div className="bg-card rounded-lg p-8 border border-border">
              <h2 className="font-heading text-2xl font-semibold text-card-foreground mb-4">
                Terms and Conditions
              </h2>
              
              <div className="space-y-6 text-muted-foreground">
                <p>
                  Welcome to Fayda Jobs! By using our platform, you agree to these terms and conditions.
                </p>
                
                <h3 className="font-semibold text-lg mb-2">1. Account Terms</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You must provide accurate and truthful information</li>
                  <li>You must be at least 18 years old to use our services</li>
                  <li>You are responsible for maintaining account security</li>
                  <li>You may not share login credentials with others</li>
                </ul>
                
                <h3 className="font-semibold text-lg mb-2">2. Job Posting Terms</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Employers must post legitimate job opportunities</li>
                  <li>Job postings must be accurate and non-discriminatory</li>
                  <li>We reserve the right to remove inappropriate content</li>
                  <li>Job seekers must apply honestly and professionally</li>
                </ul>
                
                <h3 className="font-semibold text-lg mb-2">3. Platform Use</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Use platform for lawful job search purposes only</li>
                  <li>Do not reproduce or distribute content without permission</li>
                  <li>Respect intellectual property rights</li>
                  <li>Report any suspicious activity immediately</li>
                </ul>
                
                <h3 className="font-semibold text-lg mb-2">4. Privacy and Data</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>We collect and use data according to our Privacy Policy</li>
                  <li>Your information is protected by industry-standard security</li>
                  <li>We may share anonymized analytics data</li>
                  <li>You can request data deletion at any time</li>
                </ul>
                
                <h3 className="font-semibold text-lg mb-2">5. Limitations and Liability</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Platform provided "as is" without warranties</li>
                  <li>We are not responsible for employment decisions</li>
                  <li>Limitation of liability for indirect damages</li>
                  <li>We comply with Ethiopian labor laws</li>
                </ul>
                
                <h3 className="font-semibold text-lg mb-2">6. Termination</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You may terminate account at any time</li>
                  <li>We may suspend accounts for policy violations</li>
                  <li>Termination does not affect existing obligations</li>
                </ul>
                
                <h3 className="font-semibold text-lg mb-2">7. Contact Information</h3>
                <p className="text-muted-foreground">
                  For questions about these Terms of Service, please contact us at:
                </p>
                <div className="bg-muted/50 rounded p-4 mt-4">
                  <p className="font-medium">Email: info@faydajobs.com</p>
                  <p className="font-medium">Phone: +251 900 000 000</p>
                  <p className="font-medium">Address: Bole, Addis Ababa, Ethiopia</p>
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
