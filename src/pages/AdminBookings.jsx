// AdminBookings.jsx - Booking Management Component
import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { adminAPI } from '../services/api';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Form state for creating/editing bookings
  const [formData, setFormData] = useState({
    carId: '',
    drivers: [{ name: '', surname: '', phoneNumber: '' }],
    pickupLocation: '',
    dropoffLocation: '',
    pickupTime: '',
    dropoffTime: ''
  });

  useEffect(() => {
    loadBookings();
    loadCars();
  }, [currentPage, searchTerm, statusFilter]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter })
      };
      
      const response = await adminAPI.getBookings(params);
      setBookings(response.data.data.bookings || []);
      setTotalPages(response.data.data.pagination?.totalPages || 1);
    } catch (err) {
      console.error('Failed to load bookings:', err);
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const loadCars = async () => {
    try {
      const response = await adminAPI.getCars({ limit: 100 });
      setCars(response.data.data.cars || []);
    } catch (err) {
      console.error('Failed to load cars:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Validate drivers data
      const validDrivers = formData.drivers.filter(
        driver => driver.name && driver.surname && driver.phoneNumber
      );

      if (validDrivers.length === 0) {
        setError('At least one driver with complete information is required');
        return;
      }

      const bookingData = {
        ...formData,
        drivers: validDrivers,
        pickupTime: new Date(formData.pickupTime).toISOString(),
        dropoffTime: new Date(formData.dropoffTime).toISOString()
      };

      if (editingBooking) {
        await adminAPI.updateBooking(editingBooking._id, bookingData);
      } else {
        await adminAPI.createBooking(bookingData);
      }

      setShowModal(false);
      setEditingBooking(null);
      resetForm();
      loadBookings();
    } catch (err) {
      console.error('Failed to save booking:', err);
      setError(err.response?.data?.error || 'Failed to save booking');
    }
  };

  const handleEdit = (booking) => {
    setEditingBooking(booking);
    setFormData({
      carId: booking.car?._id || '',
      drivers: booking.drivers || [{ name: '', surname: '', phoneNumber: '' }],
      pickupLocation: booking.pickupLocation || '',
      dropoffLocation: booking.dropoffLocation || '',
      pickupTime: booking.pickupTime ? new Date(booking.pickupTime).toISOString().slice(0, 16) : '',
      dropoffTime: booking.dropoffTime ? new Date(booking.dropoffTime).toISOString().slice(0, 16) : ''
    });
    setShowModal(true);
  };

  const handleDelete = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;

    try {
      await adminAPI.deleteBooking(bookingId);
      loadBookings();
    } catch (err) {
      console.error('Failed to delete booking:', err);
      setError('Failed to delete booking');
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await adminAPI.updateBooking(bookingId, { status: newStatus });
      loadBookings();
    } catch (err) {
      console.error('Failed to update status:', err);
      setError('Failed to update booking status');
    }
  };

  const resetForm = () => {
    setFormData({
      carId: '',
      drivers: [{ name: '', surname: '', phoneNumber: '' }],
      pickupLocation: '',
      dropoffLocation: '',
      pickupTime: '',
      dropoffTime: ''
    });
  };

  const addDriver = () => {
    setFormData({
      ...formData,
      drivers: [...formData.drivers, { name: '', surname: '', phoneNumber: '' }]
    });
  };

  const updateDriver = (index, field, value) => {
    const updatedDrivers = formData.drivers.map((driver, i) =>
      i === index ? { ...driver, [field]: value } : driver
    );
    setFormData({ ...formData, drivers: updatedDrivers });
  };

  const removeDriver = (index) => {
    if (formData.drivers.length > 1) {
      const updatedDrivers = formData.drivers.filter((_, i) => i !== index);
      setFormData({ ...formData, drivers: updatedDrivers });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      Pending: 'bg-warning',
      Active: 'bg-primary',
      Completed: 'bg-success',
      Cancelled: 'bg-danger'
    };
    return `badge ${statusColors[status] || 'bg-secondary'}`;
  };

  return (
    <AdminLayout>
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h4 className="card-title mb-0">Booking Management</h4>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setEditingBooking(null);
                    resetForm();
                    setShowModal(true);
                  }}
                >
                  <i className="fas fa-plus me-2"></i>Add New Booking
                </button>
              </div>

              <div className="card-body">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                {/* Filters */}
                <div className="row mb-3">
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search bookings..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="col-md-3">
                    <select
                      className="form-select"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="">All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="Active">Active</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Bookings Table */}
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Booking ID</th>
                        <th>Car</th>
                        <th>Driver(s)</th>
                        <th>Pickup</th>
                        <th>Dropoff</th>
                        <th>Status</th>
                        <th>Total Price</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="8" className="text-center">
                            <div className="spinner-border" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                          </td>
                        </tr>
                      ) : bookings.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="text-center">
                            No bookings found
                          </td>
                        </tr>
                      ) : (
                        bookings.map((booking) => (
                          <tr key={booking._id}>
                            <td>#{booking.bookingReference}</td>
                            <td>{booking.car?.title || 'N/A'}</td>
                            <td>
                              {booking.drivers?.map((driver, index) => (
                                <div key={index}>
                                  {driver.name} {driver.surname}
                                  <br />
                                  <small className="text-muted">{driver.phoneNumber}</small>
                                </div>
                              ))}
                            </td>
                            <td>
                              <div>{booking.pickupLocation}</div>
                              <small className="text-muted">
                                {formatDate(booking.pickupTime)}
                              </small>
                            </td>
                            <td>
                              <div>{booking.dropoffLocation}</div>
                              <small className="text-muted">
                                {formatDate(booking.dropoffTime)}
                              </small>
                            </td>
                            <td>
                              <span className={getStatusBadge(booking.status)}>
                                {booking.status}
                              </span>
                            </td>
                            <td>
                              {booking.pricing?.currency} {booking.pricing?.totalPrice}
                            </td>
                            <td>
                              <div className="btn-group" role="group">
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => handleEdit(booking)}
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <div className="dropdown">
                                  <button
                                    className="btn btn-sm btn-outline-secondary dropdown-toggle"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                  >
                                    Status
                                  </button>
                                  <ul className="dropdown-menu">
                                    <li>
                                      <button
                                        className="dropdown-item"
                                        onClick={() => handleStatusUpdate(booking._id, 'Pending')}
                                      >
                                        Pending
                                      </button>
                                    </li>
                                    <li>
                                      <button
                                        className="dropdown-item"
                                        onClick={() => handleStatusUpdate(booking._id, 'Active')}
                                      >
                                        Active
                                      </button>
                                    </li>
                                    <li>
                                      <button
                                        className="dropdown-item"
                                        onClick={() => handleStatusUpdate(booking._id, 'Completed')}
                                      >
                                        Completed
                                      </button>
                                    </li>
                                    <li>
                                      <button
                                        className="dropdown-item"
                                        onClick={() => handleStatusUpdate(booking._id, 'Cancelled')}
                                      >
                                        Cancelled
                                      </button>
                                    </li>
                                  </ul>
                                </div>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDelete(booking._id)}
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <nav>
                    <ul className="pagination justify-content-center">
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </button>
                      </li>
                      {[...Array(totalPages)].map((_, index) => (
                        <li
                          key={index + 1}
                          className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                        >
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(index + 1)}
                          >
                            {index + 1}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal for Add/Edit Booking */}
        {showModal && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingBooking ? 'Edit Booking' : 'Add New Booking'}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    {error && (
                      <div className="alert alert-danger" role="alert">
                        {error}
                      </div>
                    )}

                    {/* Car Selection */}
                    <div className="mb-3">
                      <label className="form-label">Car *</label>
                      <select
                        className="form-select"
                        value={formData.carId}
                        onChange={(e) => setFormData({ ...formData, carId: e.target.value })}
                        required
                      >
                        <option value="">Select a car</option>
                        {cars.map((car) => (
                          <option key={car._id} value={car._id}>
                            {car.title} - {car.pricing?.daily} {car.currency}/day
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Drivers */}
                    <div className="mb-3">
                      <label className="form-label">
                        Drivers * 
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary ms-2"
                          onClick={addDriver}
                        >
                          Add Driver
                        </button>
                      </label>
                      {formData.drivers.map((driver, index) => (
                        <div key={index} className="border rounded p-3 mb-2">
                          <div className="row">
                            <div className="col-md-4">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="First Name"
                                value={driver.name}
                                onChange={(e) => updateDriver(index, 'name', e.target.value)}
                                required
                              />
                            </div>
                            <div className="col-md-4">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Last Name"
                                value={driver.surname}
                                onChange={(e) => updateDriver(index, 'surname', e.target.value)}
                                required
                              />
                            </div>
                            <div className="col-md-3">
                              <input
                                type="tel"
                                className="form-control"
                                placeholder="Phone Number"
                                value={driver.phoneNumber}
                                onChange={(e) => updateDriver(index, 'phoneNumber', e.target.value)}
                                required
                              />
                            </div>
                            <div className="col-md-1">
                              {formData.drivers.length > 1 && (
                                <button
                                  type="button"
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => removeDriver(index)}
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Locations and Times */}
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Pickup Location *</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.pickupLocation}
                            onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Dropoff Location *</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.dropoffLocation}
                            onChange={(e) => setFormData({ ...formData, dropoffLocation: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Pickup Time *</label>
                          <input
                            type="datetime-local"
                            className="form-control"
                            value={formData.pickupTime}
                            onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Dropoff Time *</label>
                          <input
                            type="datetime-local"
                            className="form-control"
                            value={formData.dropoffTime}
                            onChange={(e) => setFormData({ ...formData, dropoffTime: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {editingBooking ? 'Update Booking' : 'Create Booking'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminBookings;