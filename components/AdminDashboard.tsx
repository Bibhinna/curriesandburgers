
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line 
} from 'recharts';
import { 
  Package, DollarSign, Users, ShoppingBag, Edit, Trash2, Plus, X, Check, Search, TrendingUp, CreditCard 
} from 'lucide-react';
import { dbService } from '../services/dbService';
import { MenuItem, Order, Transaction } from '../types';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'menu' | 'orders' | 'transactions'>('overview');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State for Adding/Editing
  const [itemForm, setItemForm] = useState<Partial<MenuItem>>({
    name: '', category: 'Burgers', price: 0, description: '', isVeg: true, isSpicy: false, image: 'https://picsum.photos/400/300'
  });

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setMenuItems(dbService.getMenuItems());
    setOrders(dbService.getOrders());
    setTransactions(dbService.getTransactions());
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      dbService.deleteMenuItem(id);
      refreshData();
    }
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      dbService.updateMenuItem(isEditing, itemForm);
    } else {
      dbService.addMenuItem(itemForm as Omit<MenuItem, 'id'>);
    }
    setShowAddModal(false);
    setIsEditing(null);
    setItemForm({ name: '', category: 'Burgers', price: 0, description: '', isVeg: true, isSpicy: false, image: 'https://picsum.photos/400/300' });
    refreshData();
  };

  const openEdit = (item: MenuItem) => {
    setItemForm(item);
    setIsEditing(item.id);
    setShowAddModal(true);
  };

  const handleStatusUpdate = (orderId: string, newStatus: Order['status']) => {
    dbService.updateOrderStatus(orderId, newStatus);
    refreshData();
  };

  // Stats Calculation
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Preparing').length;
  
  const salesData = [
    { name: 'Mon', sales: 4000 }, { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 2000 }, { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 }, { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-serif font-bold dark:text-white">Dashboard</h1>
        <div className="flex gap-2 bg-white dark:bg-gray-800 p-1 rounded-lg shadow-sm overflow-x-auto">
          {['overview', 'menu', 'orders', 'transactions'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-md capitalize font-medium transition-colors whitespace-nowrap ${
                activeTab === tab 
                  ? 'bg-brand-600 text-white shadow' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                 <div className="p-3 bg-green-100 text-green-600 rounded-xl"><DollarSign size={24} /></div>
                 <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
                    <p className="text-2xl font-bold dark:text-white">${totalRevenue.toFixed(2)}</p>
                 </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                 <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><ShoppingBag size={24} /></div>
                 <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
                    <p className="text-2xl font-bold dark:text-white">{orders.length}</p>
                 </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                 <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl"><Package size={24} /></div>
                 <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
                    <p className="text-2xl font-bold dark:text-white">{pendingOrders}</p>
                 </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                 <div className="p-3 bg-purple-100 text-purple-600 rounded-xl"><Package size={24} /></div>
                 <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Menu Items</p>
                    <p className="text-2xl font-bold dark:text-white">{menuItems.length}</p>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-lg mb-6 dark:text-white">Revenue Overview</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="name" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                      <Bar dataKey="sales" fill="#ea580c" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-lg mb-6 dark:text-white">Recent Orders</h3>
                <div className="space-y-4">
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center font-bold">
                            {order.customerName.charAt(0)}
                         </div>
                         <div>
                            <p className="font-bold dark:text-white text-sm">{order.customerName}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{order.items.length} items • ${order.total.toFixed(2)}</p>
                         </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  ))}
                  {orders.length === 0 && <p className="text-gray-500 text-center">No orders yet.</p>}
                </div>
              </div>
           </div>
        </div>
      )}

      {/* MENU MANAGEMENT TAB */}
      {activeTab === 'menu' && (
        <div>
          <div className="flex justify-between mb-6">
             <h2 className="text-xl font-bold dark:text-white">Menu Items</h2>
             <button 
                onClick={() => {
                  setIsEditing(null);
                  setItemForm({ name: '', category: 'Burgers', price: 0, description: '', isVeg: true, isSpicy: false, image: 'https://picsum.photos/400/300' });
                  setShowAddModal(true);
                }}
                className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium"
             >
                <Plus size={18} /> Add New Item
             </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map(item => (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden group border border-gray-100 dark:border-gray-700">
                <div className="h-48 overflow-hidden relative">
                   <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                   <div className="absolute top-2 right-2 flex gap-2">
                      <button onClick={() => openEdit(item)} className="p-2 bg-white/90 rounded-full text-blue-600 hover:bg-blue-50">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 bg-white/90 rounded-full text-red-600 hover:bg-red-50">
                        <Trash2 size={16} />
                      </button>
                   </div>
                </div>
                <div className="p-4">
                   <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold dark:text-white">{item.name}</h3>
                      <span className="font-bold text-brand-600">${item.price}</span>
                   </div>
                   <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{item.description}</p>
                   <div className="flex gap-2 mt-4 text-xs font-bold">
                      {item.isVeg ? <span className="text-green-600 bg-green-100 px-2 py-1 rounded">Veg</span> : <span className="text-red-600 bg-red-100 px-2 py-1 rounded">Non-Veg</span>}
                      {item.isSpicy && <span className="text-orange-600 bg-orange-100 px-2 py-1 rounded">Spicy</span>}
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 uppercase text-xs">
                 <tr>
                   <th className="px-6 py-4">Order ID</th>
                   <th className="px-6 py-4">Customer</th>
                   <th className="px-6 py-4">Status</th>
                   <th className="px-6 py-4">Total</th>
                   <th className="px-6 py-4">Date</th>
                   <th className="px-6 py-4">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                 {orders.map(order => (
                   <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors dark:text-gray-300">
                     <td className="px-6 py-4 font-mono font-medium">{order.id}</td>
                     <td className="px-6 py-4">
                       <p className="font-bold text-gray-900 dark:text-white">{order.customerName}</p>
                       <p className="text-xs text-gray-500">{order.items.length} items</p>
                     </td>
                     <td className="px-6 py-4">
                       <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                         order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                         order.status === 'Preparing' ? 'bg-blue-100 text-blue-700' :
                         order.status === 'Out for Delivery' ? 'bg-purple-100 text-purple-700' :
                         order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                         'bg-red-100 text-red-700'
                       }`}>
                         {order.status}
                       </span>
                     </td>
                     <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">${order.total.toFixed(2)}</td>
                     <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</td>
                     <td className="px-6 py-4">
                        <select 
                          className="bg-gray-100 dark:bg-gray-600 rounded px-2 py-1 text-sm outline-none"
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value as any)}
                        >
                          <option>Pending</option>
                          <option>Preparing</option>
                          <option>Out for Delivery</option>
                          <option>Delivered</option>
                          <option>Cancelled</option>
                        </select>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      )}

      {/* TRANSACTIONS TAB */}
      {activeTab === 'transactions' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 uppercase text-xs">
                 <tr>
                   <th className="px-6 py-4">TXN ID</th>
                   <th className="px-6 py-4">Order ID</th>
                   <th className="px-6 py-4">Method</th>
                   <th className="px-6 py-4">Details</th>
                   <th className="px-6 py-4">Amount</th>
                   <th className="px-6 py-4">Status</th>
                   <th className="px-6 py-4">Date</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                 {transactions.map(tx => (
                   <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors dark:text-gray-300">
                     <td className="px-6 py-4 font-mono font-medium text-xs text-gray-500">{tx.id}</td>
                     <td className="px-6 py-4 font-mono font-medium">{tx.orderId || '-'}</td>
                     <td className="px-6 py-4 capitalize flex items-center gap-2">
                        {tx.method === 'card' ? <CreditCard size={16} /> : <DollarSign size={16} />}
                        {tx.method}
                     </td>
                     <td className="px-6 py-4 text-sm text-gray-500">
                        {tx.method === 'card' && `**** **** **** ${tx.metadata?.last4 || '????'}`}
                        {tx.method === 'upi' && (tx.metadata?.upiId || '-')}
                     </td>
                     <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">${tx.amount.toFixed(2)}</td>
                     <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold uppercase">{tx.status}</span>
                     </td>
                     <td className="px-6 py-4 text-sm text-gray-500">{new Date(tx.date).toLocaleDateString()} {new Date(tx.date).toLocaleTimeString()}</td>
                   </tr>
                 ))}
                 {transactions.length === 0 && (
                     <tr>
                         <td colSpan={7} className="px-6 py-8 text-center text-gray-500">No transactions recorded yet.</td>
                     </tr>
                 )}
               </tbody>
             </table>
           </div>
        </div>
      )}

      {/* ADD/EDIT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold dark:text-white">{isEditing ? 'Edit Item' : 'Add New Dish'}</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                  <X size={24} className="dark:text-white" />
                </button>
             </div>
             
             <form onSubmit={handleSaveItem} className="space-y-4">
                <div>
                   <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Dish Name</label>
                   <input required type="text" className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={itemForm.name} onChange={e => setItemForm({...itemForm, name: e.target.value})} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Price ($)</label>
                      <input required type="number" step="0.01" className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={itemForm.price} onChange={e => setItemForm({...itemForm, price: parseFloat(e.target.value)})} />
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Category</label>
                      <select className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={itemForm.category} onChange={e => setItemForm({...itemForm, category: e.target.value})}>
                         <option>Burgers</option>
                         <option>Curries</option>
                         <option>Rice</option>
                         <option>Breads</option>
                         <option>Rolls</option>
                         <option>Appetizers</option>
                         <option>Drinks</option>
                         <option>Desserts</option>
                      </select>
                   </div>
                </div>

                <div>
                   <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Description</label>
                   <textarea required className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" rows={3} value={itemForm.description} onChange={e => setItemForm({...itemForm, description: e.target.value})} />
                </div>
                
                <div>
                   <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                   <input required type="text" className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={itemForm.image} onChange={e => setItemForm({...itemForm, image: e.target.value})} />
                </div>

                <div className="flex gap-6 pt-2">
                   <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={itemForm.isVeg} onChange={e => setItemForm({...itemForm, isVeg: e.target.checked})} className="w-5 h-5 rounded text-brand-600 focus:ring-brand-500" />
                      <span className="dark:text-white">Vegetarian</span>
                   </label>
                   <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={itemForm.isSpicy} onChange={e => setItemForm({...itemForm, isSpicy: e.target.checked})} className="w-5 h-5 rounded text-brand-600 focus:ring-brand-500" />
                      <span className="dark:text-white">Spicy</span>
                   </label>
                </div>

                <button type="submit" className="w-full bg-brand-600 text-white py-3 rounded-xl font-bold hover:bg-brand-700 shadow-lg mt-4">
                   {isEditing ? 'Update Dish' : 'Add Dish'}
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
