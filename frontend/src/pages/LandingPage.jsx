import { Link } from "react-router-dom";

import { Navigation } from '../components/LandingPage/Navigation';
import { Hero } from '../components/LandingPage/Hero';
import { Features } from '../components/LandingPage/Features';
import { Testimonials } from '../components/LandingPage/Testimonials';
import { CTA } from '../components/LandingPage/CTA';
import { Footer } from '../components/LandingPage/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <Features />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}

