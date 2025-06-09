
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, DollarSign } from "lucide-react";

export default function Donations() {
  const [donationAmount, setDonationAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donationAmount || !donorName || !donorEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: donorName,
          email: donorEmail,
          subject: `Donation Inquiry - $${donationAmount}`,
          message: `Donation Amount: $${donationAmount}\n\nMessage: ${message || 'No additional message provided.'}`
        }
      });

      if (error) throw error;

      toast({
        title: "Thank You!",
        description: "Your donation inquiry has been sent successfully. We'll contact you soon with donation instructions.",
      });

      // Reset form
      setDonationAmount('');
      setDonorName('');
      setDonorEmail('');
      setMessage('');
    } catch (error) {
      console.error('Error sending donation inquiry:', error);
      toast({
        title: "Error",
        description: "Failed to send donation inquiry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName || !donorEmail || !message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: donorName,
          email: donorEmail,
          subject: "Investor Inquiry",
          message: message
        }
      });

      if (error) throw error;

      toast({
        title: "Message Sent!",
        description: "Your message has been sent successfully. We'll get back to you soon.",
      });

      // Reset form
      setDonorName('');
      setDonorEmail('');
      setMessage('');
    } catch (error) {
      console.error('Error sending contact message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Support KRP Farm</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join us in revolutionizing local agriculture. Your investment helps connect farmers with communities 
            and creates sustainable food systems for everyone.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Donation Form */}
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <p className="  text-lg text-green-600" >₦</p>
              </div>
              <CardTitle className="text-2xl">Make a Donation</CardTitle>
              <CardDescription>
                Support our mission to connect local farmers with their communities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDonationSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="donationAmount">Donation Amount (₦) *</Label>
                  <Input
                    id="donationAmount"
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="Enter amount"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="donorName">Full Name *</Label>
                  <Input
                    id="donorName"
                    type="text"
                    placeholder="Your full name"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="donorEmail">Email Address *</Label>
                  <Input
                    id="donorEmail"
                    type="email"
                    placeholder="your.email@example.com"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="donationMessage">Message (Optional)</Label>
                  <Textarea
                    id="donationMessage"
                    placeholder="Tell us about your motivation to support us..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Donation Inquiry"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Get in Touch</CardTitle>
              <CardDescription>
                Have questions about investment opportunities? We'd love to hear from you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="contactName">Full Name *</Label>
                  <Input
                    id="contactName"
                    type="text"
                    placeholder="Your full name"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="contactEmail">Email Address *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="your.email@example.com"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="contactMessage">Message *</Label>
                  <Textarea
                    id="contactMessage"
                    placeholder="Tell us about your investment interests, questions, or how you'd like to get involved..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Impact Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Your Impact</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-green-600 mb-3">Support KRP Farm</h3>
              <p className="text-gray-600">
                Your donation helps us access better markets and fair pricing for their produce.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-600 mb-3">Build Communities</h3>
              <p className="text-gray-600">
                Strengthen local food systems and create connections between producers and consumers.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-purple-600 mb-3">Sustainable Future</h3>
              <p className="text-gray-600">
                Invest in environmentally sustainable farming practices and food distribution.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Direct Contact</h2>
          <p className="text-gray-600 mb-6">
            For immediate assistance or large donation inquiries, contact us directly:
          </p>
          <div className="space-y-2">
            <p className="text-lg">
              <strong>Email:</strong> <a href="mailto:admin@primeorbs.com" className="text-blue-600 hover:underline">krpkaneng@gmail.com</a>
            </p>
            <p className="text-lg">
              <strong>Phone:</strong> <a href="tel:+1234567890" className="text-blue-600 hover:underline">+234 (803) 966 8177</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
