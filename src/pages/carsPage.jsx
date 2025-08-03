// src/pages/CarsPage.jsx
import React, { useState } from "react";
import { Heart, Users, Calendar, Settings } from "lucide-react";
import Header from "../components/Header";
import "./assets/css/carsPage.css"; // Import your custom CSS for the CarsPage
import "./CarsPage.css";

const CarsPage = () => {
  const [filters, setFilters] = useState({
    vehicleType: [],
    carBodyType: [],
    carSeats: [],
    engineCapacity: [],
    priceRange: { min: 0, max: 2000 },
  });

  const [cars] = useState([
    {
      id: 1,
      name: "Jeep Renegade",
      image:
        "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      rating: 4.8,
      reviews: 25,
      seats: 5,
      transmission: "Manual",
      doors: 4,
      type: "SUV",
      dailyRate: 265,
      liked: false,
    },
    {
      id: 2,
      name: "Mini Cooper",
      image:
        "https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      rating: 4.9,
      reviews: 79,
      seats: 5,
      transmission: "Automatic",
      doors: 4,
      type: "Sedan",
      dailyRate: 244,
      liked: false,
    },
    {
      id: 3,
      name: "Ferrari Enzo",
      image:
        "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      rating: 4.7,
      reviews: 55,
      seats: 5,
      transmission: "Automatic",
      doors: 4,
      type: "Exotic Car",
      dailyRate: 167,
      liked: false,
    },
    {
      id: 4,
      name: "Ford Raptor",
      image:
        "https://images.unsplash.com/photo-1594736797933-d0a501ba0722?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      rating: 4.6,
      reviews: 89,
      seats: 5,
      transmission: "Automatic",
      doors: 4,
      type: "Truck",
      dailyRate: 147,
      liked: false,
    },
    {
      id: 5,
      name: "Mini Cooper S",
      image:
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      rating: 4.5,
      reviews: 87,
      seats: 5,
      transmission: "Automatic",
      doors: 4,
      type: "Hatchback",
      dailyRate: 238,
      liked: false,
    },
    {
      id: 6,
      name: "VW Polo",
      image:
        "https://images.unsplash.com/photo-1549317336-206569e8475c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      rating: 4.4,
      reviews: 37,
      seats: 5,
      transmission: "Automatic",
      doors: 4,
      type: "Hatchback",
      dailyRate: 106,
      liked: false,
    },
    {
      id: 7,
      name: "Chevrolet Camaro",
      image:
        "https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      rating: 4.3,
      reviews: 39,
      seats: 5,
      transmission: "Automatic",
      doors: 4,
      type: "Exotic Car",
      dailyRate: 245,
      liked: false,
    },
    {
      id: 8,
      name: "Hyundai Staria",
      image:
        "https://images.unsplash.com/photo-1570294645112-2c456e8725e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      rating: 4.2,
      reviews: 23,
      seats: 5,
      transmission: "Automatic",
      doors: 4,
      type: "Minivan",
      dailyRate: 191,
      liked: false,
    },
    {
      id: 9,
      name: "Toyota Rav 4",
      image:
        "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      rating: 4.5,
      reviews: 63,
      seats: 5,
      transmission: "Automatic",
      doors: 4,
      type: "SUV",
      dailyRate: 114,
      liked: false,
    },
  ]);

  const vehicleTypes = ["Car", "Van", "Minibus", "Prestige"];
  const carBodyTypes = [
    "Convertible",
    "Coupe",
    "Exotic Cars",
    "Hatchback",
    "Minivan",
    "Truck",
    "Sedan",
    "Sports Car",
    "Station Wagon",
    "SUV",
  ];
  const carSeats = ["2 seats", "4 seats", "6 seats", "6+ seats"];
  const engineCapacities = [
    "1000 - 2000",
    "2000 - 4000",
    "4000 - 6000",
    "6000+",
  ];

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter((item) => item !== value)
        : [...prev[filterType], value],
    }));
  };

  const toggleLike = (carId) => {
    console.log("Toggle like for car:", carId);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= rating ? "filled" : ""}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div id="wrapper">
      {/* Page Preloader */}
      <div id="de-preloader"></div>

      {/* Header */}
      <Header />

      {/* Content Begin */}
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>

        <div className="cars-page">
          {/* Hero Section */}
          <div className="cars-hero">
            <h1>Cars</h1>
          </div>

          {/* Main Content */}
          <div className="cars-container">
            <div className="cars-content">
              {/* Filters Sidebar */}
              <div className="filters-sidebar">
                {/* Vehicle Type Filter */}
                <div className="filter-section">
                  <h3>Vehicle Type</h3>
                  <div className="filter-options">
                    {vehicleTypes.map((type) => (
                      <label key={type} className="filter-checkbox">
                        <input
                          type="checkbox"
                          checked={filters.vehicleType.includes(type)}
                          onChange={() =>
                            handleFilterChange("vehicleType", type)
                          }
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Car Body Type Filter */}
                <div className="filter-section">
                  <h3>Car Body Type</h3>
                  <div className="filter-options">
                    {carBodyTypes.map((type) => (
                      <label key={type} className="filter-checkbox">
                        <input
                          type="checkbox"
                          checked={filters.carBodyType.includes(type)}
                          onChange={() =>
                            handleFilterChange("carBodyType", type)
                          }
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Car Seats Filter */}
                <div className="filter-section">
                  <h3>Car Seats</h3>
                  <div className="filter-options">
                    {carSeats.map((seats) => (
                      <label key={seats} className="filter-checkbox">
                        <input
                          type="checkbox"
                          checked={filters.carSeats.includes(seats)}
                          onChange={() => handleFilterChange("carSeats", seats)}
                        />
                        {seats}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Engine Capacity Filter */}
                <div className="filter-section">
                  <h3>Car Engine Capacity (cc)</h3>
                  <div className="filter-options">
                    {engineCapacities.map((capacity) => (
                      <label key={capacity} className="filter-checkbox">
                        <input
                          type="checkbox"
                          checked={filters.engineCapacity.includes(capacity)}
                          onChange={() =>
                            handleFilterChange("engineCapacity", capacity)
                          }
                        />
                        {capacity}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="filter-section">
                  <h3>Price ($)</h3>
                  <div className="price-range">
                    <div className="price-inputs">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.priceRange.min}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            priceRange: {
                              ...prev.priceRange,
                              min: parseInt(e.target.value) || 0,
                            },
                          }))
                        }
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.priceRange.max}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            priceRange: {
                              ...prev.priceRange,
                              max: parseInt(e.target.value) || 2000,
                            },
                          }))
                        }
                      />
                    </div>
                    <div className="price-slider">
                      <input
                        type="range"
                        min="0"
                        max="2000"
                        value={filters.priceRange.max}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            priceRange: {
                              ...prev.priceRange,
                              max: parseInt(e.target.value),
                            },
                          }))
                        }
                        className="slider"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Cars Grid */}
              <div className="cars-grid">
                {cars.map((car) => (
                  <div key={car.id} className="car-card">
                    <div className="car-image">
                      <img src={car.image} alt={car.name} />
                      <button
                        className={`like-btn ${car.liked ? "liked" : ""}`}
                        onClick={() => toggleLike(car.id)}
                      >
                        <Heart size={20} />
                      </button>
                      <div className="reviews-badge">
                        {renderStars(Math.floor(car.rating))}
                        {car.reviews}
                      </div>
                    </div>

                    <div className="car-content">
                      <h3>{car.name}</h3>

                      <div className="car-features">
                        <div className="feature">
                          <Users size={16} />
                          <span>{car.seats}</span>
                        </div>
                        <div className="feature">
                          <Settings size={16} />
                          <span>{car.transmission}</span>
                        </div>
                        <div className="feature">
                          <Calendar size={16} />
                          <span>{car.doors}</span>
                        </div>
                        <div className="feature car-type">
                          <span>{car.type}</span>
                        </div>
                      </div>

                      <div className="car-price">
                        <div className="price-info">
                          <span className="price-label">Daily rate from</span>
                          <span className="price">${car.dailyRate}</span>
                        </div>
                        <button className="rent-btn">Rent Now</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarsPage;
