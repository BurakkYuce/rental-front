// src/pages/admin/TransferZones.jsx - Transfer Zones Management Page
import React, { useState, useEffect, useCallback } from "react";
import AdminLayout from "../../components/AdminLayout";
import { adminAPI } from "../../services/api";
import "./TransferZones.css";

const TransferZones = () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingZone, setEditingZone] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state for new/edit zone
  const [formData, setFormData] = useState({
    zoneName: "",
    description: "",
    pricing: {
      capacity_1_4: "",
      capacity_1_6: "",
      capacity_1_16: "",
    },
    displayOrder: 0,
    status: "active",
  });

  // Fetch transfer zones from API
  const fetchZones = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await adminAPI.getTransfers();

      console.log("🚌 Transfer zones API response:", response);

      if (response.data.success) {
        setZones(response.data.data || []);
      } else {
        throw new Error(response.data.error || "Failed to fetch zones");
      }
    } catch (err) {
      console.error("❌ Fetch zones error:", err);
      setError(
        err.response?.data?.error ||
          err.message ||
          "Failed to fetch transfer zones"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Load zones on component mount
  useEffect(() => {
    fetchZones();
  }, [fetchZones]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("pricing.")) {
      const pricingField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        pricing: {
          ...prev.pricing,
          [pricingField]: value,
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
      zoneName: "",
      description: "",
      pricing: {
        capacity_1_4: "",
        capacity_1_6: "",
        capacity_1_16: "",
      },
      displayOrder: 0,
      status: "active",
    });
  };

  // Handle create new zone
  const handleCreateZone = async (e) => {
    e.preventDefault();

    try {
      const transferData = {
        ...formData,
        pricing: {
          capacity_1_4: parseFloat(formData.pricing.capacity_1_4),
          capacity_1_6: parseFloat(formData.pricing.capacity_1_6),
          capacity_1_16: parseFloat(formData.pricing.capacity_1_16),
          currency: "EUR",
        },
        displayOrder: parseInt(formData.displayOrder),
      };

      console.log("🚌 Creating transfer zone:", transferData);

      const response = await adminAPI.createTransfer(transferData);

      if (response.data.success) {
        await fetchZones(); // Refresh the zones list
        setShowAddForm(false);
        resetForm();
        alert("Transfer zone created successfully!");
      } else {
        throw new Error(response.data.error || "Failed to create zone");
      }
    } catch (err) {
      console.error("❌ Create zone error:", err);
      alert(`Error creating zone: ${err.response?.data?.error || err.message}`);
    }
  };

  // Handle edit zone
  const startEditZone = (zone) => {
    setEditingZone(zone.id);
    setFormData({
      zoneName: zone.zoneName || "",
      description: zone.description || "",
      pricing: {
        capacity_1_4: zone.pricing?.capacity_1_4?.toString() || "",
        capacity_1_6: zone.pricing?.capacity_1_6?.toString() || "",
        capacity_1_16: zone.pricing?.capacity_1_16?.toString() || "",
      },
      displayOrder: zone.displayOrder || 0,
      status: zone.status || "active",
    });
  };

  // Handle update zone
  const handleUpdateZone = async (zoneId) => {
    try {
      const transferData = {
        ...formData,
        pricing: {
          capacity_1_4: parseFloat(formData.pricing.capacity_1_4),
          capacity_1_6: parseFloat(formData.pricing.capacity_1_6),
          capacity_1_16: parseFloat(formData.pricing.capacity_1_16),
          currency: "EUR",
        },
        displayOrder: parseInt(formData.displayOrder),
      };

      console.log("🚌 Updating transfer zone:", zoneId, transferData);

      const response = await adminAPI.updateTransfer(zoneId, transferData);

      if (response.data.success) {
        await fetchZones(); // Refresh the zones list
        setEditingZone(null);
        resetForm();
        alert("Transfer zone updated successfully!");
      } else {
        throw new Error(response.data.error || "Failed to update zone");
      }
    } catch (err) {
      console.error("❌ Update zone error:", err);
      alert(`Error updating zone: ${err.response?.data?.error || err.message}`);
    }
  };

  // Handle delete zone
  const handleDeleteZone = async (zoneId, zoneName) => {
    if (
      !confirm(
        `Are you sure you want to delete "${zoneName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      console.log("🚌 Deleting transfer zone:", zoneId);

      const response = await adminAPI.deleteTransfer(zoneId);

      if (response.data.success) {
        await fetchZones(); // Refresh the zones list
        alert("Transfer zone deleted successfully!");
      } else {
        throw new Error(response.data.error || "Failed to delete zone");
      }
    } catch (err) {
      console.error("❌ Delete zone error:", err);
      alert(`Error deleting zone: ${err.response?.data?.error || err.message}`);
    }
  };

  // Handle cancel editing
  const handleCancelEdit = () => {
    setEditingZone(null);
    setShowAddForm(false);
    resetForm();
  };

  if (loading) {
    return (
      <AdminLayout
        title="Transfer Zones Management"
        subtitle="Manage transfer destinations and pricing"
      >
        <div className="transfer-zones-loading">
          <div className="loading-spinner"></div>
          <p>Loading transfer zones...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Transfer Zones Management"
      subtitle="Manage transfer destinations and pricing"
    >
      <div className="transfer-zones-container">
        <div className="transfer-zones-header">
          <button
            className="add-zone-btn"
            onClick={() => setShowAddForm(true)}
            disabled={showAddForm || editingZone}
          >
            <i className="fa fa-plus"></i> Add New Zone
          </button>
        </div>

        {error && (
          <div className="error-message">
            <p>❌ {error}</p>
            <button onClick={fetchZones}>Retry</button>
          </div>
        )}

        {/* Add Zone Form */}
        {showAddForm && (
          <div className="zone-form-container">
            <div className="zone-form-header">
              <h3>Add New Transfer Zone</h3>
              <button onClick={handleCancelEdit} className="close-btn">
                <i className="fa fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleCreateZone} className="zone-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Zone Name *</label>
                  <input
                    type="text"
                    name="zoneName"
                    value={formData.zoneName}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., İzmir Şehir Merkezi"
                  />
                </div>
                <div className="form-group">
                  <label>Display Order</label>
                  <input
                    type="number"
                    name="displayOrder"
                    value={formData.displayOrder}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Description of the transfer zone..."
                  rows="3"
                />
              </div>

              <div className="pricing-section">
                <h4>Pricing (EUR)</h4>
                <div className="pricing-grid">
                  <div className="form-group">
                    <label>1-4 Passengers *</label>
                    <input
                      type="number"
                      name="pricing.capacity_1_4"
                      value={formData.pricing.capacity_1_4}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      placeholder="110.00"
                    />
                  </div>
                  <div className="form-group">
                    <label>1-6 Passengers *</label>
                    <input
                      type="number"
                      name="pricing.capacity_1_6"
                      value={formData.pricing.capacity_1_6}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      placeholder="140.00"
                    />
                  </div>
                  <div className="form-group">
                    <label>1-16 Passengers *</label>
                    <input
                      type="number"
                      name="pricing.capacity_1_16"
                      value={formData.pricing.capacity_1_16}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      placeholder="190.00"
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn">
                  <i className="fa fa-save"></i> Create Zone
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="cancel-btn"
                >
                  <i className="fa fa-times"></i> Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Zones Table */}
        <div className="zones-table-container">
          <table className="zones-table">
            <thead>
              <tr>
                <th>Zone Name</th>
                <th>1-4 Pass</th>
                <th>1-6 Pass</th>
                <th>1-16 Pass</th>
                <th>Order</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {zones.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-zones">
                    No transfer zones found. Click "Add New Zone" to create one.
                  </td>
                </tr>
              ) : (
                zones.map((zone) => (
                  <tr
                    key={zone.id}
                    className={
                      zone.status === "inactive" ? "inactive-zone" : ""
                    }
                  >
                    {editingZone === zone.id ? (
                      // Edit mode row
                      <>
                        <td>
                          <input
                            type="text"
                            name="zoneName"
                            value={formData.zoneName}
                            onChange={handleInputChange}
                            className="edit-input"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="pricing.capacity_1_4"
                            value={formData.pricing.capacity_1_4}
                            onChange={handleInputChange}
                            className="edit-input small"
                            step="0.01"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="pricing.capacity_1_6"
                            value={formData.pricing.capacity_1_6}
                            onChange={handleInputChange}
                            className="edit-input small"
                            step="0.01"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="pricing.capacity_1_16"
                            value={formData.pricing.capacity_1_16}
                            onChange={handleInputChange}
                            className="edit-input small"
                            step="0.01"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="displayOrder"
                            value={formData.displayOrder}
                            onChange={handleInputChange}
                            className="edit-input small"
                            min="0"
                          />
                        </td>
                        <td>
                          <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className="edit-select"
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              onClick={() => handleUpdateZone(zone.id)}
                              className="save-btn small"
                              title="Save changes"
                            >
                              <i className="fa fa-save"></i>
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="cancel-btn small"
                              title="Cancel editing"
                            >
                              <i className="fa fa-times"></i>
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      // Display mode row
                      <>
                        <td>
                          <div className="zone-info">
                            <strong>{zone.zoneName}</strong>
                            {zone.description && (
                              <small>{zone.description}</small>
                            )}
                          </div>
                        </td>
                        <td>€{zone.pricing?.capacity_1_4 || 0}</td>
                        <td>€{zone.pricing?.capacity_1_6 || 0}</td>
                        <td>€{zone.pricing?.capacity_1_16 || 0}</td>
                        <td>{zone.displayOrder}</td>
                        <td>
                          <span className={`status-badge ${zone.status}`}>
                            {zone.status === "active" ? (
                              <i className="fa fa-eye"></i>
                            ) : (
                              <i className="fa fa-eye-slash"></i>
                            )}
                            {zone.status}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              onClick={() => startEditZone(zone)}
                              className="edit-btn"
                              title="Edit zone"
                              disabled={editingZone || showAddForm}
                            >
                              <i className="fa fa-edit"></i>
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteZone(zone.id, zone.zoneName)
                              }
                              className="delete-btn"
                              title="Delete zone"
                              disabled={editingZone || showAddForm}
                            >
                              <i className="fa fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default TransferZones;
