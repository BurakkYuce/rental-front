// src/pages/TransferService.jsx - Transfer Service Page for Customers
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const TransferService = () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedCapacity, setSelectedCapacity] = useState('capacity_1_4');

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    passengers: '1',
    pickupLocation: '',
    dropoffLocation: '',
    date: '',
    time: '',
    message: ''
  });

  const [contactFormSubmitting, setContactFormSubmitting] = useState(false);
  const [contactFormSuccess, setContactFormSuccess] = useState(false);

  // Capacity options
  const capacityOptions = [
    {
      key: 'capacity_1_4',
      label: '1-4 Passengers',
      description: 'Sedan / Standard Car',
      icon: '🚗',
      maxPassengers: 4
    },
    {
      key: 'capacity_1_6',
      label: '1-6 Passengers',
      description: 'MPV / Minivan',
      icon: '🚐',
      maxPassengers: 6
    },
    {
      key: 'capacity_1_16',
      label: '1-16 Passengers',
      description: 'Minibus / Coach',
      icon: '🚌',
      maxPassengers: 16
    }
  ];

  // Fetch transfer zones
  useEffect(() => {
    const fetchZones = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:4000/api/transfers');
        
        if (!response.ok) {
          throw new Error('Failed to fetch transfer zones');
        }

        const data = await response.json();
        if (data.success) {
          setZones(data.data || []);
        } else {
          throw new Error(data.error || 'Failed to load transfer zones');
        }
      } catch (err) {
        console.error('❌ Failed to load transfer zones:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchZones();
  }, []);

  // Handle contact form submission
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    
    setContactFormSubmitting(true);
    
    try {
      // Find the selected transfer zone
      const selectedZoneData = zones.find(zone => 
        contactForm.dropoffLocation.toLowerCase().includes(zone.zoneName.toLowerCase()) ||
        zone.zoneName.toLowerCase().includes(contactForm.dropoffLocation.toLowerCase())
      );

      // Calculate pickup and dropoff times
      const pickupDateTime = new Date(`${contactForm.date}T${contactForm.time}`);
      const dropoffDateTime = new Date(pickupDateTime);
      dropoffDateTime.setHours(dropoffDateTime.getHours() + 1); // Default 1 hour duration

      // Get pricing based on selected capacity
      const selectedCapacityInfo = getSelectedCapacityInfo();
      const zonePricing = selectedZoneData ? selectedZoneData.pricing[selectedCapacity] : 0;

      const bookingData = {
        serviceType: 'transfer',
        transferId: selectedZoneData?.id || null,
        drivers: [{
          name: contactForm.name.split(' ')[0] || contactForm.name,
          surname: contactForm.name.split(' ').slice(1).join(' ') || '',
          phoneNumber: contactForm.phone,
        }],
        pickupLocation: contactForm.pickupLocation,
        dropoffLocation: contactForm.dropoffLocation,
        pickupTime: pickupDateTime.toISOString(),
        dropoffTime: dropoffDateTime.toISOString(),
        transferData: {
          vehicleCapacity: selectedCapacity,
          passengers: parseInt(contactForm.passengers),
          flightNumber: '',
          notes: contactForm.message
        },
        specialRequests: contactForm.message,
        pricing: {
          total: zonePricing,
          currency: 'EUR',
          breakdown: {
            basePrice: zonePricing,
            vehicleType: selectedCapacityInfo?.label,
            zone: selectedZoneData?.zoneName || contactForm.dropoffLocation
          }
        }
      };

      const response = await fetch('http://localhost:4000/api/admin/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create booking');
      }

      const result = await response.json();
      console.log('✅ Transfer booking created:', result);

      setContactFormSuccess(true);
      setContactForm({
        name: '',
        email: '',
        phone: '',
        passengers: '1',
        pickupLocation: '',
        dropoffLocation: '',
        date: '',
        time: '',
        message: ''
      });
    } catch (error) {
      console.error('❌ Transfer booking error:', error);
      alert(`Error creating transfer booking: ${error.message}`);
    } finally {
      setContactFormSubmitting(false);
    }
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Get price for selected capacity and zone
  const getPrice = (zone, capacity) => {
    return zone.pricing?.[capacity] || 0;
  };

  // Get selected capacity info
  const getSelectedCapacityInfo = () => {
    return capacityOptions.find(option => option.key === selectedCapacity);
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="loading-container" style={{ padding: '100px 0', textAlign: 'center' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p style={{ marginTop: '20px', color: '#666' }}>Loading transfer services...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      
      {/* Hero Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '80px 0',
        color: 'white',
        textAlign: 'center'
      }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <i className="fa fa-plane" style={{ fontSize: '60px', marginBottom: '30px', opacity: 0.9 }}></i>
              <h1 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '20px' }}>
                Transfer Services
              </h1>
              <p style={{ fontSize: '1.2rem', opacity: 0.9, lineHeight: 1.6 }}>
                Professional and reliable transfer services to your destination. 
                Comfortable vehicles with experienced drivers for all passenger capacities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicle Capacity Selection */}
      <section style={{ padding: '60px 0', backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '600', color: '#333', marginBottom: '15px' }}>
              Choose Your Vehicle
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#666' }}>
              Select the vehicle type that best fits your group size
            </p>
          </div>

          <div className="row">
            {capacityOptions.map((option) => (
              <div key={option.key} className="col-lg-4 col-md-6 mb-4">
                <div 
                  className={`card h-100 ${selectedCapacity === option.key ? 'border-primary bg-primary text-white' : ''}`}
                  style={{ 
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: selectedCapacity === option.key ? '3px solid #007bff' : '1px solid #dee2e6'
                  }}
                  onClick={() => setSelectedCapacity(option.key)}
                >
                  <div className="card-body text-center" style={{ padding: '30px' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>
                      {option.icon}
                    </div>
                    <h5 className="card-title" style={{ fontWeight: '600', marginBottom: '10px' }}>
                      {option.label}
                    </h5>
                    <p className="card-text" style={{ 
                      opacity: selectedCapacity === option.key ? 0.9 : 0.7,
                      marginBottom: '15px'
                    }}>
                      {option.description}
                    </p>
                    <div style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      fontSize: '0.9rem',
                      fontWeight: '500'
                    }}>
                      <i className="fa fa-users"></i>
                      Max {option.maxPassengers} passengers
                    </div>
                    {selectedCapacity === option.key && (
                      <div style={{ marginTop: '15px' }}>
                        <i className="fa fa-check" style={{ fontSize: '20px' }}></i>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transfer Zones & Pricing */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '600', color: '#333', marginBottom: '15px' }}>
              Destinations & Pricing
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#666' }}>
              Pricing for {getSelectedCapacityInfo()?.label} - {getSelectedCapacityInfo()?.description}
            </p>
          </div>

          {error ? (
            <div className="alert alert-danger text-center">
              <h5>Unable to load transfer zones</h5>
              <p>{error}</p>
            </div>
          ) : zones.length === 0 ? (
            <div className="text-center" style={{ color: '#666', padding: '40px 0' }}>
              <i className="fa fa-car" style={{ fontSize: '60px', opacity: 0.3, marginBottom: '20px' }}></i>
              <h5>No transfer zones available</h5>
              <p>Please contact us for custom transfer arrangements.</p>
            </div>
          ) : (
            <div className="row">
              {zones.map((zone) => (
                <div key={zone.id} className="col-lg-6 col-md-6 mb-4">
                  <div className="card h-100 shadow-sm">
                    <div className="card-body" style={{ padding: '25px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                        <i className="fa fa-map-marker" 
                          style={{ 
                            fontSize: '24px', 
                            color: '#007bff', 
                            marginTop: '5px', 
                            flexShrink: 0 
                          }}
                        ></i>
                        <div style={{ flex: 1 }}>
                          <h5 style={{ fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                            {zone.zoneName}
                          </h5>
                          {zone.description && (
                            <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '15px' }}>
                              {zone.description}
                            </p>
                          )}
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            backgroundColor: '#f8f9fa',
                            padding: '15px',
                            borderRadius: '8px'
                          }}>
                            <span style={{ color: '#666', fontSize: '0.9rem' }}>
                              {getSelectedCapacityInfo()?.label}
                            </span>
                            <span style={{ 
                              fontSize: '1.5rem', 
                              fontWeight: '700', 
                              color: '#28a745' 
                            }}>
                              €{getPrice(zone, selectedCapacity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center" style={{ marginTop: '40px' }}>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>
              * Prices are in EUR and include VAT. Additional charges may apply for waiting time, tolls, or special requests.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '60px 0', backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '600', color: '#333' }}>
              Why Choose Our Transfer Service?
            </h2>
          </div>

          <div className="row">
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="text-center">
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  backgroundColor: '#007bff',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  color: 'white'
                }}>
                  <i className="fa fa-car" style={{ fontSize: '30px' }}></i>
                </div>
                <h5 style={{ fontWeight: '600', color: '#333', marginBottom: '10px' }}>
                  Professional Drivers
                </h5>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                  Experienced, licensed drivers who know the local routes and speak multiple languages.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 mb-4">
              <div className="text-center">
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  backgroundColor: '#28a745',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  color: 'white'
                }}>
                  <i className="fa fa-check" style={{ fontSize: '30px' }}></i>
                </div>
                <h5 style={{ fontWeight: '600', color: '#333', marginBottom: '10px' }}>
                  Reliable Service
                </h5>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                  Punctual pickups and drop-offs with real-time tracking and 24/7 customer support.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 mb-4">
              <div className="text-center">
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  backgroundColor: '#ffc107',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  color: 'white'
                }}>
                  <i className="fa fa-users" style={{ fontSize: '30px' }}></i>
                </div>
                <h5 style={{ fontWeight: '600', color: '#333', marginBottom: '10px' }}>
                  Comfortable Vehicles
                </h5>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                  Modern, clean, and well-maintained vehicles with air conditioning and spacious interiors.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 mb-4">
              <div className="text-center">
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  backgroundColor: '#dc3545',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  color: 'white'
                }}>
                  <i className="fa fa-phone" style={{ fontSize: '30px' }}></i>
                </div>
                <h5 style={{ fontWeight: '600', color: '#333', marginBottom: '10px' }}>
                  Easy Booking
                </h5>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                  Simple online booking process with instant confirmation and flexible payment options.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="text-center" style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '600', color: '#333', marginBottom: '15px' }}>
                  Book Your Transfer
                </h2>
                <p style={{ fontSize: '1.1rem', color: '#666' }}>
                  Contact us to reserve your transfer service or get a custom quote
                </p>
              </div>

              {contactFormSuccess ? (
                <div className="alert alert-success text-center">
                  <i className="fa fa-check" style={{ fontSize: '40px', marginBottom: '15px' }}></i>
                  <h5>Request Submitted Successfully!</h5>
                  <p>We'll contact you shortly to confirm your transfer booking.</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setContactFormSuccess(false)}
                  >
                    Book Another Transfer
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="card" style={{ padding: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label" style={{ fontWeight: '600', color: '#333' }}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={contactForm.name}
                        onChange={handleFormChange}
                        required
                        style={{ padding: '12px' }}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label" style={{ fontWeight: '600', color: '#333' }}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={contactForm.email}
                        onChange={handleFormChange}
                        required
                        style={{ padding: '12px' }}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label" style={{ fontWeight: '600', color: '#333' }}>
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        className="form-control"
                        value={contactForm.phone}
                        onChange={handleFormChange}
                        required
                        style={{ padding: '12px' }}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label" style={{ fontWeight: '600', color: '#333' }}>
                        Number of Passengers *
                      </label>
                      <select
                        name="passengers"
                        className="form-control"
                        value={contactForm.passengers}
                        onChange={handleFormChange}
                        required
                        style={{ padding: '12px' }}
                      >
                        {Array.from({ length: getSelectedCapacityInfo()?.maxPassengers || 4 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1} passenger{i + 1 > 1 ? 's' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label" style={{ fontWeight: '600', color: '#333' }}>
                        Pickup Location *
                      </label>
                      <input
                        type="text"
                        name="pickupLocation"
                        className="form-control"
                        value={contactForm.pickupLocation}
                        onChange={handleFormChange}
                        required
                        placeholder="e.g., Hotel name, Address, Airport"
                        style={{ padding: '12px' }}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label" style={{ fontWeight: '600', color: '#333' }}>
                        Drop-off Location *
                      </label>
                      <input
                        type="text"
                        name="dropoffLocation"
                        className="form-control"
                        value={contactForm.dropoffLocation}
                        onChange={handleFormChange}
                        required
                        placeholder="Destination address"
                        style={{ padding: '12px' }}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label" style={{ fontWeight: '600', color: '#333' }}>
                        Date *
                      </label>
                      <input
                        type="date"
                        name="date"
                        className="form-control"
                        value={contactForm.date}
                        onChange={handleFormChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        style={{ padding: '12px' }}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label" style={{ fontWeight: '600', color: '#333' }}>
                        Time *
                      </label>
                      <input
                        type="time"
                        name="time"
                        className="form-control"
                        value={contactForm.time}
                        onChange={handleFormChange}
                        required
                        style={{ padding: '12px' }}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label" style={{ fontWeight: '600', color: '#333' }}>
                      Additional Information
                    </label>
                    <textarea
                      name="message"
                      className="form-control"
                      rows="4"
                      value={contactForm.message}
                      onChange={handleFormChange}
                      placeholder="Special requests, flight details, etc."
                      style={{ padding: '12px' }}
                    />
                  </div>

                  <div className="text-center">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={contactFormSubmitting}
                      style={{ 
                        padding: '12px 40px', 
                        fontSize: '1.1rem', 
                        fontWeight: '600',
                        backgroundColor: '#007bff',
                        border: 'none'
                      }}
                    >
                      {contactFormSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <i className="fa fa-envelope" style={{ marginRight: '8px' }}></i>
                          Request Transfer
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TransferService;