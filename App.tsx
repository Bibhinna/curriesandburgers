
import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, Menu, X, Sun, Moon, MapPin, Phone, Instagram, Facebook, Twitter, 
  ChefHat, LogIn, LogOut, Search, UtensilsCrossed, Sandwich, Soup, Pizza, 
  Croissant, Coffee, IceCream, Trash2, Settings, MessageSquare, Truck, Gift, Clock, Mail, CheckCircle, ChevronRight
} from 'lucide-react';
import ChatBot from './components/ChatBot';
import Toast from './components/Toast';
import CheckoutModal from './components/CheckoutModal';
import LoginModal from './components/LoginModal';
import AdminDashboard from './components/AdminDashboard';
import OrderTracker from './components/OrderTracker';
import CateringPage from './components/CateringPage';
import GalleryPage from './components/GalleryPage';
import { BRANCHES, TESTIMONIALS } from './constants';
import { MenuItem, CartItem, ViewState, User, Order } from './types';
import { authService } from './services/authService';
import { dbService } from './services/dbService';

// --- Navbar Component ---
const Navbar = ({ 
  cartCount, 
  toggleCart, 
  setView, 
  isDark, 
  toggleTheme, 
  user,
  onLoginClick,
  onLogoutClick,
  onDeleteAccount
}: any) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', view: 'HOME' },
    { name: 'Menu', view: 'MENU' },
    { name: 'Reservations', view: 'RESERVATION' },
    { name: 'Catering', view: 'CATERING' },
    { name: 'Gallery', view: 'GALLERY' },
    { name: 'Contact', view: 'CONTACT' },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer flex items-center gap-2" onClick={() => setView('HOME')}>
            <div className="bg-brand-600 p-2 rounded-lg text-white">
               <ChefHat size={28} />
            </div>
            <span className="font-serif text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Curries <span className="text-brand-600">&</span> Burger
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden xl:block">
            <div className="ml-10 flex items-baseline space-x-6">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => setView(link.view)}
                  className="text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {link.name}
                </button>
              ))}
              {user?.role === 'admin' && (
                 <button onClick={() => setView('ADMIN')} className="text-brand-600 font-bold px-3 py-2 bg-brand-50 dark:bg-brand-900/20 rounded-lg">Admin Panel</button>
              )}
            </div>
          </div>

          {/* Right Icons */}
          <div className="hidden md:flex items-center gap-4">
            <button onClick={() => setView('TRACK_ORDER')} className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-brand-600 flex items-center gap-1">
                <Truck size={18} /> Track Order
            </button>

            <button onClick={toggleTheme} className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {user ? (
               <div className="relative">
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                     <span className="font-medium">{user.name}</span>
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-2 z-50 animate-fade-in">
                       <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 mb-2">
                           <p className="text-xs text-gray-500 uppercase">Loyalty Points</p>
                           <p className="font-bold text-brand-600 text-lg flex items-center gap-1">
                               <Gift size={16}/> {user.loyaltyPoints || 0} pts
                           </p>
                       </div>
                       <button onClick={() => { setView('MY_ORDERS'); setIsUserMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 dark:text-white">
                           <Truck size={16}/> My Orders
                       </button>
                       <button onClick={() => { onLogoutClick(); setIsUserMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                           <LogOut size={16}/> Logout
                       </button>
                       <div className="h-px bg-gray-100 dark:bg-gray-700 my-1"></div>
                       <button onClick={() => { onDeleteAccount(); setIsUserMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 flex items-center gap-2">
                           <Trash2 size={16}/> Delete Account
                       </button>
                    </div>
                  )}
               </div>
            ) : (
               <button onClick={onLoginClick} className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-white hover:text-brand-600 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                 <LogIn size={18}/> Login
               </button>
            )}

            <button 
              onClick={toggleCart}
              className={`relative p-2 rounded-full transition-all duration-300 ${cartCount > 0 ? 'bg-brand-600 text-white hover:bg-brand-700 hover:scale-105 shadow-lg shadow-brand-500/30' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
             <button 
              onClick={toggleCart}
              className="relative p-2 text-brand-600"
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                 <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-brand-600"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => {
                  setView(link.view);
                  setIsMobileMenuOpen(false);
                }}
                className="text-gray-700 dark:text-gray-300 hover:text-brand-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                {link.name}
              </button>
            ))}
             <button onClick={() => { setView('TRACK_ORDER'); setIsMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300">
               Track Order
             </button>
             <button onClick={toggleTheme} className="w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300">
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>
             {user ? (
                 <>
                   <button onClick={() => { setView('MY_ORDERS'); setIsMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300">
                       My Orders
                   </button>
                   <button onClick={onLogoutClick} className="w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300">
                       Logout ({user.name})
                   </button>
                 </>
             ) : (
                 <button onClick={onLoginClick} className="w-full text-left px-3 py-2 text-brand-600 font-bold">
                     Login
                 </button>
             )}
          </div>
        </div>
      )}
    </nav>
  );
};

// --- Cart Drawer Component ---
const CartDrawer = ({ 
  isOpen, 
  onClose, 
  items, 
  updateQuantity, 
  checkout 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  items: CartItem[]; 
  updateQuantity: (id: string, delta: number) => void; 
  checkout: () => void;
}) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className={`fixed inset-0 z-50 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute right-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-xl flex flex-col">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
          <h2 className="text-2xl font-bold font-serif dark:text-white flex items-center gap-2">
            <ShoppingCart className="text-brand-600" /> Your Cart
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full dark:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-60">
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4">
                <ShoppingCart size={64} />
              </div>
              <p className="text-xl font-medium">Your cart is empty.</p>
              <p className="text-sm">Add some delicious food to get started!</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold dark:text-white leading-tight">{item.name}</h3>
                    <p className="text-brand-600 font-bold mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >-</button>
                    <span className="dark:text-white font-medium w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center hover:bg-brand-200 transition-colors"
                    >+</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
            <div className="flex justify-between mb-6">
                <div className="text-gray-500 dark:text-gray-400">Total Amount</div>
                <div className="text-2xl font-bold dark:text-white">${total.toFixed(2)}</div>
            </div>
            <button 
              onClick={checkout}
              className="w-full bg-brand-600 text-white py-4 rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/30 active:scale-95 flex justify-center items-center gap-2"
            >
              Checkout Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Home Component ---
const Home = ({ setView, menuItems }: { setView: (v: ViewState) => void, menuItems: MenuItem[] }) => {
  const categories = ['Burgers', 'Curries', 'Appetizers', 'Rice', 'Breads', 'Rolls', 'Drinks', 'Desserts'];
  
  const categoryIcons: Record<string, React.ElementType> = {
    'Burgers': Sandwich,
    'Curries': Soup,
    'Appetizers': Pizza,
    'Rice': ChefHat,
    'Breads': Croissant,
    'Rolls': Sandwich,
    'Drinks': Coffee,
    'Desserts': IceCream,
  };

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Burger and Curry" 
        />
        <div className="relative z-20 text-center text-white px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold font-serif mb-6 animate-slide-up">
            East Meets West
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-light text-gray-200 animate-slide-up" style={{animationDelay: '0.2s'}}>
            Experience the ultimate fusion of juicy burgers and authentic Indian curries.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{animationDelay: '0.4s'}}>
            <button 
              onClick={() => setView('MENU')}
              className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-full font-bold text-lg transition-all transform hover:scale-105"
            >
              Order Online
            </button>
            <button 
              onClick={() => setView('RESERVATION')}
              className="bg-transparent border-2 border-white hover:bg-white hover:text-brand-900 text-white px-8 py-3 rounded-full font-bold text-lg transition-all"
            >
              Book a Table
            </button>
          </div>
        </div>
      </div>

      {/* Category Links */}
      <div className="py-12 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
         <div className="max-w-7xl mx-auto px-4">
             <h2 className="text-2xl font-bold font-serif text-center mb-8 dark:text-white">What are you craving?</h2>
             <div className="flex flex-wrap justify-center gap-6">
                {categories.map(cat => {
                   const Icon = categoryIcons[cat] || ChefHat;
                   return (
                     <button 
                       key={cat}
                       onClick={() => setView('MENU')}
                       className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group min-w-[100px]"
                     >
                        <div className="w-16 h-16 rounded-full bg-brand-50 dark:bg-gray-800 flex items-center justify-center text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors shadow-sm">
                           <Icon size={28} />
                        </div>
                        <span className="font-bold text-gray-700 dark:text-gray-300 group-hover:text-brand-600 dark:group-hover:text-brand-500">{cat}</span>
                     </button>
                   );
                })}
             </div>
         </div>
      </div>

      {/* Features */}
      <div className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { title: 'Fresh Ingredients', icon: '🥗', text: 'Locally sourced vegetables and premium meats.' },
            { title: 'Fusion Flavors', icon: '🌶️', text: 'Unique spice blends created by our master chefs.' },
            { title: 'Fast Delivery', icon: '🛵', text: 'Hot and fresh food delivered to your doorstep.' }
          ].map((f, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">{f.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{f.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Chef's Special Preview */}
      <div className="py-20 bg-brand-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold font-serif text-center mb-12 dark:text-white">Chef's Specials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {menuItems.filter(i => i.isChefSpecial).slice(0, 4).map(item => (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all">
                <div className="h-48 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform hover:scale-110 duration-500" />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg dark:text-white line-clamp-1">{item.name}</h3>
                    <span className="bg-brand-100 text-brand-800 text-xs font-bold px-2 py-1 rounded">
                      ${item.price}
                    </span>
                  </div>
                  <button onClick={() => setView('MENU')} className="w-full mt-4 py-2 border border-brand-600 text-brand-600 hover:bg-brand-600 hover:text-white rounded-lg transition-colors text-sm font-bold">
                    View Menu
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

       {/* Testimonials */}
       <div className="py-20 bg-white dark:bg-gray-800">
         <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold font-serif mb-12 dark:text-white">What Our Customers Say</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {TESTIMONIALS.map((t) => (
                <div key={t.id} className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="flex justify-center mb-4 text-yellow-400">
                    {[...Array(t.rating)].map((_, i) => <span key={i}>★</span>)}
                  </div>
                  <p className="italic text-gray-600 dark:text-gray-300 mb-4">"{t.text}"</p>
                  <h4 className="font-bold text-gray-900 dark:text-white">- {t.name}</h4>
                </div>
              ))}
            </div>
         </div>
       </div>
    </div>
  );
};

// --- Menu Page Component ---
const MenuPage = ({ addToCart, menuItems }: { addToCart: (item: MenuItem) => void, menuItems: MenuItem[] }) => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [onlyVeg, setOnlyVeg] = useState(false);

  const categories = ['All', 'Burgers', 'Curries', 'Appetizers', 'Rice', 'Breads', 'Rolls', 'Drinks', 'Desserts'];

  const categoryIcons: Record<string, React.ElementType> = {
    'All': UtensilsCrossed,
    'Burgers': Sandwich,
    'Curries': Soup,
    'Appetizers': Pizza,
    'Rice': ChefHat,
    'Breads': Croissant,
    'Rolls': Sandwich,
    'Drinks': Coffee,
    'Desserts': IceCream,
  };

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = filter === 'All' || item.category === filter;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesVeg = onlyVeg ? item.isVeg : true;
    return matchesCategory && matchesSearch && matchesVeg;
  });

  return (
    <div className="animate-fade-in min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Hero Header */}
      <div className="relative h-64 md:h-80 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1596797038530-2c107229654b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
          alt="Menu Banner" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 h-full flex flex-col justify-center items-center text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">Our Menu</h1>
          <p className="text-lg text-gray-200 max-w-2xl">
            Discover a symphony of flavors where East meets West. Fresh ingredients, bold spices.
          </p>
        </div>
      </div>

      {/* Category Section */}
      <section className="bg-white dark:bg-gray-800 py-10 border-b border-gray-100 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 font-serif dark:text-white">Browse Categories</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {categories.map(cat => {
                const Icon = categoryIcons[cat] || ChefHat;
                return (
                <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`
                    flex-shrink-0 w-32 h-32 rounded-2xl flex flex-col items-center justify-center gap-3 
                    transition-all duration-300 border-2 group
                    ${filter === cat 
                        ? 'bg-brand-50 border-brand-500 text-brand-700 dark:bg-brand-900/20 dark:border-brand-500 dark:text-brand-400 shadow-lg scale-105' 
                        : 'bg-gray-50 border-transparent text-gray-500 dark:bg-gray-700 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-600 hover:border-gray-200 dark:hover:border-gray-500 hover:shadow-md'}
                    `}
                >
                    <div className={`p-3 rounded-full transition-colors ${filter === cat ? 'bg-brand-200 dark:bg-brand-800' : 'bg-gray-200 dark:bg-gray-600 group-hover:bg-brand-100 dark:group-hover:bg-gray-500'}`}>
                    <Icon size={28} strokeWidth={1.5} />
                    </div>
                    <span className="font-semibold text-sm">{cat}</span>
                </button>
                );
            })}
            </div>
        </div>
      </section>
      
      {/* Sticky Search Bar */}
      <div className="sticky top-20 z-30 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 py-4 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
             <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Showing {filteredItems.length} items
             </div>

             <div className="flex gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-80">
                  <input
                    type="text"
                    placeholder="Search dishes..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none shadow-sm"
                  />
                  <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                </div>
                
                <button
                  onClick={() => setOnlyVeg(!onlyVeg)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border font-bold transition-all shadow-sm ${
                    onlyVeg 
                      ? 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${onlyVeg ? 'bg-green-600' : 'bg-gray-400'}`} />
                  Veg
                </button>
             </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-2xl font-bold dark:text-white">No dishes found</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your search or filters.</p>
            <button onClick={() => {setSearch(''); setFilter('All'); setOnlyVeg(false);}} className="mt-6 text-brand-600 font-bold hover:underline">Clear all filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredItems.map(item => (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col">
                {/* Image Area */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {item.isVeg ? (
                      <span className="bg-green-100/90 backdrop-blur text-green-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-green-600"></span> Veg
                      </span>
                    ) : (
                      <span className="bg-red-100/90 backdrop-blur text-red-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-red-600"></span> Non-Veg
                      </span>
                    )}
                    {item.isSpicy && (
                      <span className="bg-orange-100/90 backdrop-blur text-orange-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        🔥 Spicy
                      </span>
                    )}
                    {item.isChefSpecial && (
                      <span className="bg-yellow-100/90 backdrop-blur text-yellow-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        👑 Special
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-serif text-2xl font-bold dark:text-white leading-tight group-hover:text-brand-600 transition-colors">
                      {item.name}
                    </h3>
                    <span className="font-bold text-xl text-brand-600 shrink-0 ml-2">
                      ${item.price}
                    </span>
                  </div>
                  
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                    {item.description}
                  </p>
                  
                  <div className="mt-auto">
                    <button 
                      onClick={() => addToCart(item)}
                      className="w-full py-3 bg-gray-900 dark:bg-gray-700 text-white rounded-xl font-bold hover:bg-brand-600 dark:hover:bg-brand-600 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-brand-500/30"
                    >
                      <ShoppingCart size={18} /> Add to Order
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Reservation Page Component ---
const ReservationPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', date: '', time: '', guests: 2 });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dbService.createReservation({ 
        ...formData, 
        guests: Number(formData.guests)
    });
    setSuccess(true);
    setTimeout(() => {
        setSuccess(false);
        setFormData({ name: '', email: '', phone: '', date: '', time: '', guests: 2 });
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
           <div className="md:w-1/3 bg-brand-600 p-8 text-white flex flex-col justify-between">
              <div>
                  <h2 className="text-3xl font-serif font-bold mb-4">Book a Table</h2>
                  <p className="text-brand-100 mb-8">Reserve your spot for an unforgettable dining experience. Perfect for family dinners, dates, and special occasions.</p>
                  
                  <div className="space-y-4">
                      <div className="flex items-center gap-3">
                          <Clock size={20} />
                          <div>
                              <p className="font-bold text-sm">Opening Hours</p>
                              <p className="text-xs text-brand-100">Mon-Sun: 11:00 AM - 10:00 PM</p>
                          </div>
                      </div>
                      <div className="flex items-center gap-3">
                          <Phone size={20} />
                          <div>
                              <p className="font-bold text-sm">Contact Us</p>
                              <p className="text-xs text-brand-100">+1 (555) 012-3456</p>
                          </div>
                      </div>
                  </div>
              </div>
              <div className="mt-8">
                  <p className="text-xs opacity-70">* For parties larger than 10, please contact us directly.</p>
              </div>
           </div>

           <div className="md:w-2/3 p-8">
             {success ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
                        <CheckCircle size={40} />
                    </div>
                    <h3 className="text-2xl font-bold dark:text-white mb-2">Reservation Confirmed!</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">We have sent a confirmation email to <strong>{formData.email}</strong>.</p>
                    <button onClick={() => setSuccess(false)} className="text-brand-600 font-bold hover:underline">Book another table</button>
                </div>
             ) : (
                 <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                            <input required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all" 
                                placeholder="John Doe"
                                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                            <input required type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all" 
                                placeholder="(555) 000-0000"
                                value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                        <input required type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all" 
                            placeholder="john@example.com"
                            value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
                            <input required type="date" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all" 
                                value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time</label>
                            <input required type="time" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all" 
                                value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Guests</label>
                            <input required type="number" min="1" max="20" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all" 
                                value={formData.guests} onChange={e => setFormData({...formData, guests: parseInt(e.target.value)})} />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-brand-600 text-white py-4 rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/30 transform active:scale-95">
                        Confirm Table Reservation
                    </button>
                 </form>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

// --- About & Contact Page Component ---
const AboutContactPage = () => {
    return (
        <div className="animate-fade-in bg-gray-50 dark:bg-gray-900 pb-20">
             {/* Header */}
             <div className="bg-gray-900 text-white py-20 px-4 text-center">
                 <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Our Story & Locations</h1>
                 <p className="text-gray-400 max-w-2xl mx-auto text-lg">Founded in 2010, Curries & Burger began with a simple idea: to bring together the bold spices of India with the classic comfort of American burgers.</p>
             </div>

             <div className="max-w-7xl mx-auto px-4 -mt-10">
                 <div className="grid md:grid-cols-2 gap-8">
                     {/* Story Card */}
                     <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
                         <h2 className="text-2xl font-serif font-bold mb-4 dark:text-white">The Fusion Kitchen</h2>
                         <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                             Our head chef, <strong>Arjun Mehta</strong>, grew up in New Delhi and spent his summers in New York. He realized that the rich, creamy textures of Indian curries were the perfect match for juicy, flame-grilled patties. 
                         </p>
                         <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                             Today, we source our spices directly from Kerala and our meats from local sustainable farms. Every sauce is made in-house, ensuring that "homemade" taste in every bite.
                         </p>
                         <div className="mt-6 flex gap-4">
                             <div className="flex flex-col items-center p-4 bg-brand-50 dark:bg-brand-900/20 rounded-xl flex-1">
                                 <span className="text-3xl font-bold text-brand-600">15+</span>
                                 <span className="text-sm text-gray-500 dark:text-gray-400">Years Serving</span>
                             </div>
                             <div className="flex flex-col items-center p-4 bg-brand-50 dark:bg-brand-900/20 rounded-xl flex-1">
                                 <span className="text-3xl font-bold text-brand-600">50k+</span>
                                 <span className="text-sm text-gray-500 dark:text-gray-400">Happy Customers</span>
                             </div>
                         </div>
                     </div>

                     {/* Contact Card */}
                     <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
                        <h2 className="text-2xl font-serif font-bold mb-6 dark:text-white">Get in Touch</h2>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold dark:text-white">Main Branch</h3>
                                    <p className="text-gray-500 dark:text-gray-400">123 Curry Ave, Food District, NY 10001</p>
                                    <p className="text-brand-600 text-sm font-bold mt-1">Open daily: 11am - 10pm</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-green-100 text-green-600 p-3 rounded-full">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold dark:text-white">Phone Support</h3>
                                    <p className="text-gray-500 dark:text-gray-400">Available during opening hours</p>
                                    <a href="tel:+15550123456" className="text-brand-600 font-bold hover:underline block mt-1">+1 (555) 012-3456</a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-purple-100 text-purple-600 p-3 rounded-full">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold dark:text-white">Email Us</h3>
                                    <p className="text-gray-500 dark:text-gray-400">For catering and general inquiries</p>
                                    <a href="mailto:hello@curriesandburger.com" className="text-brand-600 font-bold hover:underline block mt-1">hello@curriesandburger.com</a>
                                </div>
                            </div>
                        </div>
                     </div>
                 </div>

                 {/* Locations Map Placeholder */}
                 <div className="mt-12">
                     <h2 className="text-2xl font-serif font-bold mb-6 dark:text-white text-center">Visit Our Branches</h2>
                     <div className="grid md:grid-cols-2 gap-6">
                        {BRANCHES.map(branch => (
                            <div key={branch.id} className="group relative overflow-hidden rounded-2xl h-64 bg-gray-200 dark:bg-gray-700 shadow-lg cursor-pointer">
                                <img 
                                    src={`https://picsum.photos/seed/${branch.id}/800/400`} 
                                    alt={branch.name} 
                                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                                />
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                    <div className="bg-white/90 dark:bg-gray-900/90 p-4 rounded-xl shadow-lg backdrop-blur-sm transform group-hover:scale-105 transition-transform">
                                        <h3 className="font-bold text-xl dark:text-white mb-1">{branch.name}</h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{branch.address}</p>
                                        <button className="text-brand-600 font-bold text-sm flex items-center justify-center gap-1">
                                            Get Directions <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                     </div>
                 </div>
             </div>
        </div>
    );
};

