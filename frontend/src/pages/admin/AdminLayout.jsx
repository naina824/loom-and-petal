import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Inbox,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard Overview', path: '/admin', icon: <LayoutDashboard className="w-4 h-4" />, end: true },
    { name: 'Manage Products', path: '/admin/products', icon: <Package className="w-4 h-4" /> },
    { name: 'Add New Product', path: '/admin/products/new', icon: <PlusCircle className="w-4 h-4" /> },
    { name: 'Orders & Enquiries', path: '/admin/enquiries', icon: <Inbox className="w-4 h-4" /> },
    { name: 'Store Settings', path: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col md:flex-row">
      {/* Mobile Topbar */}
      <div className="md:hidden bg-white border-b border-cream-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🧶</span>
          <span className="font-serif text-base font-bold text-warmbrown-900">
            Studio Admin
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-warmbrown-700 hover:bg-cream-100 rounded-lg"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          sidebarOpen ? 'block' : 'hidden'
        } md:block md:w-64 bg-white border-r border-cream-200 flex-shrink-0 flex flex-col justify-between z-30`}
      >
        <div>
          {/* Logo / Brand Header */}
          <div className="p-6 border-b border-cream-100 hidden md:flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blush-100 flex items-center justify-center text-xl shadow-xs">
              🧶
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-warmbrown-900 leading-tight">
                Studio Admin
              </h2>
              <span className="text-[11px] text-warmbrown-500 font-medium">
                {settings.brandName || 'Loom & Petal'}
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-warmbrown-900 text-cream-50 shadow-xs'
                      : 'text-warmbrown-700 hover:bg-cream-100 hover:text-warmbrown-900'
                  }`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-cream-100 space-y-2">
          {/* Go to Customer Website */}
          <Link
            to="/"
            target="_blank"
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-warmbrown-700 bg-cream-50 hover:bg-cream-100 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-blush-500" />
              <span>View Customer Shop</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          {/* Admin Info & Logout */}
          <div className="pt-2 flex items-center justify-between text-xs px-1">
            <div className="truncate">
              <span className="font-bold text-warmbrown-900 block truncate">{admin?.name || 'Admin'}</span>
              <span className="text-[11px] text-warmbrown-500 truncate">{admin?.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
