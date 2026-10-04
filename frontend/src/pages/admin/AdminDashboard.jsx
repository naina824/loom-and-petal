import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../../utils/api';
import { useSettings } from '../../context/SettingsContext';
import {
  Package,
  CheckCircle,
  AlertTriangle,
  Inbox,
  Plus,
  ArrowRight,
  Sparkles,
  MessageCircle,
  Clock,
  Edit2,
  Trash2,
} from 'lucide-react';

export default function AdminDashboard() {
  const { formatPrice } = useSettings();
  const [products, setProducts] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    availableProducts: 0,
    outOfStockProducts: 0,
    totalEnquiries: 0,
    newEnquiries: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      const [prodsData, enqData] = await Promise.all([
        apiRequest('/products'),
        apiRequest('/enquiries'),
      ]);

      setProducts(prodsData);
      setEnquiries(enqData.enquiries || []);

      const available = prodsData.filter((p) => p.availability !== 'Out of Stock').length;
      const outOfStock = prodsData.filter((p) => p.availability === 'Out of Stock').length;

      setStats({
        totalProducts: prodsData.length,
        availableProducts: available,
        outOfStockProducts: outOfStock,
        totalEnquiries: enqData.stats?.total || 0,
        newEnquiries: enqData.stats?.new || 0,
      });
    } catch (err) {
      console.error('Failed to load dashboard metrics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleStatusChange = async (enquiryId, newStatus) => {
    try {
      await apiRequest(`/enquiries/${enquiryId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      loadDashboardData();
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await apiRequest(`/products/${productId}`, { method: 'DELETE' });
      window.dispatchEvent(new CustomEvent('product-deleted', { detail: { id: productId } }));
      loadDashboardData();
    } catch (err) {
      alert(`Failed to delete product: ${err.message}`);
    }
  };

  const handleDeleteEnquiry = async (enquiryId) => {
    if (!window.confirm('Are you sure you want to delete this enquiry?')) return;
    try {
      await apiRequest(`/enquiries/${enquiryId}`, { method: 'DELETE' });
      loadDashboardData();
    } catch (err) {
      alert(`Failed to delete enquiry: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-cream-200 rounded w-1/4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-cream-200 rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      sub: 'Active catalogue items',
      icon: <Package className="w-5 h-5 text-warmbrown-700" />,
      bg: 'bg-warmbrown-100',
    },
    {
      title: 'Available Products',
      value: stats.availableProducts,
      sub: 'In stock & ready to ship/order',
      icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50',
    },
    {
      title: 'Out of Stock',
      value: stats.outOfStockProducts,
      sub: 'Needs yarn restock',
      icon: <AlertTriangle className="w-5 h-5 text-rose-600" />,
      bg: 'bg-rose-50',
    },
    {
      title: 'Total Enquiries & Orders',
      value: stats.totalEnquiries,
      sub: `${stats.newEnquiries} awaiting response`,
      icon: <Inbox className="w-5 h-5 text-blush-600" />,
      bg: 'bg-blush-100',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-warmbrown-900">
            Studio Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-warmbrown-600">
            Real-time overview of your handmade crochet business inventory and customer orders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-warmbrown-900 hover:bg-warmbrown-800 text-cream-50 font-semibold text-xs shadow-soft transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div
            key={i}
            className="bg-white rounded-3xl p-5 border border-cream-200 shadow-soft flex items-center justify-between"
          >
            <div className="space-y-1">
              <span className="text-xs text-warmbrown-500 font-medium">{card.title}</span>
              <div className="text-2xl sm:text-3xl font-bold text-warmbrown-900">{card.value}</div>
              <span className="text-[11px] text-warmbrown-400 block">{card.sub}</span>
            </div>
            <div className={`w-12 h-12 rounded-2xl ${card.bg} flex items-center justify-center flex-shrink-0`}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders & Enquiries Section */}
      <div className="bg-white rounded-3xl border border-cream-200 shadow-soft p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg font-bold text-warmbrown-900">
              Recent Customer Enquiries &amp; Orders
            </h2>
            <p className="text-xs text-warmbrown-500">
              WhatsApp, Instagram, and web custom requests
            </p>
          </div>
          <Link
            to="/admin/enquiries"
            className="text-xs font-semibold text-blush-600 hover:text-blush-700 flex items-center gap-1"
          >
            <span>View All ({enquiries.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {enquiries.length === 0 ? (
          <div className="py-8 text-center text-warmbrown-400 text-xs">
            No customer enquiries recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-50 text-warmbrown-700 font-semibold border-b border-cream-200">
                <tr>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Product / Request</th>
                  <th className="py-3 px-3">Contact Method</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100 text-warmbrown-800">
                {enquiries.slice(0, 5).map((enq) => (
                  <tr key={enq._id} className="hover:bg-cream-50/50 transition-colors">
                    <td className="py-3.5 px-3 font-semibold">
                      {enq.customerName}
                      <span className="block text-[11px] font-normal text-warmbrown-500">
                        {enq.contactInfo}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-medium">{enq.productName}</span>
                      {enq.selectedColor && (
                        <span className="block text-[11px] text-warmbrown-500">
                          Color: {enq.selectedColor}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cream-100 text-warmbrown-700 font-medium text-[11px]">
                        {enq.contactMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-warmbrown-500 text-[11px]">
                      {new Date(enq.orderDate || enq.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-3">
                      <select
                        value={enq.status}
                        onChange={(e) => handleStatusChange(enq._id, e.target.value)}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border focus:outline-none ${
                          enq.status === 'New'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : enq.status === 'Contacted'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : enq.status === 'Confirmed'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : enq.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {enq.contactInfo && (
                          <a
                            href={`https://wa.me/${enq.contactInfo.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[11px] font-semibold transition-colors"
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span>Chat</span>
                          </a>
                        )}
                        <Link
                          to="/admin/enquiries"
                          className="p-1 rounded-lg text-warmbrown-500 hover:text-warmbrown-800 hover:bg-cream-200 transition-colors"
                          title="View / Edit enquiry details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteEnquiry(enq._id)}
                          className="p-1 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                          title="Delete enquiry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Products Grid Snippet */}
      <div className="bg-white rounded-3xl border border-cream-200 shadow-soft p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg font-bold text-warmbrown-900">
              Active Creations
            </h2>
            <p className="text-xs text-warmbrown-500">Live products in your store</p>
          </div>
          <Link
            to="/admin/products"
            className="text-xs font-semibold text-blush-600 hover:text-blush-700 flex items-center gap-1"
          >
            <span>Manage All ({products.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {products.slice(0, 6).map((prod) => (
            <div
              key={prod._id}
              className="group bg-cream-50 rounded-2xl p-2.5 border border-cream-200 flex flex-col justify-between"
            >
              <div>
                <div className="aspect-square rounded-xl overflow-hidden mb-2 bg-cream-200">
                  <img
                    src={prod.images?.[0]}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <h4 className="text-xs font-bold text-warmbrown-900 truncate">{prod.name}</h4>
                <div className="flex items-center justify-between text-[11px] text-warmbrown-600 mt-1">
                  <span>{formatPrice(prod.price)}</span>
                  <span className="font-mono text-[10px]">{prod.sku}</span>
                </div>
              </div>

              {/* Edit & Delete Buttons near each product in Dashboard */}
              <div className="grid grid-cols-2 gap-1.5 mt-2.5 pt-1.5 border-t border-cream-200/80">
                <Link
                  to={`/admin/products/edit/${prod._id}`}
                  className="py-1 px-1 rounded-lg bg-cream-100 hover:bg-cream-200 text-warmbrown-800 text-[10px] font-semibold text-center flex items-center justify-center gap-1 transition-colors"
                  title="Edit product"
                >
                  <Edit2 className="w-2.5 h-2.5 text-warmbrown-700" />
                  <span>Edit</span>
                </Link>
                <button
                  type="button"
                  onClick={() => handleDeleteProduct(prod._id)}
                  className="py-1 px-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-semibold text-center flex items-center justify-center gap-1 transition-colors"
                  title="Delete product"
                >
                  <Trash2 className="w-2.5 h-2.5 text-rose-600" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
