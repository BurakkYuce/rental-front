import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");
    console.log(
      "🔗 API Request interceptor:",
      config.method?.toUpperCase(),
      config.url
    );
    console.log("🔗 Token available:", !!token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔗 Authorization header set");
    } else {
      console.log("🔗 No token available for request");
    }
    return config;
  },
  (error) => {
    console.error("🔗 Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log("🔗 API Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error(
      "🔗 API Response Error:",
      error.response?.status,
      error.config?.url
    );
    console.error("🔗 Error details:", error.response?.data);

    if (error.response?.status === 401) {
      console.log("🔗 401 Unauthorized - clearing tokens and redirecting");
      // Token expired or invalid, remove from storage and redirect to login
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

// Authentication functions
export const authAPI = {
  login: (credentials) => api.post("/auth/admin/login", credentials),
  register: (userData) => api.post("/admin/register", userData),
  getCurrentUser: () => api.get("/auth/admin/me"),
  logout: () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    return Promise.resolve();
  },
};

const imageUploadFunctions = {
  // Tek resim yükleme
  uploadCarImage: (file) => {
    const formData = new FormData();
    formData.append("image", file);

    return api.post("/images/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Çoklu resim yükleme
  uploadCarImages: async (files) => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append("images", file);
    });

    return api.post("/images/upload-multiple", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Resim silme
  deleteCarImage: (imagePath) => {
    return api.delete("/images/delete", {
      data: { imagePath },
    });
  },
};

// Admin Dashboard API functions
export const adminAPI = {
  // Dashboard stats
  getDashboardStats: () => api.get("/admin/dashboard/stats"),
  getRecentActivity: () => api.get("/admin/dashboard/recent-bookings"),

  // Car management (admin endpoints)
  getCars: (params = {}) => api.get("/admin/cars", { params }),
  getCarById: (id) => api.get(`/admin/cars/${id}`),
  createCar: (carData) => api.post("/admin/cars", carData),
  updateCar: (id, carData) => api.put(`/admin/cars/${id}`, carData),
  deleteCar: (id) => api.delete(`/admin/cars/${id}`),
  updateCarStatus: (id, status) =>
    api.patch(`/admin/cars/${id}/status`, { status }),
  uploadCarImage: imageUploadFunctions.uploadCarImage,
  uploadCarImages: imageUploadFunctions.uploadCarImages,
  deleteCarImage: imageUploadFunctions.deleteCarImage,

  // Araç oluştururken resim ile
  createCarWithImage: async (carData, imageFile) => {
    try {
      // Önce resim yükle
      const imageResponse = await imageUploadFunctions.uploadCarImage(
        imageFile
      );
      const imageUrl = imageResponse.data.imageUrl;

      // Sonra araç verisini resim URL'i ile oluştur
      const carWithImage = {
        ...carData,
        image: imageUrl,
      };

      return api.post("/admin/cars", carWithImage);
    } catch (error) {
      console.error("Araç ve resim oluşturma hatası:", error);
      throw error;
    }
  },

  // Araç güncellerken resim ile
  updateCarWithImage: async (id, carData, imageFile = null) => {
    try {
      let updatedCarData = { ...carData };

      // Eğer yeni resim varsa, önce yükle
      if (imageFile) {
        const imageResponse = await imageUploadFunctions.uploadCarImage(
          imageFile
        );
        updatedCarData.image = imageResponse.data.imageUrl;
      }

      return api.put(`/admin/cars/${id}`, updatedCarData);
    } catch (error) {
      console.error("Araç güncelleme hatası:", error);
      throw error;
    }
  },

  // Booking management - GÜNCELLENDİ
  getBookings: (params = {}) => api.get("/admin/bookings", { params }),
  getBookingById: (id) => api.get(`/admin/bookings/${id}`),
  createBooking: (bookingData) => api.post("/admin/bookings", bookingData),
  updateBooking: (id, bookingData) =>
    api.put(`/admin/bookings/${id}`, bookingData),
  deleteBooking: (id) => api.delete(`/admin/bookings/${id}`),
  updateBookingStatus: (id, statusData) =>
    api.put(`/admin/bookings/${id}/status`, statusData),
  getBookingStatistics: () => api.get("/admin/bookings/statistics"),

  // Transfer management - YENİ EKLENDI
  getTransfers: () => api.get("/admin/transfers"),
  getTransferById: (id) => api.get(`/admin/transfers/${id}`),
  createTransfer: (transferData) => api.post("/admin/transfers", transferData),
  updateTransfer: (id, transferData) =>
    api.put(`/admin/transfers/${id}`, transferData),
  deleteTransfer: (id) => api.delete(`/admin/transfers/${id}`),

  // News management
  getNews: (params = {}) => api.get("/news/admin", { params }),
  getNewsById: (id) => api.get(`/news/admin/${id}`),
  createNews: (newsData) => api.post("/news/admin", newsData),
  updateNews: (id, newsData) => api.put(`/news/admin/${id}`, newsData),
  deleteNews: (id) => api.delete(`/news/admin/${id}`),
  toggleNewsFeatured: (id) => api.patch(`/news/admin/${id}/featured`),
  updateNewsStatus: (id, statusData) =>
    api.patch(`/news/admin/${id}/status`, statusData),

  // Exchange Rate management (automated system)
  getCurrentExchangeRates: () => api.get("/admin/exchange-rates"),
  getExchangeRateHistory: (params = {}) =>
    api.get("/admin/exchange-rates/history", { params }),
  forceUpdateExchangeRates: () => api.put("/admin/exchange-rates"), // Manual trigger for automated update
  getExchangeRateSystemStatus: () => api.get("/admin/exchange-rates/status"),

  // Blog management
  getBlogPosts: (params = {}) => api.get("/admin/blogs", { params }),
  getBlogPostById: (id) => api.get(`/admin/blogs/${id}`),
  createBlogPost: (blogData) => api.post("/admin/blogs", blogData),
  updateBlogPost: (id, blogData) => api.put(`/admin/blogs/${id}`, blogData),
  deleteBlogPost: (id) => api.delete(`/admin/blogs/${id}`),
  toggleBlogFeatured: (id) => api.patch(`/admin/blogs/${id}/featured`),
  updateBlogStatus: (id, statusData) =>
    api.patch(`/admin/blogs/${id}/status`, statusData),
};

// Public API functions (for non-admin frontend)
export const publicAPI = {
  // New PostgreSQL endpoints
  getCars: (params = {}) => api.get("/listings", { params }),
  getCarById: (id) => api.get(`/listings/${id}`),
  getListingFilters: () => api.get("/listings/filters"),

  // Blog/News endpoints (using blogs routes)
  getNews: (params = {}) => api.get("/blogs", { params }),
  getNewsById: (slug) => api.get(`/blogs/${slug}`),
  getBlogPosts: (params = {}) => api.get("/blogs", { params }),
  createBooking: (bookingData) => api.post("/bookings", bookingData),

  // Transfer endpoints - YENİ EKLENDI
  getTransfers: () => api.get("/transfers"),
  getTransferById: (id) => api.get(`/transfers/${id}`),

  // Currency/Exchange Rate functions (automated system)
  getCurrentExchangeRates: () => api.get("/exchange-rates/current"),
  getSupportedCurrencies: () => api.get("/exchange-rates/currencies"),
  convertCurrency: (conversionData) =>
    api.post("/exchange-rates/convert", conversionData),
  convertCurrencyAutomated: (conversionData) =>
    api.post("/exchange-rates/convert-auto", conversionData),
};

// Blog API functions
export const blogAPI = {
  // Public blog functions (using blogs endpoints)
  getBlogs: (params = {}) => api.get("/blogs", { params }),
  getBlogBySlug: (slug) => api.get(`/blogs/${slug}`),
  getFeaturedBlogs: (params = {}) =>
    api.get("/blogs", { params: { ...params, featured: true } }),
  getCategories: () => api.get("/blogs/categories"),
  getTags: (params = {}) => api.get("/blogs/tags", { params }),
  searchBlogs: (params = {}) => api.get("/blogs/search", { params }),
};

// Utility functions
export const setAuthToken = (token) => {
  console.log("🔑 setAuthToken called with token:", token ? "YES" : "NO");
  console.log("🔑 Token preview:", token?.substring(0, 20) + "...");

  if (token) {
    try {
      localStorage.setItem("admin_token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      console.log("✅ Token stored in localStorage and axios headers");
      console.log(
        "✅ localStorage verification:",
        !!localStorage.getItem("admin_token")
      );
      console.log(
        "✅ Axios header verification:",
        !!api.defaults.headers.common["Authorization"]
      );
    } catch (error) {
      console.error("❌ Error storing token:", error);
    }
  } else {
    localStorage.removeItem("admin_token");
    delete api.defaults.headers.common["Authorization"];
    console.log("🗑️ Token removed from localStorage and axios headers");
  }
};

export const getAuthToken = () => {
  return localStorage.getItem("admin_token");
};

export const isAuthenticated = () => {
  const token = getAuthToken();
  return !!token;
};

export default api;
