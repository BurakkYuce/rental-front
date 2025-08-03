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
// Home Page Component
import "./assets/css/bootstrap.min.css";
import "./assets/css/plugins.css";
import "./assets/css/style.css";

const HomePage = () => {
  return (
    <div id="wrapper">
      {/* Page Preloader */}
      <div id="de-preloader"></div>

      {/* Header */}
      <Header />

      {/* Content Begin */}
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>

        {/* Hero Section */}
        <HeroSection />
        <MovingTextSlider />

        {/* Why Choose Us Section - Slider'ın ALTINDA */}
        <WhyChooseUs />
        <VehicleFleet />
        <LatestNews />
        <GoogleMapsReviews />
        <FAQContactFooter />

        {/* Diğer sections buraya eklenecek */}
        {/* Örnek: */}
        {/* <FeaturedCars />
        <Services />
        <Testimonials />
        <Newsletter />
        <Footer /> */}
      </div>
    </div>
  );
};
export default HomePage;
