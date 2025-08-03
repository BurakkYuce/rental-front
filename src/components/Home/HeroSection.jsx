// src/components/Home/HeroSection.jsx
import React from "react";
// src/components/Home/HeroSection.jsx
import "./assets/css/heroSection.css"; // Import your custom CSS for the HeroSection
const HeroSection = () => {
  return (
    <section
      id="section-hero"
      aria-label="section"
      className="hero-static jarallax"
      style={{ width: "100%", overflow: "hidden" }}
    >
      <img src="images/background/1.jpg" className="jarallax-img" alt="" />

      <div className="container" style={{ position: "relative", zIndex: 10 }}>
        <div className="row align-items-center">
          <div className="col-lg-12 text-light">
            <div className="spacer-double"></div>
            <div className="spacer-double"></div>
            <h1
              className="mb-2"
              style={{
                color: "white",
                textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                position: "relative",
                zIndex: 11,
              }}
            >
              Looking for a <span className="id-color">vehicle</span>? You're at
              the right place.
            </h1>
            <div className="spacer-single"></div>
          </div>

          <div className="col-lg-12">
            <div className="spacer-single sm-hide"></div>
            <div
              className="p-4 rounded-3 shadow-soft"
              style={{
                backgroundColor: "rgba(255,255,255,0.95)",
                position: "relative",
                zIndex: 15,
                backdropFilter: "blur(5px)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <form name="contactForm" id="contact_form" method="post">
                <div id="step-1" className="row">
                  <div className="col-lg-6 mb30">
                    <h5 style={{ color: "#333", fontWeight: "600" }}>
                      What is your vehicle type?
                    </h5>

                    <div className="de_form de_radio row g-3">
                      <div className="radio-img col-lg-3 col-sm-3 col-6">
                        <input
                          id="radio-1a"
                          name="Car_Type"
                          type="radio"
                          value="Residential"
                          defaultChecked
                        />
                        <label htmlFor="radio-1a">
                          <img src="/images/select-form/car.png" alt="" />
                          Car
                        </label>
                      </div>

                      <div className="radio-img col-lg-3 col-sm-3 col-6">
                        <input
                          id="radio-1b"
                          name="Car_Type"
                          type="radio"
                          value="Office"
                        />
                        <label htmlFor="radio-1b">
                          <img src="/images/select-form/van.png" alt="" />
                          Van
                        </label>
                      </div>

                      <div className="radio-img col-lg-3 col-sm-3 col-6">
                        <input
                          id="radio-1c"
                          name="Car_Type"
                          type="radio"
                          value="Commercial"
                        />
                        <label htmlFor="radio-1c">
                          <img src="/images/select-form/minibus.png" alt="" />
                          Minibus
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="row">
                      <div className="col-lg-6 mb20">
                        <h5 style={{ color: "#333", fontWeight: "600" }}>
                          Pick Up Location
                        </h5>
                        <input
                          type="text"
                          name="Pick Up Location"
                          placeholder="Enter your pickup location"
                          className="form-control"
                          style={{ backgroundColor: "white" }}
                        />
                      </div>

                      <div className="col-lg-6 mb20">
                        <h5 style={{ color: "#333", fontWeight: "600" }}>
                          Drop Off Location
                        </h5>
                        <input
                          type="text"
                          name="Drop Off Location"
                          placeholder="Enter your dropoff location"
                          className="form-control"
                          style={{ backgroundColor: "white" }}
                        />
                      </div>

                      <div className="col-lg-6 mb20">
                        <h5 style={{ color: "#333", fontWeight: "600" }}>
                          Pick Up Date & Time
                        </h5>
                        <div className="date-time-field">
                          <input
                            type="text"
                            id="date-picker"
                            name="Pick Up Date"
                            className="form-control"
                            style={{ backgroundColor: "white" }}
                            placeholder="Select Date"
                          />
                          <select
                            name="Pick Up Time"
                            id="pickup-time"
                            className="form-control"
                            style={{ backgroundColor: "white" }}
                          >
                            <option value="Select time" disabled>
                              Time
                            </option>
                            <option value="00:00">00:00</option>
                            <option value="00:30">00:30</option>
                            <option value="01:00">01:00</option>
                            <option value="06:00">06:00</option>
                            <option value="08:00">08:00</option>
                            <option value="10:00">10:00</option>
                            <option value="12:00">12:00</option>
                            <option value="14:00">14:00</option>
                            <option value="16:00">16:00</option>
                            <option value="18:00">18:00</option>
                            <option value="20:00">20:00</option>
                          </select>
                        </div>
                      </div>

                      <div className="col-lg-6 mb20">
                        <h5 style={{ color: "#333", fontWeight: "600" }}>
                          Return Date & Time
                        </h5>
                        <div className="date-time-field">
                          <input
                            type="text"
                            id="date-picker-2"
                            name="Collection Date"
                            className="form-control"
                            style={{ backgroundColor: "white" }}
                            placeholder="Select Date"
                          />
                          <select
                            name="Collection Time"
                            id="collection-time"
                            className="form-control"
                            style={{ backgroundColor: "white" }}
                          >
                            <option value="Select time" disabled>
                              Time
                            </option>
                            <option value="00:00">00:00</option>
                            <option value="00:30">00:30</option>
                            <option value="01:00">01:00</option>
                            <option value="06:00">06:00</option>
                            <option value="08:00">08:00</option>
                            <option value="10:00">10:00</option>
                            <option value="12:00">12:00</option>
                            <option value="14:00">14:00</option>
                            <option value="16:00">16:00</option>
                            <option value="18:00">18:00</option>
                            <option value="20:00">20:00</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-12">
                    <input
                      type="submit"
                      id="send_message"
                      value="Find a Vehicle"
                      className="btn-main pull-right"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Spacer - Form'dan sonra */}
          <div className="spacer-double"></div>

          {/* 4 Steps Process */}
          <div className="row">
            <div className="col-lg-12 text-light">
              <div className="container-timeline">
                <ul>
                  <li className="timeline-item">
                    <div className="timeline-info">
                      <span>1</span>
                    </div>
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <h3
                        className="timeline-title"
                        style={{
                          color: "white",
                          textShadow: "1px 1px 3px rgba(0,0,0,0.7)",
                        }}
                      >
                        Choose a vehicle
                      </h3>
                      <p
                        style={{
                          color: "white",
                          textShadow: "1px 1px 3px rgba(0,0,0,0.7)",
                        }}
                      >
                        Unlock unparalleled adventures and memorable journeys
                        with our vast fleet of vehicles tailored to suit every
                        need.
                      </p>
                    </div>
                  </li>
                  <li className="timeline-item">
                    <div className="timeline-info">
                      <span>2</span>
                    </div>
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <h3
                        className="timeline-title"
                        style={{
                          color: "white",
                          textShadow: "1px 1px 3px rgba(0,0,0,0.7)",
                        }}
                      >
                        Pick location & date
                      </h3>
                      <p
                        style={{
                          color: "white",
                          textShadow: "1px 1px 3px rgba(0,0,0,0.7)",
                        }}
                      >
                        Pick your ideal location and date, and let us take you
                        on a journey filled with convenience, flexibility, and
                        unforgettable experiences.
                      </p>
                    </div>
                  </li>
                  <li className="timeline-item">
                    <div className="timeline-info">
                      <span>3</span>
                    </div>
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <h3
                        className="timeline-title"
                        style={{
                          color: "white",
                          textShadow: "1px 1px 3px rgba(0,0,0,0.7)",
                        }}
                      >
                        Make a booking
                      </h3>
                      <p
                        style={{
                          color: "white",
                          textShadow: "1px 1px 3px rgba(0,0,0,0.7)",
                        }}
                      >
                        Secure your reservation with ease, unlocking a world of
                        possibilities and embarking on your next adventure with
                        confidence.
                      </p>
                    </div>
                  </li>
                  <li className="timeline-item">
                    <div className="timeline-info">
                      <span>4</span>
                    </div>
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <h3
                        className="timeline-title"
                        style={{
                          color: "white",
                          textShadow: "1px 1px 3px rgba(0,0,0,0.7)",
                        }}
                      >
                        Sit back & relax
                      </h3>
                      <p
                        style={{
                          color: "white",
                          textShadow: "1px 1px 3px rgba(0,0,0,0.7)",
                        }}
                      >
                        Hassle-free convenience as we take care of every detail,
                        allowing you to unwind and embrace a seamless rental
                        experience.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="spacer-double"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
