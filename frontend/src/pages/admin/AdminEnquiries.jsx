import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../utils/api';
import { useSettings } from '../../context/SettingsContext';
import {
  Inbox,
  MessageCircle,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
} from 'lucide-react';

export default function AdminEnquiries() {
  const { formatPrice } = useSettings();
  const [enquiries, setEnquiries] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [deletingId, setDeletingId] = useState(null);

  const statuses = ['All', 'New', 'Contacted', 'Confirmed', 'Completed', 'Cancelled'];

  const fetchEnquiries = async () => {
    try {
      const query = statusFilter !== 'All' ? `?status=${statusFilter}` : '';
      const data = await apiRequest(`/enquiries${query}`);
      setEnquiries(data.enquiries || []);
      setStats(data.stats || {});
    } catch (err) {
      console.error('Failed to load enquiries', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await apiRequest(`/enquiries/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      fetchEnquiries();
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this enquiry record?')) return;
    setDeletingId(id);
    try {
      await apiRequest(`/enquiries/${id}`, {
        method: 'DELETE',
      });
      fetchEnquiries();
    } catch (err) {
      alert(`Failed to delete enquiry: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'New':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Contacted':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Confirmed':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-zinc-100 text-zinc-600 border-zinc-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-warmbrown-900">
          Order &amp; Enquiry Management
        </h1>
        <p className="text-xs sm:text-sm text-warmbrown-600">
          Track customer orders received via WhatsApp, Instagram, and web custom requests.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              statusFilter === s
                ? 'bg-warmbrown-900 text-cream-50 shadow-xs'
                : 'bg-white text-warmbrown-700 border border-cream-200 hover:bg-cream-100'
            }`}
          >
            {s} {s === 'New' && stats.new > 0 && `(${stats.new})`}
          </button>
        ))}
      </div>

      {/* Enquiries List */}
      <div className="bg-white rounded-3xl border border-cream-200 shadow-soft overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-warmbrown-400 text-xs animate-pulse">
            Loading customer enquiries...
          </div>
        ) : enquiries.length === 0 ? (
          <div className="p-12 text-center text-warmbrown-500 text-xs space-y-2">
            <Inbox className="w-8 h-8 text-warmbrown-300 mx-auto" />
            <p className="font-bold text-sm text-warmbrown-800">No enquiries found</p>
            <p>Customer submissions from WhatsApp or custom forms will be listed here.</p>
          </div>
        ) : (
          <div className="divide-y divide-cream-100">
            {enquiries.map((enq) => {
              const cleanPhone = enq.contactInfo.replace(/[^0-9]/g, '');
              const whatsappChatUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hi ${enq.customerName}! 🧶 Following up from Loom & Petal Crochet Studio regarding your order request.`)}`;

              return (
                <div key={enq._id} className="p-5 sm:p-6 hover:bg-cream-50/40 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    {/* Left: Customer & Product Info */}
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="font-serif text-base font-bold text-warmbrown-900">
                          {enq.customerName}
                        </h3>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-cream-100 text-warmbrown-700 font-medium">
                          via {enq.contactMethod}
                        </span>
                        <span className="text-[11px] text-warmbrown-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(enq.orderDate || enq.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="text-xs text-warmbrown-700 space-y-1">
                        <p>
                          <strong>Item:</strong> {enq.productName}
                          {enq.productPrice > 0 && ` (${formatPrice(enq.productPrice)})`}
                          {enq.quantity > 1 && ` × ${enq.quantity} qty`}
                        </p>
                        {enq.selectedColor && (
                          <p>
                            <strong>Color:</strong> {enq.selectedColor}
                          </p>
                        )}
                        {enq.customType && (
                          <p>
                            <strong>Order Type:</strong> {enq.customType}
                          </p>
                        )}
                        {enq.customizationDetails && (
                          <p className="bg-cream-100/70 p-2 rounded-xl text-warmbrown-800 text-[11px]">
                            <strong>Custom Specs:</strong> {enq.customizationDetails}
                          </p>
                        )}
                        {enq.notes && (
                          <p className="text-warmbrown-600 text-[11px] italic">
                            "{enq.notes}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions & Status */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3">
                      {/* Status Selector */}
                      <div>
                        <select
                          value={enq.status}
                          onChange={(e) => handleStatusChange(enq._id, e.target.value)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-xl border focus:outline-none ${getStatusBadgeClass(
                            enq.status
                          )}`}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>

                      {/* Direct WhatsApp Response Button */}
                      <div className="flex items-center gap-2">
                        {cleanPhone.length >= 10 && (
                          <a
                            href={whatsappChatUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        )}

                        <button
                          onClick={() => handleDelete(enq._id)}
                          disabled={deletingId === enq._id}
                          className="p-1.5 rounded-lg text-warmbrown-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete enquiry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
