// src/pages/CarsPage.jsx
import React, { useState } from "react";
import { Heart, Users, Calendar, Fuel, Settings } from "lucide-react";

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
      name: "Mini Cooper",
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
    // Like functionality will be implemented later
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
    <div className="cars-page">
      {/* Hero Section */}
      <div className="cars-hero">
        <div className="container">
          <h1>Cars</h1>
        </div>
      </div>

      <div className="container">
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
                      onChange={() => handleFilterChange("vehicleType", type)}
                    />
                    <span className="checkmark"></span>
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
                      onChange={() => handleFilterChange("carBodyType", type)}
                    />
                    <span className="checkmark"></span>
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
                    <span className="checkmark"></span>
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
                    <span className="checkmark"></span>
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

      <style jsx>{`
        .cars-page {
          min-height: 100vh;
          background-color: #f8f9fa;
        }

        .cars-hero {
          background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
            url("https://images.unsplash.com/photo-1511994714008-b6fc2c8e0db7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80");
          background-size: cover;
          background-position: center;
          padding: 120px 0 80px;
          color: white;
          text-align: center;
        }

        .cars-hero h1 {
          font-size: 4rem;
          font-weight: 700;
          margin: 0;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .cars-content {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 40px;
          padding: 40px 0;
        }

        .filters-sidebar {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          height: fit-content;
        }

        .filter-section {
          margin-bottom: 30px;
          padding-bottom: 25px;
          border-bottom: 1px solid #eee;
        }

        .filter-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }

        .filter-section h3 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 15px;
          color: #333;
        }

        .filter-options {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .filter-checkbox {
          display: flex;
          align-items: center;
          cursor: pointer;
          font-size: 0.9rem;
          color: #666;
          transition: color 0.3s ease;
        }

        .filter-checkbox:hover {
          color: #4caf50;
        }

        .filter-checkbox input[type="checkbox"] {
          margin-right: 8px;
          accent-color: #4caf50;
        }

        .price-range {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .price-inputs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .price-inputs input {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 0.9rem;
        }

        .slider {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: #ddd;
          outline: none;
          appearance: none;
        }

        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #4caf50;
          cursor: pointer;
        }

        .cars-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 25px;
        }

        .car-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .car-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .car-image {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .car-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .car-card:hover .car-image img {
          transform: scale(1.05);
        }

        .like-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .like-btn:hover {
          background: white;
          transform: scale(1.1);
        }

        .like-btn.liked {
          background: #ff4757;
          color: white;
        }

        .reviews-badge {
          position: absolute;
          top: 15px;
          left: 15px;
          background: rgba(255, 255, 255, 0.95);
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .star {
          color: #ddd;
          font-size: 12px;
        }

        .star.filled {
          color: #ffc107;
        }

        .car-content {
          padding: 20px;
        }

        .car-content h3 {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 15px;
          color: #333;
        }

        .car-features {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.85rem;
          color: #666;
        }

        .car-type {
          background: #e3f2fd;
          color: #1976d2;
          padding: 4px 8px;
          border-radius: 12px;
          font-weight: 500;
        }

        .car-price {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .price-info {
          display: flex;
          flex-direction: column;
        }

        .price-label {
          font-size: 0.8rem;
          color: #666;
          margin-bottom: 2px;
        }

        .price {
          font-size: 1.4rem;
          font-weight: 700;
          color: #333;
        }

        .rent-btn {
          background: #4caf50;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .rent-btn:hover {
          background: #45a049;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .cars-content {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .cars-hero h1 {
            font-size: 2.5rem;
          }

          .filters-sidebar {
            padding: 20px;
          }

          .cars-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default CarsPage;
