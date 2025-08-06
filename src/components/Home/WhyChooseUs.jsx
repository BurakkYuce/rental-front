// src/components/Home/WhyChooseUs.jsx
import React from "react";
const WhyChooseUs = () => {
  return (
    <section id="section-features" className="why-choose-section">
      <div className="container">
        {/* Section Header */}
        <div className="row">
          <div className="col-lg-12 text-center mb-5">
            <h2 className="section-title">Our Features</h2>
            <p className="section-subtitle">
              Discover a world of convenience, safety, and customization, paving
              the way for unforgettable adventures and seamless mobility
              solutions.
            </p>
          </div>
        </div>

        {/* Features Content */}
        <div className="row align-items-center">
          {/* Left Side Features */}
          <div className="col-lg-4">
            <div className="feature-item">
              <div className="feature-icon">
                <img
                  src="/images/icons/1-green.svg"
                  alt="First class services"
                />
              </div>
              <div className="feature-content">
                <h4>First class services</h4>
                <p>
                  Where luxury meets exceptional care, creating unforgettable
                  moments and exceeding your every expectation.
                </p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <img
                  src="/images/icons/2-green.svg"
                  alt="24/7 road assistance"
                />
              </div>
              <div className="feature-content">
                <h4>24/7 road assistance</h4>
                <p>
                  Reliable support when you need it most, keeping you on the
                  move with confidence and peace of mind.
                </p>
              </div>
            </div>
          </div>

          {/* Center Car Image */}
          <div className="col-lg-4 text-center">
            <div className="car-showcase">
              <img
                src="/images/misc/car.png"
                alt="Featured Car"
                className="img-fluid"
              />
            </div>
          </div>

          {/* Right Side Features */}
          <div className="col-lg-4">
            <div className="feature-item feature-item-right">
              <div className="feature-content">
                <h4>Quality at Minimum Expense</h4>
                <p>
                  Unlocking affordable brilliance without elevating quality
                  while minimizing costs for maximum value.
                </p>
              </div>
              <div className="feature-icon">
                <img src="/images/icons/3-green.svg" alt="Quality service" />
              </div>
            </div>

            <div className="feature-item feature-item-right">
              <div className="feature-content">
                <h4>Free Pick-Up & Drop-Off</h4>
                <p>
                  Enjoy free pickup and drop-off services, adding an extra layer
                  of ease to your car rental experience.
                </p>
              </div>
              <div className="feature-icon">
                <img src="/images/icons/4-green.svg" alt="Free pickup" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
