// src/pages/admin/AdminBookings.jsx - Modern Bookings Management Page
import React, { useState, useEffect, useCallback } from "react";
import AdminLayout from "../../components/AdminLayout";
import { adminAPI } from "../../services/api";
import "./AdminBookings.css";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingBooking, setEditingBooking] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [availableCars, setAvailableCars] = useState([]);
  const [availableTransfers, setAvailableTransfers] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    serviceType: "all",
    page: 1,
  });

  // Form state for new/edit booking
  const [formData, setFormData] = useState({
    serviceType: "car_rental",
    carId: "",
    transferId: "",
    drivers: [{ name: "", surname: "", phoneNumber: "" }],
    pickupLocation: "",
    dropoffLocation: "",
    pickupTime: "",
    dropoffTime: "",
    transferData: {
      vehicleCapacity: "capacity_1_4",
      passengers: 1,
      flightNumber: "",
      notes: "",
    },
    specialRequests: "",
    pricing: { total: 0, currency: "EUR" },
  });

  // Available status options
  const statusOptions = [
    { value: "all", label: "All Status", color: "#6c757d" },
    { value: "pending", label: "Pending", color: "#ffc107" },
    { value: "confirmed", label: "Confirmed", color: "#17a2b8" },
    { value: "active", label: "Active", color: "#28a745" },
    { value: "completed", label: "Completed", color: "#6c757d" },
    { value: "cancelled", label: "Cancelled", color: "#dc3545" },
  ];

  const serviceTypeOptions = [
    { value: "all", label: "All Services" },
    { value: "car_rental", label: "Car Rental" },
    { value: "transfer", label: "Transfer Service" },
  ];

  // Fetch bookings from API
  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page: filters.page,
        limit: 20,
      };

      if (filters.search) params.search = filters.search;
      if (filters.status !== "all") params.status = filters.status;
      if (filters.serviceType !== "all")
        params.serviceType = filters.serviceType;

      console.log("📚 Fetching bookings with params:", params);

      const response = await adminAPI.getBookings(params);

      if (response.data.success) {
        setBookings(response.data.data.bookings || []);
      } else {
        throw new Error(response.data.error || "Failed to load bookings");
      }
    } catch (err) {
      console.error("❌ Fetch bookings error:", err);
      setError(
        err.response?.data?.error || err.message || "Failed to fetch bookings"
      );
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Load available cars and transfers
  const loadCarsAndTransfers = useCallback(async () => {
    try {
      console.log("🚗🚌 Loading cars and transfers...");

      // Load cars
      const carsResponse = await adminAPI.getCars();
      if (carsResponse.data.success) {
        setAvailableCars(carsResponse.data.data?.cars || []);
      }

      // Load transfer zones
      const transfersResponse = await adminAPI.getTransfers();
      if (transfersResponse.data.success) {
        setAvailableTransfers(transfersResponse.data.data || []);
      }
    } catch (err) {
      console.error("❌ Failed to load cars/transfers:", err);
    }
  }, []);

  // Load bookings on component mount and filter changes
  useEffect(() => {
    fetchBookings();
    loadCarsAndTransfers();
  }, [fetchBookings, loadCarsAndTransfers]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filtering
    }));
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("drivers.")) {
      const [, index, field] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        drivers: prev.drivers.map((driver, i) =>
          i === parseInt(index) ? { ...driver, [field]: value } : driver
        ),
      }));
    } else if (name.startsWith("transferData.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        transferData: {
          ...prev.transferData,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      serviceType: "car_rental",
      carId: "",
      transferId: "",
      drivers: [{ name: "", surname: "", phoneNumber: "" }],
      pickupLocation: "",
      dropoffLocation: "",
      pickupTime: "",
      dropoffTime: "",
      transferData: {
        vehicleCapacity: "capacity_1_4",
        passengers: 1,
        flightNumber: "",
        notes: "",
      },
      specialRequests: "",
      pricing: { total: 0, currency: "EUR" },
    });
  };

  // Handle edit booking - populate form with existing data
  const handleEditBooking = (booking) => {
    console.log("📝 Editing booking:", booking);

    // Set form data with existing booking information
    setFormData({
      serviceType: booking.serviceType || "car_rental",
      carId: booking.carId || "",
      transferId: booking.transferId || "",
      drivers: booking.drivers || [{ name: "", surname: "", phoneNumber: "" }],
      pickupLocation: booking.pickupLocation || "",
      dropoffLocation: booking.dropoffLocation || "",
      pickupTime: booking.pickupTime
        ? new Date(booking.pickupTime).toISOString().slice(0, 16)
        : "",
      dropoffTime: booking.dropoffTime
        ? new Date(booking.dropoffTime).toISOString().slice(0, 16)
        : "",
      transferData: booking.transferData || {
        vehicleCapacity: "capacity_1_4",
        passengers: 1,
        flightNumber: "",
        notes: "",
      },
      specialRequests: booking.specialRequests || "",
      pricing: booking.pricing || { total: 0, currency: "EUR" },
    });

    setEditingBooking(booking);
    setShowAddForm(true); // Reuse the same form for editing
  };

  // Handle update existing booking
  const handleUpdateBooking = async (e) => {
    e.preventDefault();

    if (!editingBooking) {
      console.error("❌ No booking selected for editing");
      return;
    }

    try {
      console.log("📝 Updating booking:", editingBooking.id, formData);

      const response = await adminAPI.updateBooking(
        editingBooking.id,
        formData
      );

      if (response.data.success) {
        await fetchBookings(); // Refresh the bookings list
        setShowAddForm(false);
        setEditingBooking(null);
        resetForm();
        alert("Booking updated successfully!");
      } else {
        throw new Error(response.data.error || "Failed to update booking");
      }
    } catch (err) {
      console.error("❌ Update booking error:", err);
      alert(
        `Error updating booking: ${err.response?.data?.error || err.message}`
      );
    }
  };

  // Handle create new booking
  const handleCreateBooking = async (e) => {
    e.preventDefault();

    try {
      console.log("📚 Creating new booking:", formData);

      const response = await adminAPI.createBooking(formData);

      if (response.data.success) {
        await fetchBookings(); // Refresh the bookings list
        setShowAddForm(false);
        resetForm();
        alert("Booking created successfully!");
      } else {
        throw new Error(response.data.error || "Failed to create booking");
      }
    } catch (err) {
      console.error("❌ Create booking error:", err);
      alert(
        `Error creating booking: ${err.response?.data?.error || err.message}`
      );
    }
  };

  // Handle cancel add/edit form
  const handleCancelAdd = () => {
    setShowAddForm(false);
    setEditingBooking(null);
    resetForm();
  };

  // Handle booking status update
  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      console.log("📊 Updating booking status:", bookingId, newStatus);

      const response = await adminAPI.updateBookingStatus(bookingId, {
        status: newStatus,
      });

      if (response.data.success) {
        await fetchBookings(); // Refresh the bookings list
        alert("Booking status updated successfully!");
      } else {
        throw new Error(response.data.error || "Failed to update status");
      }
    } catch (err) {
      console.error("❌ Update status error:", err);
      alert(
        `Error updating status: ${err.response?.data?.error || err.message}`
      );
    }
  };

  // Handle delete booking
  const handleDeleteBooking = async (bookingId, bookingRef) => {
    if (
      !confirm(
        `Are you sure you want to delete booking "${bookingRef}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      console.log("🗑️ Deleting booking:", bookingId);

      const response = await adminAPI.deleteBooking(bookingId);

      if (response.data.success) {
        await fetchBookings(); // Refresh the bookings list
        alert("Booking deleted successfully!");
      } else {
        throw new Error(response.data.error || "Failed to delete booking");
      }
    } catch (err) {
      console.error("❌ Delete booking error:", err);
      alert(
        `Error deleting booking: ${err.response?.data?.error || err.message}`
      );
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    const statusOption = statusOptions.find((opt) => opt.value === status);
    return statusOption ? statusOption.color : "#6c757d";
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("tr-TR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get service type badge
  const getServiceTypeBadge = (serviceType) => {
    const badges = {
      car_rental: { label: "Car Rental", color: "#007bff" },
      transfer: { label: "Transfer", color: "#28a745" },
    };
    return badges[serviceType] || { label: serviceType, color: "#6c757d" };
  };

  if (loading) {
    return (
      <AdminLayout
        title="Bookings Management"
        subtitle="Manage car rentals and transfer bookings"
      >
        <div className="bookings-loading">
          <div className="loading-spinner"></div>
          <p>Loading bookings...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Bookings Management"
      subtitle="Manage car rentals and transfer bookings"
    >
      <div className="bookings-container">
        <div className="bookings-header">
          <div className="header-actions">
            <button
              className="add-booking-btn"
              onClick={() => setShowAddForm(true)}
              disabled={showAddForm || editingBooking}
            >
              <i className="fa fa-plus"></i> Add New Booking
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <p>❌ {error}</p>
            <button onClick={fetchBookings}>Retry</button>
          </div>
        )}

        {/* Filters */}
        <div className="filters-container">
          <div className="filters-row">
            <div className="filter-group">
              <label>Search</label>
              <input
                type="text"
                placeholder="Search by reference, location, or driver..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label>Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="filter-select"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Service Type</label>
              <select
                value={filters.serviceType}
                onChange={(e) =>
                  handleFilterChange("serviceType", e.target.value)
                }
                className="filter-select"
              >
                {serviceTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <button onClick={fetchBookings} className="refresh-btn">
                <i className="fa fa-refresh"></i> Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Add/Edit Booking Form */}
        {showAddForm && (
          <div className="booking-form-container">
            <div className="booking-form-header">
              <h3>{editingBooking ? "Edit Booking" : "Add New Booking"}</h3>
              <button onClick={handleCancelAdd} className="close-btn">
                <i className="fa fa-times"></i>
              </button>
            </div>
            <form
              onSubmit={
                editingBooking ? handleUpdateBooking : handleCreateBooking
              }
              className="booking-form"
            >
              {/* Service Type Selection */}
              <div className="form-row">
                <div className="form-group">
                  <label>Service Type *</label>
                  <select
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="car_rental">Car Rental</option>
                    <option value="transfer">Transfer Service</option>
                  </select>
                </div>
              </div>

              {/* Car Selection (for car rental) */}
              {formData.serviceType === "car_rental" && (
                <div className="form-row">
                  <div className="form-group">
                    <label>Select Car *</label>
                    <select
                      name="carId"
                      value={formData.carId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Choose a car...</option>
                      {availableCars.map((car) => (
                        <option key={car.id} value={car.id}>
                          {car.title} - €{car.pricing?.daily || 0}/day
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Transfer Selection (for transfer) */}
              {formData.serviceType === "transfer" && (
                <div className="form-row">
                  <div className="form-group">
                    <label>Transfer Zone</label>
                    <select
                      name="transferId"
                      value={formData.transferId}
                      onChange={handleInputChange}
                    >
                      <option value="">Custom location...</option>
                      {availableTransfers.map((transfer) => (
                        <option key={transfer.id} value={transfer.id}>
                          {transfer.zoneName} - €
                          {transfer.pricing?.capacity_1_4 || 0}+
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Vehicle Capacity *</label>
                    <select
                      name="transferData.vehicleCapacity"
                      value={formData.transferData.vehicleCapacity}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="capacity_1_4">1-4 Passengers</option>
                      <option value="capacity_1_6">1-6 Passengers</option>
                      <option value="capacity_1_16">1-16 Passengers</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Customer Information */}
              <div className="form-section">
                <h4>Customer Information</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      name="drivers.0.name"
                      value={formData.drivers[0]?.name || ""}
                      onChange={handleInputChange}
                      required
                      placeholder="Customer first name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      name="drivers.0.surname"
                      value={formData.drivers[0]?.surname || ""}
                      onChange={handleInputChange}
                      required
                      placeholder="Customer last name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="drivers.0.phoneNumber"
                      value={formData.drivers[0]?.phoneNumber || ""}
                      onChange={handleInputChange}
                      required
                      placeholder="+90 123 456 7890"
                    />
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="form-section">
                <h4>Location & Time</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Pickup Location *</label>
                    <input
                      type="text"
                      name="pickupLocation"
                      value={formData.pickupLocation}
                      onChange={handleInputChange}
                      required
                      placeholder="Pickup address or location"
                    />
                  </div>
                  <div className="form-group">
                    <label>Dropoff Location *</label>
                    <input
                      type="text"
                      name="dropoffLocation"
                      value={formData.dropoffLocation}
                      onChange={handleInputChange}
                      required
                      placeholder="Dropoff address or location"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Pickup Date & Time *</label>
                    <input
                      type="datetime-local"
                      name="pickupTime"
                      value={formData.pickupTime}
                      onChange={handleInputChange}
                      required
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Dropoff Date & Time *</label>
                    <input
                      type="datetime-local"
                      name="dropoffTime"
                      value={formData.dropoffTime}
                      onChange={handleInputChange}
                      required
                      min={formData.pickupTime}
                    />
                  </div>
                </div>
              </div>

              {/* Transfer Specific Fields */}
              {formData.serviceType === "transfer" && (
                <div className="form-section">
                  <h4>Transfer Details</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Number of Passengers *</label>
                      <input
                        type="number"
                        name="transferData.passengers"
                        value={formData.transferData.passengers}
                        onChange={handleInputChange}
                        required
                        min="1"
                        max="16"
                      />
                    </div>
                    <div className="form-group">
                      <label>Flight Number</label>
                      <input
                        type="text"
                        name="transferData.flightNumber"
                        value={formData.transferData.flightNumber}
                        onChange={handleInputChange}
                        placeholder="TK123, PC456, etc."
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Transfer Notes</label>
                    <textarea
                      name="transferData.notes"
                      value={formData.transferData.notes}
                      onChange={handleInputChange}
                      placeholder="Any special instructions for the transfer..."
                      rows="3"
                    />
                  </div>
                </div>
              )}

              {/* Special Requests */}
              <div className="form-group">
                <label>Special Requests</label>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  placeholder="Any special requirements or notes..."
                  rows="3"
                />
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <button type="submit" className="save-btn">
                  <i className="fa fa-save"></i>{" "}
                  {editingBooking ? "Update Booking" : "Create Booking"}
                </button>
                <button
                  type="button"
                  onClick={handleCancelAdd}
                  className="cancel-btn"
                >
                  <i className="fa fa-times"></i> Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Bookings Table */}
        <div className="bookings-table-container">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Service</th>
                <th>Customer</th>
                <th>Pickup</th>
                <th>Dropoff</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="9" className="no-bookings">
                    No bookings found. Create a new booking to get started.
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => {
                  const serviceBadge = getServiceTypeBadge(booking.serviceType);
                  return (
                    <tr key={booking.id}>
                      <td>
                        <strong>{booking.bookingReference}</strong>
                      </td>
                      <td>
                        <span
                          className="service-badge"
                          style={{
                            backgroundColor: `${serviceBadge.color}20`,
                            color: serviceBadge.color,
                          }}
                        >
                          {serviceBadge.label}
                        </span>
                      </td>
                      <td>
                        <div className="customer-info">
                          <strong>
                            {booking.drivers?.[0]?.name}{" "}
                            {booking.drivers?.[0]?.surname}
                          </strong>
                          <small>{booking.drivers?.[0]?.phoneNumber}</small>
                        </div>
                      </td>
                      <td>
                        <div className="location-info">
                          {booking.pickupLocation}
                        </div>
                      </td>
                      <td>
                        <div className="location-info">
                          {booking.dropoffLocation}
                        </div>
                      </td>
                      <td>
                        <div className="date-info">
                          <strong>{formatDate(booking.pickupTime)}</strong>
                          <small>to {formatDate(booking.dropoffTime)}</small>
                        </div>
                      </td>
                      <td>
                        <select
                          value={booking.status}
                          onChange={(e) =>
                            updateBookingStatus(booking.id, e.target.value)
                          }
                          className="status-select"
                          style={{
                            backgroundColor: `${getStatusColor(
                              booking.status
                            )}20`,
                            color: getStatusColor(booking.status),
                          }}
                        >
                          {statusOptions
                            .filter((opt) => opt.value !== "all")
                            .map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                        </select>
                      </td>
                      <td>
                        <strong style={{ color: "#28a745" }}>
                          {"EUR"} {booking.pricing?.total || 0}
                        </strong>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => handleEditBooking(booking)}
                            className="edit-btn"
                            title="Edit booking"
                            disabled={showAddForm}
                          >
                            <i className="fa fa-edit"></i>
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteBooking(
                                booking.id,
                                booking.bookingReference
                              )
                            }
                            className="delete-btn"
                            title="Delete booking"
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Statistics Cards */}
        <div className="stats-container">
          <div className="stat-card">
            <h3>Total Bookings</h3>
            <div className="stat-value">{bookings.length}</div>
          </div>
          <div className="stat-card">
            <h3>Pending</h3>
            <div className="stat-value" style={{ color: "#ffc107" }}>
              {bookings.filter((b) => b.status === "pending").length}
            </div>
          </div>
          <div className="stat-card">
            <h3>Active</h3>
            <div className="stat-value" style={{ color: "#28a745" }}>
              {bookings.filter((b) => b.status === "active").length}
            </div>
          </div>
          <div className="stat-card">
            <h3>Completed</h3>
            <div className="stat-value" style={{ color: "#6c757d" }}>
              {bookings.filter((b) => b.status === "completed").length}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBookings;
