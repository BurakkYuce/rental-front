// src/components/Home/MovingTextSlider.jsx
import React from "react";
import "./assets/css/movingTextSlider.css"; // Import your custom CSS for the MovingTextSlider
const MovingTextSlider = () => {
  const carTypes = [
    "SUV",
    "HATCHBACK",
    "CONVERTIBLE",
    "SEDAN",
    "SPORTS CAR",
    "COUPE",
    "MINIVAN",
    "TRUCK",
    "CROSSOVER",
    "EXOTIC CARS",
    "STATION WAGON",
    "PICKUP",
    "LUXURY CARS",
  ];

  return (
    <div className="moving-text-section">
      <div className="moving-text-container">
        <div className="moving-text-track">
          {/* İlk set */}
          {carTypes.map((car, index) => (
            <div key={`first-${index}`} className="moving-text-item">
              <span className="car-type-text">{car}</span>
              {index < carTypes.length - 1 && (
                <span className="separator">•</span>
              )}
            </div>
          ))}

          {/* İkinci set - seamless loop için */}
          {carTypes.map((car, index) => (
            <div key={`second-${index}`} className="moving-text-item">
              <span className="car-type-text">{car}</span>
              {index < carTypes.length - 1 && (
                <span className="separator">•</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovingTextSlider;
