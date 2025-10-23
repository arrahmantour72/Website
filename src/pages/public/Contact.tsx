// src/pages/Contact.tsx
"use client";

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { PublicLayout } from '@/components/public/PublicLayout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; // <-- Import Accordion components
import { useToast } from '@/hooks/use-toast';
import { Phone, Mail, MessageCircle, MapPin, Loader2, Send } from 'lucide-react';
import { motion } from 'framer-motion';

// --- Framer Motion Variants ---
const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
  }
};

const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
  }
};

export const Contact = () => {
  const contact = useSelector((state: RootState) => state.contact);
  const { toast } = useToast();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false); // <-- For form loading state

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // Enhanced form submission with loading state
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate an API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    toast({
      title: 'Message Sent!',
      description: 'Thank you for contacting us. We will get back to you soon!',
    });
    setFormData({}); // Clear the form
  };

  // Helper for WhatsApp link
  const getWhatsAppLink = (phone: string) => {
    const cleanedPhone = phone.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    return `https://wa.me/${cleanedPhone}`;
  };

  return (
    <PublicLayout>
      <section className="py-20 bg-background overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              {contact.title}
            </h1>
            <div
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              dangerouslySetInnerHTML={{ __html: contact.description }}
            />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            
            {/* --- Left Column: Contact Info & Map --- */}
            <motion.div
              className="space-y-8"
              variants={staggerContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {/* Contact Info Card */}
              <motion.div variants={itemVariants}>
                <Card className="p-6 space-y-5 shadow-lg">
                  <h3 className="text-2xl font-serif font-semibold mb-4 text-gray-900">Get in Touch</h3>
                  
                  {/* Phone */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <a href={`tel:${contact.contactDetails.phone}`} className="font-semibold text-lg text-gray-800 hover:text-amber-600 transition-colors">
                        {contact.contactDetails.phone}
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <a href={`mailto:${contact.contactDetails.email}`} className="font-semibold text-lg text-gray-800 hover:text-amber-600 transition-colors">
                        {contact.contactDetails.email}
                      </a>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">WhatsApp</p>
                      <a
                        href={getWhatsAppLink(contact.contactDetails.phone)} // Use dynamic link
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-lg text-amber-600 hover:underline"
                      >
                        Chat with us
                      </a>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* --- NEW: Visit Us Card --- */}
              <motion.div variants={itemVariants}>
                <Card className="p-6 space-y-4 shadow-lg">
                  <h3 className="text-2xl font-serif font-semibold mb-4 text-gray-900">Visit Us</h3>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center flex-shrink-0 mt-1">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <address className="font-semibold text-lg text-gray-800 not-italic whitespace-pre-line">
                        {contact.address}
                      </address>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Map Embed */}
              {contact.mapEmbed && (
                <motion.div variants={itemVariants}>
                  <Card className="p-0 overflow-hidden shadow-lg">
                    <div
                      className="w-full h-80" // Increased height
                      dangerouslySetInnerHTML={{ __html: contact.mapEmbed }}
                    />
                  </Card>
                </motion.div>
              )}
            </motion.div>

            {/* --- Right Column: Contact Form --- */}
            <motion.div
              variants={sectionVariants} // Use section variant for a single block
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <Card className="p-6 md:p-8 shadow-lg">
                <h3 className="text-2xl font-serif font-semibold mb-6 text-gray-900">Send us a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {contact.formFields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label htmlFor={field.id} className="font-medium">{field.label}</Label>
                      {field.type === 'textarea' ? (
                        <Textarea
                          id={field.id}
                          value={formData[field.id] || ''}
                          onChange={handleChange}
                          placeholder={`Enter your ${field.label.toLowerCase()}`}
                          required
                          className="bg-background min-h-[120px]"
                        />
                      ) : (
                        <Input
                          id={field.id}
                          type={field.type}
                          value={formData[field.id] || ''}
                          onChange={handleChange}
                          placeholder={`Enter your ${field.label.toLowerCase()}`}
                          required
                          className="bg-background"
                        />
                      )}
                    </div>
                  ))}
                  <Button
                    type="submit"
                    disabled={isSubmitting} // Disable button when submitting
                    className="w-full text-base font-semibold py-6 bg-gradient-to-br from-yellow-500 to-amber-600 text-white hover:shadow-lg hover:from-yellow-600 hover:to-amber-700 transition-all disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5 mr-2" />
                    )}
                    {isSubmitting ? 'Submitting...' : 'Send Message'}
                  </Button>
                </form>
              </Card>
            </motion.div>
          </div>

          {/* --- NEW: FAQ Section --- */}
          <motion.div
            className="max-w-4xl mx-auto mt-24"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Have questions? We've got answers. If you can't find what you're looking for, feel free to contact us directly.
              </p>
            </div>
            <Card className="p-4 md:p-6 shadow-lg">
              <Accordion type="single" collapsible className="w-full">
                {contact.faq.map((item) => (
                  <AccordionItem key={item.id} value={item.id}>
                    <AccordionTrigger className="text-lg font-semibold text-left text-gray-800 hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-base text-gray-700 leading-relaxed pt-2">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          </motion.div>

        </div>
      </section>
    </PublicLayout>
  );
};