'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Send, Clock } from "lucide-react";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
  })
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } }
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you would typically send this to your backend or Supabase
      // For now, we'll just show a success message
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="space-y-16"
        >
          {/* Header */}
          <motion.div variants={fadeUp} custom={0} className="text-center">
            <h1 className="font-heading text-4xl font-bold text-card-foreground mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get in touch with the Fayda Jobs team. We're here to help you find your next career opportunity.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div variants={fadeUp} custom={1} className="space-y-8">
              <div>
                <h2 className="font-heading text-2xl font-semibold text-card-foreground mb-6">
                  Get in Touch
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-card-foreground">Email</h3>
                      <p className="text-muted-foreground">info@faydajobs.com</p>
                      <p className="text-sm text-muted-foreground">support@faydajobs.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-card-foreground">Phone</h3>
                      <p className="text-muted-foreground">+251 900 000 000</p>
                      <p className="text-sm text-muted-foreground">Mon-Fri: 9:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-card-foreground">Office</h3>
                      <p className="text-muted-foreground">
                        Bole, Addis Ababa<br />
                        Ethiopia
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-semibold text-card-foreground mb-6">
                  Office Hours
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Saturday</span>
                    <span className="font-medium">10:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Sunday</span>
                    <span className="font-medium">Closed</span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-semibold text-card-foreground mb-6">
                  Follow Us
                </h2>
                <div className="flex gap-4">
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://t.me/faydajobs" target="_blank" rel="noopener noreferrer">
                      Telegram
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://facebook.com/faydajobs" target="_blank" rel="noopener noreferrer">
                      Facebook
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://linkedin.com/company/faydajobs" target="_blank" rel="noopener noreferrer">
                      LinkedIn
                    </a>
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={fadeUp} custom={2}>
              <Card>
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Name *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">
                        Subject *
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="How can we help you?"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell us more about your inquiry..."
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* FAQ Section */}
          <motion.div variants={fadeUp} custom={3}>
            <div className="text-center mb-8">
              <h2 className="font-heading text-2xl font-semibold text-card-foreground mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground">
                Quick answers to common questions about Fayda Jobs
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-card-foreground mb-2">
                    How do I post a job on Fayda Jobs?
                  </h3>
                  <p className="text-muted-foreground">
                    You can post a job by creating an account on our platform or contacting us directly. 
                    We offer both free and premium job posting options.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-card-foreground mb-2">
                    Is Fayda Jobs free for job seekers?
                  </h3>
                  <p className="text-muted-foreground">
                    Yes! Job seekers can browse, search, and apply for jobs completely free of charge.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-card-foreground mb-2">
                    How long do job postings stay active?
                  </h3>
                  <p className="text-muted-foreground">
                    Job postings typically stay active for 30 days, but you can extend or renew them as needed.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-card-foreground mb-2">
                    Can I edit my job posting after publishing?
                  </h3>
                  <p className="text-muted-foreground">
                    Yes, you can edit your job posting at any time through your employer dashboard.
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
}
