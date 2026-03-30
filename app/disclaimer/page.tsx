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

export default function DisclaimerPage() {
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
              Disclaimer
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </motion.div>

          <motion.div variants={fadeUp} custom={1}>
            <div className="bg-card rounded-lg p-8 border border-border">
              <h2 className="font-heading text-2xl font-semibold text-card-foreground mb-4">
                Important Disclaimer
              </h2>
              
              <div className="space-y-6 text-muted-foreground">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-lg mb-2 text-yellow-800">
                    ⚠️ Please Read Carefully
                  </h3>
                  <p className="text-yellow-700">
                    The information provided on Fayda Jobs is for general informational purposes only.
                  </p>
                </div>
                
                <h3 className="font-semibold text-lg mb-2">No Employment Guarantee</h3>
                <p className="mb-4">
                  Fayda Jobs does not guarantee employment or job placement. We are a platform connecting job seekers with employers. The final hiring decision is solely at the discretion of the employer.
                </p>
                
                <h3 className="font-semibold text-lg mb-2">Information Accuracy</h3>
                <p className="mb-4">
                  While we strive to maintain accurate and up-to-date job listings, we cannot guarantee the completeness or accuracy of all information provided by employers. Job seekers should verify all details directly with employers.
                </p>
                
                <h3 className="font-semibold text-lg mb-2">Third-Party Links</h3>
                <p className="mb-4">
                  Our platform may contain links to third-party websites and resources. We are not responsible for the content, privacy policies, or practices of external sites.
                </p>
                
                <h3 className="font-semibold text-lg mb-2">Financial Information</h3>
                <p className="mb-4">
                  Fayda Jobs does not handle financial transactions or payments. Any financial arrangements should be made directly between job seekers and employers.
                </p>
                
                <h3 className="font-semibold text-lg mb-2">Legal Compliance</h3>
                <p className="mb-4">
                  We comply with Ethiopian labor laws and regulations. However, users and employers should consult with legal professionals for specific employment law advice.
                </p>
                
                <h3 className="font-semibold text-lg mb-2">Limitation of Liability</h3>
                <p className="mb-4">
                  Fayda Jobs shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of our platform. Our maximum liability is limited to the service fees paid.
                </p>
                
                <div className="bg-muted/50 rounded p-4 mt-6">
                  <h3 className="font-semibold text-lg mb-2">Contact Information</h3>
                  <p className="text-muted-foreground mb-4">
                    For questions about this disclaimer or our services, please contact us:
                  </p>
                  <div className="space-y-2">
                    <p className="font-medium">📧 Email: info@faydajobs.com</p>
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
