// src/HomePage.jsx
import React from "react";
import Header from "./components/Header";
import HeroSection from "./components/Home/HeroSection";
import MovingTextSlider from "./components/Home/MovingTextSlider";
import WhyChooseUs from "./components/Home/WhyChooseUs";
import VehicleFleet from "./components/Home/VehicleFleet";
import LatestNews from "./components/Home/LatestNews";
import GoogleMapsReviews from "./components/Home/GoogleMapsReviews";
import FAQContactFooter from "./components/Home/FAQContactFooter";
import GooglePanorama from "./components/Home/GooglePanorama";

// CSS imports
import "./assets/css/bootstrap.min.css";
import "./assets/css/plugins.css";
import "./assets/css/style.css";

const HomePage = () => {
  return (
    <div>
      {/* Header */}
      <Header />

      {/* Content Begin */}

      {/* Hero Section */}
      <HeroSection />

      {/* Moving Text Slider */}
      <MovingTextSlider />

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Vehicle Fleet */}
      <VehicleFleet />

      {/* Latest News */}
      <LatestNews />
      <GooglePanorama />
      {/* Google Maps Reviews */}
      <GoogleMapsReviews />

      {/* FAQ & Contact Footer */}
      <FAQContactFooter />
    </div>
  );
};

export default HomePage;