const App = () => {
  const [view, setView] = useState<ViewState>('HOME');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [toast, setToast] = useState<{ message: string; isVisible: boolean }>({ message: '', isVisible: false });
  const [isDark, setIsDark] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  
  // Load initial data
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    // Check session
    const session = authService.getSession();
    if (session) setUser(session);

    // Load Menu
    setMenuItems(dbService.getMenuItems());

    // Theme check
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const showToast = (message: string) => {
    setToast({ message, isVisible: true });
    setTimeout(() => setToast(prev => ({ ...prev, isVisible: false })), 3000);
  };

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    showToast(`Added ${item.name} to cart`);
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(0, item.quantity + delta) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setView('HOME');
    showToast('Logged out successfully');
  };
  
  const handleDeleteAccount = async () => {
      if (user && confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
          await authService.deleteAccount(user.id);
          setUser(null);
          setView('HOME');
          showToast('Account deleted.');
      }
  };

  const handlePlaceOrder = (details: any) => {
     let transactionId = undefined;

     // 1. Create Transaction for Non-COD payments
     if (details.paymentMethod !== 'cod') {
        // Mask card details
        const meta = details.paymentMethod === 'card' 
            ? { last4: details.paymentDetails?.cardNumber.slice(-4) }
            : { upiId: details.paymentDetails?.upiId };

        const transaction = dbService.createTransaction({
            userId: user ? user.id : 'guest',
            amount: details.total,
            method: details.paymentMethod,
            status: 'success',
            metadata: meta
        });
        transactionId = transaction.id;
     }

     // 2. Create Order
     const newOrder = dbService.createOrder({
         userId: user ? user.id : 'guest',
         customerName: details.name,
         items: details.items,
         total: details.total,
         paymentMethod: details.paymentMethod,
         address: details.address,
         transactionId
     });

     // 3. Link Order to Transaction
     if (transactionId) {
        dbService.linkTransactionToOrder(transactionId, newOrder.id);
     }

     setCart([]);
     setIsCheckoutOpen(false);
     setIsCartOpen(false);
     showToast('Order placed successfully!');
     
     // Redirect to tracker
     setTimeout(() => {
         setView('TRACK_ORDER');
     }, 1000);
  };

  const handleSubscribe = (e: React.FormEvent) => {
      e.preventDefault();
      if(newsletterEmail.includes('@')) {
          dbService.subscribeToNewsletter(newsletterEmail);
          setNewsletterEmail('');
          showToast('Subscribed to newsletter!');
      }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'dark:bg-gray-900' : 'bg-white'}`}>
      <Navbar 
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)} 
        toggleCart={() => setIsCartOpen(!isCartOpen)} 
        setView={setView}
        isDark={isDark}
        toggleTheme={() => setIsDark(!isDark)}
        user={user}
        onLoginClick={() => setIsLoginOpen(true)}
        onLogoutClick={handleLogout}
        onDeleteAccount={handleDeleteAccount}
      />

      <main className="pt-20"> {/* Offset for sticky navbar */}
        {view === 'HOME' && <Home setView={setView} menuItems={menuItems} />}
        {view === 'MENU' && <MenuPage addToCart={addToCart} menuItems={menuItems} />}
        {view === 'ADMIN' && (user?.role === 'admin' ? <AdminDashboard /> : <div className="p-10 text-center dark:text-white">Access Denied</div>)}
        {view === 'TRACK_ORDER' && <OrderTracker />}
        {view === 'RESERVATION' && <ReservationPage />}
        {view === 'CATERING' && <CateringPage />}
        {view === 'GALLERY' && <GalleryPage />}
        {(view === 'ABOUT' || view === 'CONTACT') && <AboutContactPage />}
        {view === 'MY_ORDERS' && user && (
            <div className="max-w-4xl mx-auto p-4 py-8 animate-fade-in">
                <h2 className="text-3xl font-serif font-bold mb-8 dark:text-white">My Orders</h2>
                <div className="space-y-4">
                    {dbService.getUserOrders(user.id).length === 0 ? (
                        <p className="text-gray-500">No past orders found.</p>
                    ) : (
                        dbService.getUserOrders(user.id).map(order => (
                            <div key={order.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <div className="flex justify-between mb-4">
                                    <div>
                                        <p className="font-bold dark:text-white">Order #{order.id}</p>
                                        <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold h-fit ${
                                         order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>{order.status}</span>
                                </div>
                                <div className="text-right font-bold text-brand-600">${order.total.toFixed(2)}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                    {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        )}
      </main>

      {/* Floating Buttons */}
      <div className="fixed bottom-24 right-6 flex flex-col gap-4 z-40">
           {/* WhatsApp Button */}
           <a 
             href="https://wa.me/15551234567" 
             target="_blank" 
             rel="noopener noreferrer"
             className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center"
           >
              <MessageSquare size={24} fill="white" />
           </a>
      </div>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart} 
        updateQuantity={updateCartQuantity}
        checkout={() => {
            if (cart.length === 0) return;
            setIsCartOpen(false);
            setIsCheckoutOpen(true);
        }}
      />
      
      <ChatBot />

      <Toast 
        message={toast.message} 
        isVisible={toast.isVisible} 
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))} 
      />

      {isLoginOpen && (
        <LoginModal 
            onClose={() => setIsLoginOpen(false)} 
            onLogin={(u) => {
                setUser(u);
                showToast(`Welcome back, ${u.name}!`);
            }} 
        />
      )}

      {isCheckoutOpen && (
        <CheckoutModal 
            isOpen={isCheckoutOpen} 
            onClose={() => setIsCheckoutOpen(false)} 
            cartItems={cart}
            total={cart.reduce((sum, i) => sum + i.price * i.quantity, 0)}
            onPlaceOrder={handlePlaceOrder}
            user={user}
        />
      )}
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                  <div className="flex items-center gap-2 mb-4">
                      <ChefHat className="text-brand-500" />
                      <span className="font-serif text-xl font-bold">Curries & Burger</span>
                  </div>
                  <p className="text-gray-400 text-sm">Serving the best fusion food in the city since 2010.</p>
              </div>
              <div>
                  <h4 className="font-bold mb-4">Locations</h4>
                  {BRANCHES.map(b => (
                      <div key={b.id} className="mb-2 text-sm text-gray-400">
                          <p className="text-white font-medium">{b.name}</p>
                          <p>{b.address}</p>
                      </div>
                  ))}
              </div>
              <div>
                  <h4 className="font-bold mb-4">Links</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                      <li><button onClick={() => setView('MENU')} className="hover:text-brand-500">Order Online</button></li>
                      <li><button onClick={() => setView('RESERVATION')} className="hover:text-brand-500">Reservations</button></li>
                      <li><button onClick={() => setView('CATERING')} className="hover:text-brand-500">Catering</button></li>
                      <li><button onClick={() => setView('TRACK_ORDER')} className="hover:text-brand-500">Track Order</button></li>
                  </ul>
              </div>
              <div>
                  <h4 className="font-bold mb-4">Stay Updated</h4>
                  <p className="text-gray-400 text-sm mb-4">Subscribe to our newsletter for new dishes and deals.</p>
                  <form onSubmit={handleSubscribe} className="flex gap-2">
                      <input 
                        type="email" 
                        placeholder="Your email" 
                        required
                        value={newsletterEmail}
                        onChange={e => setNewsletterEmail(e.target.value)}
                        className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm w-full outline-none focus:ring-1 focus:ring-brand-500"
                      />
                      <button type="submit" className="bg-brand-600 hover:bg-brand-700 p-2 rounded-lg">
                          <ChevronRight size={16} />
                      </button>
                  </form>
                  <div className="flex gap-4 mt-6">
                      <Instagram className="cursor-pointer hover:text-brand-500" />
                      <Facebook className="cursor-pointer hover:text-brand-500" />
                      <Twitter className="cursor-pointer hover:text-brand-500" />
                  </div>
              </div>
          </div>
          <div className="text-center text-gray-600 text-sm mt-12 border-t border-gray-800 pt-8">
              © 2025 Curries & Burger. All rights reserved.
          </div>
      </footer>
    </div>
  );
};

export default App;
