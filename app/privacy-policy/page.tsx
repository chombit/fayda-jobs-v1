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

export default function PrivacyPolicyPage() {
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
              Privacy Policy
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </motion.div>

          <motion.div variants={fadeUp} custom={1}>
            <div className="bg-card rounded-lg p-8 border border-border">
              <h2 className="font-heading text-2xl font-semibold text-card-foreground mb-4">
                Information We Collect
              </h2>
              
              <div className="space-y-4 text-muted-foreground">
                <p>
                  At Fayda Jobs, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our job search platform.
                </p>
                
                <h3 className="font-semibold text-lg mb-2">Information We Collect</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Personal information (name, email, phone)</li>
                  <li>Professional information (resume, work history)</li>
                  <li>Usage data and analytics</li>
                  <li>Device and browser information</li>
                </ul>
                
                <h3 className="font-semibold text-lg mb-2">How We Use Your Information</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>To provide job search and matching services</li>
                  <li>To improve our platform and user experience</li>
                  <li>To communicate with users about job opportunities</li>
                  <li>To ensure platform security and prevent fraud</li>
                </ul>
                
                <h3 className="font-semibold text-lg mb-2">Data Protection</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Secure data storage and encryption</li>
                  <li>Regular security audits and updates</li>
                  <li>Limited employee access to personal data</li>
                  <li>Compliance with data protection regulations</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
}
