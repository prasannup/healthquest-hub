import { ArrowRight, Shield, Users, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Decentralized Healthcare Platform
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Connect with verified doctors, get expert medical advice, and maintain control of your healthcare data
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link to="/doctors">Find a Doctor</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/questions">Ask a Question</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-sm border">
              <Shield className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Verified Doctors</h3>
              <p className="text-gray-600">
                All doctors are verified through our decentralized verification system
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm border">
              <Users className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Expert Advice</h3>
              <p className="text-gray-600">
                Get answers from specialized healthcare professionals
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm border">
              <Coins className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Token Rewards</h3>
              <p className="text-gray-600">
                Incentivized system for quality medical advice
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Join Our Healthcare Network?
          </h2>
          <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Whether you're a healthcare professional or seeking medical advice, we're here to help
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link to="/register" className="inline-flex items-center">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;