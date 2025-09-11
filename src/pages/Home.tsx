import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, Scan, BarChart3, Shield, Clock, Users } from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: QrCode,
      title: "Generate QR Codes",
      description: "Create unique QR codes for classes and sessions instantly"
    },
    {
      icon: Scan,
      title: "Quick Scanning",
      description: "Fast and accurate QR code scanning for attendance tracking"
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "View attendance statistics and generate comprehensive reports"
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "JWT-based authentication with role-based access control"
    },
    {
      icon: Clock,
      title: "Time-sensitive",
      description: "Session-specific QR codes with automatic expiration"
    },
    {
      icon: Users,
      title: "Multi-user Support",
      description: "Support for students, teachers, and administrators"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-2xl shadow-glow mb-6">
              <QrCode className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-foreground mb-6">
            QR-Based
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Attendance</span>
            <br />System
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Revolutionize attendance tracking with our automated, efficient, and accurate QR-based system. 
            Generate unique codes, scan instantly, and get real-time analytics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="hero" size="lg" className="text-lg px-8">
              <Link to="/dashboard">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8">
              <Link to="/scan">Try Scanner</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need for efficient attendance management in one comprehensive platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="bg-gradient-card shadow-card hover:shadow-elegant transition-all duration-300 hover:scale-105 border-0">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-8">
            Built with Modern Technology
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {["React.js", "Spring Boot", "PostgreSQL", "JWT", "Tailwind CSS", "ZXing", "Spring Security", "Hibernate"].map((tech) => (
              <div key={tech} className="bg-card rounded-lg p-6 shadow-card hover:shadow-elegant transition-all duration-300">
                <span className="font-semibold text-foreground">{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-hero">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Attendance System?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of educational institutions already using our platform
          </p>
          <Button asChild variant="outline" size="lg" className="bg-white text-primary hover:bg-white/90 border-white text-lg px-8">
            <Link to="/dashboard">Start Free Trial</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;