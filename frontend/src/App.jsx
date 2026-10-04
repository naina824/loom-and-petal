import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ProtectedRoute from './components/ProtectedRoute';

// Customer Pages
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CustomOrdersPage from './pages/CustomOrdersPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

// Admin Pages
import AdminLoginPage from './pages/AdminLoginPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminEnquiries from './pages/admin/AdminEnquiries';
import AdminSettings from './pages/admin/AdminSettings';

// Layout wrapper for customer-facing store
function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-cream-100 text-warmbrown-900 font-sans">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              {/* Customer Routes with Header & Footer */}
              <Route element={<CustomerLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/custom-orders" element={<CustomOrdersPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
              </Route>

              {/* Admin Login Route */}
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* Protected Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="products/new" element={<AdminProductForm />} />
                  <Route path="products/edit/:id" element={<AdminProductForm />} />
                  <Route path="enquiries" element={<AdminEnquiries />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
              </Route>

              {/* 404 Fallback */}
              <Route
                path="*"
                element={
                  <div className="min-h-screen bg-cream-100 flex flex-col items-center justify-center p-6 text-center space-y-4">
                    <span className="text-6xl">🧶</span>
                    <h1 className="font-serif text-3xl font-bold text-warmbrown-900">404 - Page Not Found</h1>
                    <p className="text-sm text-warmbrown-600">The stitch unravelled here! Let’s head back to safety.</p>
                    <a
                      href="/"
                      className="px-6 py-2.5 rounded-full bg-warmbrown-900 text-cream-50 text-xs font-semibold hover:bg-warmbrown-800 transition-colors"
                    >
                      Return Home
                    </a>
                  </div>
                }
              />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}
