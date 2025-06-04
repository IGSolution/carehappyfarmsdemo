import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Target, Heart } from "lucide-react";
import image1 from "../assets/image.png";
import image2 from "../assets/image1.png";
import image3 from "../assets/KRPFEMA_Logo.png";

import FAQ from "@/components/FAQ";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-center text-green-700 mb-8">
            About KRP Farms
          </h2>
        </div>



        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader className="flex flex-col items-center">
              <Target className="h-12 w-12 text-red-600 mb-4" />
              <CardTitle className="text-2xl font-extrabold text-center text-green-700 mb-8">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                To revolutionize Nigeria's agricultural marketplace by providing
                a direct, transparent platform that empowers farmers to reach
                customers while ensuring consumers have access to fresh,
                locally-sourced produce.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-col items-center">
              <Heart className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle className="text-2xl font-extrabold text-center text-green-700 mb-8">Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                To become Nigeria's leading agricultural marketplace, fostering
                sustainable farming practices, supporting local communities, and
                ensuring food security through technology and innovation.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16 mx-auto max-w-fit">
          <h3 className="text-4xl font-extrabold text-center text-green-700 mb-8">
            Our Story
          </h3>
          <div className="prose lg:prose-lg text-gray-700 mx-auto max-w-4xl leading-relaxed">
            <p className="mb-6">
              <span className="font-semibold text-green-800">KRP Farms</span> began in <span className="font-semibold">2011</span>, driven by a passion to harness the agricultural potential of Jos, Nigeria. Our goal was to support national food security and create meaningful opportunities in the farming sector. The images we share reflect our authentic journey over the years.
            </p>
            <p className="mb-6">
              In <span className="font-semibold">2024</span>, we evolved into a technology-powered platform designed to bridge the gap between farmers and consumers. By cutting out middlemen, we empower local growers to showcase and sell their fresh produce directly to customers across Nigeria’s major cities.
            </p>
            <p className="mb-6">
              To meet the growing demand for locally sourced fruits and vegetables, we’ve partnered with other regional farmers. Through training and support from the <span className="italic">Agricultural Services Training Centre</span>, we’ve created income opportunities for over <span className="font-semibold">10 young Nigerians</span>.
            </p>
            <p className="mb-6">
              Since <span className="font-semibold">2012</span>, <span className="font-semibold text-green-800">KRP Farms</span> has served more than <span className="font-semibold">700 individual and corporate clients</span> across the country. We are committed to building value-driven partnerships that strengthen the agricultural supply chain and promote long-term sustainability.
            </p>
          </div>

        </div>

        {/* Values */}
        <div className="mb-16">
          <h3 className="text-4xl font-extrabold text-center text-green-700 mb-8">
            Our Partners
          </h3>
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <img
                src={image1}
                alt=""
                className="h-16 w-16 mx-auto mb-4 transition-transform duration-300 ease-in-out transform hover:scale-125" />
            </div>

            <div className="text-center">
              <img
                src={image2}
                alt=""
                className="h-16 w-16 mx-auto mb-4 transition-transform duration-300 ease-in-out transform hover:scale-125" />
            </div>

            <div className="text-center">
              <img
                src={image3}
                alt=""
                className="h-16 w-16 mx-auto mb-4 transition-transform duration-300 ease-in-out transform hover:scale-125" />
            </div>
          </div>
        </div>



        {/* CTA Section */}
        <div className="text-center mb-16">
          <h3 className="text-4xl font-extrabold text-center text-green-700 mb-8">
            Join Our Growing Community
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Kick-start the day with healthy eating and very convenient
            shopping from the comfort of your home or office!.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started Today
              </Button>
            </Link>
            <Link to="/marketplace">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Explore Marketplace
              </Button>
            </Link>
          </div>
        </div>

        <FAQ />

      </main>

    </div>
  );
};

export default About;
