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
import FAQ from "@/components/FAQ";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            About KRP Farm
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            KRP Farms is a multi-dimensional agro services outfit which offers
            fruit and veggies, growing, procurement, distribution, diet planning
            and wellness packages among others. We have been growing and selling
            especially vegetable products since 2011. We grow and off take over
            70 products (including strawberries, green beans, green peas,
            carrots, potatoes, sweet peppers and herbs) from Jos and other North
            Central States to Lagos, Abuja, Port Harcourt, Benin, Kaduna, Kano,
            Niger and Benue
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <Target className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle className="text-2xl">Our Mission</CardTitle>
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
            <CardHeader>
              <Heart className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle className="text-2xl">Our Vision</CardTitle>
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

        {/* Values */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Our Partners
          </h3>
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <img
                src={image1}
                alt=""
                className="h-16 w-16 text-green-600 mx-auto mb-4"
              />
            </div>

            <div className="text-center">
              <img
                src={image2}
                alt=""
                className="h-16 w-16 text-green-600 mx-auto mb-4"
              />
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Our Story
          </h3>
          <div className="prose max-w-none text-gray-600">
            <p className="text-lg mb-4">
              In 2011 we started growing and selling vegetables inspired by the
              opportunity of available arable land in Jos, Nigeria and the need
              to contribute to the nations’ March towards self-reliance in food
              production. The pictures in this document are original to us
              reflecting our effort since 2011.
            </p>
            <p className="text-lg mb-4">
              Founded in 2024, we set out to bridge this gap using technology.
              Our platform eliminates middlemen, allowing farmers to showcase
              their products directly to customers across Nigeria's major
              cities.
            </p>
            <p className="text-lg">
              To meet the increasing demand for Nigerian grown fruits and
              vegetables, we have gone into partnerships with other local
              farmers. We have received training and guidance by the
              Agricultural Services Training Centre and provided income and
              employment to 10 young individuals.
            </p>
            <p className="text-lg">
              Since 2012 KRP Farms has serviced over 700 loyal individual and
              corporate clients across Nigeria. The group is constantly
              exploring opportunities for partnerships that add value to the
              supply chain and promote growth.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
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

        <FAQ/>

      </main>

    </div>
  );
};

export default About;
