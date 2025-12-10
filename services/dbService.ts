
import { MenuItem, Order, Reservation, NewsletterSubscriber, Transaction, CateringRequest } from '../types';
import { MENU_ITEMS } from '../constants';

// Keys for LocalStorage
const KEYS = {
  MENU: 'cb_menu_items',
  ORDERS: 'cb_orders',
  RESERVATIONS: 'cb_reservations',
  CATERING: 'cb_catering',
  SUBSCRIBERS: 'cb_subscribers',
  TRANSACTIONS: 'cb_transactions',
  USERS: 'cb_users'
};

// Initialize Mock Data if empty or valid
const initDB = () => {
  try {
    // 1. Seed Menu
    const storedMenu = localStorage.getItem(KEYS.MENU);
    if (!storedMenu || JSON.parse(storedMenu).length === 0) {
      localStorage.setItem(KEYS.MENU, JSON.stringify(MENU_ITEMS));
    }

    // 2. Seed Admin User if no users exist
    const storedUsers = localStorage.getItem(KEYS.USERS);
    if (!storedUsers) {
        const defaultAdmin = {
            id: 'u-admin-001',
            name: 'Admin User',
            email: 'admin@curries.com',
            password: 'admin', // In a real app, hash this!
            role: 'admin',
            provider: 'email',
            createdAt: new Date().toISOString()
        };
        localStorage.setItem(KEYS.USERS, JSON.stringify([defaultAdmin]));
        console.log("Database seeded: Default Admin created (admin@curries.com / admin)");
    }

  } catch (e) {
    console.error("DB Init Error, resetting defaults", e);
    localStorage.setItem(KEYS.MENU, JSON.stringify(MENU_ITEMS));
  }
};

initDB();

export const dbService = {
  // --- MENU MANAGEMENT ---
  getMenuItems: (): MenuItem[] => {
    try {
      const data = localStorage.getItem(KEYS.MENU);
      return data ? JSON.parse(data) : MENU_ITEMS;
    } catch {
      return MENU_ITEMS;
    }
  },

  addMenuItem: (item: Omit<MenuItem, 'id'>): MenuItem => {
    const items = dbService.getMenuItems();
    const newItem = { ...item, id: Date.now().toString() };
    items.push(newItem);
    localStorage.setItem(KEYS.MENU, JSON.stringify(items));
    return newItem;
  },

  updateMenuItem: (id: string, updates: Partial<MenuItem>): MenuItem | null => {
    const items = dbService.getMenuItems();
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) return null;
    
    items[idx] = { ...items[idx], ...updates };
    localStorage.setItem(KEYS.MENU, JSON.stringify(items));
    return items[idx];
  },

  deleteMenuItem: (id: string) => {
    const items = dbService.getMenuItems().filter(i => i.id !== id);
    localStorage.setItem(KEYS.MENU, JSON.stringify(items));
  },

  // --- ORDER MANAGEMENT ---
  getOrders: (): Order[] => {
    const data = localStorage.getItem(KEYS.ORDERS);
    return data ? JSON.parse(data) : [];
  },

  getUserOrders: (userId: string): Order[] => {
    return dbService.getOrders()
      .filter(o => o.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  getOrderById: (orderId: string): Order | undefined => {
    return dbService.getOrders().find(o => o.id === orderId);
  },

  createOrder: (orderData: Omit<Order, 'id' | 'status' | 'date'>): Order => {
    const orders = dbService.getOrders();
    // Generate ID: CB-{Random 6 digits}
    const newOrder: Order = {
      ...orderData,
      id: `CB-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'Pending',
      date: new Date().toISOString()
    };
    orders.unshift(newOrder); // Add to top
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
    return newOrder;
  },

  updateOrderStatus: (orderId: string, status: Order['status']) => {
    const orders = dbService.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
    }
  },

  // --- TRANSACTION MANAGEMENT ---
  getTransactions: (): Transaction[] => {
    const data = localStorage.getItem(KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : [];
  },

  createTransaction: (txData: Omit<Transaction, 'id' | 'date'>): Transaction => {
    const transactions = dbService.getTransactions();
    const newTx: Transaction = {
      ...txData,
      id: `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      date: new Date().toISOString()
    };
    transactions.unshift(newTx);
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(transactions));
    return newTx;
  },

  linkTransactionToOrder: (transactionId: string, orderId: string) => {
    const transactions = dbService.getTransactions();
    const tx = transactions.find(t => t.id === transactionId);
    if (tx) {
        tx.orderId = orderId;
        localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(transactions));
    }
  },

  // --- RESERVATIONS ---
  createReservation: (resData: Omit<Reservation, 'id' | 'status'>): Reservation => {
    const reservations = JSON.parse(localStorage.getItem(KEYS.RESERVATIONS) || '[]');
    const newRes: Reservation = {
      ...resData,
      id: `RES-${Date.now()}`,
      status: 'Confirmed'
    };
    reservations.push(newRes);
    localStorage.setItem(KEYS.RESERVATIONS, JSON.stringify(reservations));
    return newRes;
  },

  // --- CATERING ---
  createCateringRequest: (reqData: Omit<CateringRequest, 'id' | 'status'>): CateringRequest => {
    const requests = JSON.parse(localStorage.getItem(KEYS.CATERING) || '[]');
    const newReq: CateringRequest = {
        ...reqData,
        id: `CAT-${Date.now()}`,
        status: 'New'
    };
    requests.push(newReq);
    localStorage.setItem(KEYS.CATERING, JSON.stringify(requests));
    return newReq;
  },

  // --- NEWSLETTER ---
  subscribeToNewsletter: (email: string) => {
    const subscribers: NewsletterSubscriber[] = JSON.parse(localStorage.getItem(KEYS.SUBSCRIBERS) || '[]');
    if (!subscribers.find(s => s.email === email)) {
      subscribers.push({ email, subscribedAt: new Date().toISOString() });
      localStorage.setItem(KEYS.SUBSCRIBERS, JSON.stringify(subscribers));
    }
  }
};
