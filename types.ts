
// Domain Models

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isVeg: boolean;
  isSpicy: boolean;
  isChefSpecial: boolean;
  calories?: number;
}

export interface CartItem extends MenuItem {
  quantity: number;
  customization?: string;
}

export interface Order {
  id: string;
  userId: string; // 'guest' or valid UUID
  customerName: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  date: string; // ISO String
  paymentMethod: 'card' | 'upi' | 'cod';
  address: string;
  transactionId?: string; // Link to payment
}

export interface Transaction {
  id: string;
  orderId?: string;
  userId: string;
  amount: number;
  method: 'card' | 'upi' | 'cod';
  status: 'success' | 'failed' | 'refunded';
  date: string;
  metadata?: {
    last4?: string;
    cardBrand?: string;
    upiId?: string;
  };
}

export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
}

export interface CateringRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  eventType: string;
  date: string;
  guestCount: number;
  message: string;
  status: 'New' | 'Contacted' | 'Closed';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer' | 'staff';
  avatar?: string;
  loyaltyPoints?: number;
}

export interface NewsletterSubscriber {
  email: string;
  subscribedAt: string;
}

export type ViewState = 'HOME' | 'MENU' | 'RESERVATION' | 'CATERING' | 'GALLERY' | 'ABOUT' | 'CONTACT' | 'ADMIN' | 'TRACK_ORDER' | 'MY_ORDERS';
