import { User } from '../types';

const USERS_KEY = 'cb_users';
const SESSION_KEY = 'cb_session';

interface StoredUser extends User {
  password?: string;
  provider: 'email' | 'google' | 'twitter';
  createdAt: string;
  avatar?: string;
}

// Helper to decode JWT (Google ID Token)
const parseJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Failed to parse JWT", e);
    return null;
  }
};

export const authService = {
  // READ (All Users)
  getUsers: (): StoredUser[] => {
    const usersStr = localStorage.getItem(USERS_KEY);
    return usersStr ? JSON.parse(usersStr) : [];
  },

  // CREATE / UPDATE
  saveUserToStorage: (user: StoredUser) => {
    const users = authService.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    
    if (index >= 0) {
      users[index] = { ...users[index], ...user }; // Update existing
    } else {
      users.push(user); // Create new
    }
    
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  // CREATE (Signup)
  signup: async (name: string, email: string, password?: string): Promise<{ success: boolean; message?: string; user?: User }> => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate net delay

    const users = authService.getUsers();
    // Check if email exists specifically for email provider to avoid conflict
    if (users.find(u => u.email === email && u.provider === 'email')) {
      return { success: false, message: 'User with this email already exists.' };
    }

    const role = email.toLowerCase().includes('admin') ? 'admin' : 'customer';

    const newUser: StoredUser = {
      id: 'u-' + Math.random().toString(36).substr(2, 9),
      name,
      email,
      role,
      password: password, 
      provider: 'email',
      createdAt: new Date().toISOString()
    };

    authService.saveUserToStorage(newUser);
    const { password: _, ...safeUser } = newUser;
    return { success: true, user: safeUser };
  },

  // READ (Login)
  login: async (email: string, password: string): Promise<{ success: boolean; message?: string; user?: User }> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const users = authService.getUsers();
    const user = users.find(u => u.email === email && u.provider === 'email');

    if (!user) {
      return { success: false, message: 'Account not found. Please sign up.' };
    }

    if (user.password !== password) {
      return { success: false, message: 'Incorrect password.' };
    }

    const { password: _, ...safeUser } = user;
    authService.setSession(safeUser);
    return { success: true, user: safeUser };
  },

  // REAL GOOGLE AUTH (JWT Processing)
  googleLogin: async (credential: string): Promise<{ success: boolean; message?: string; user?: User }> => {
    // 1. Decode the token to get user info (email, name, picture, sub)
    const payload = parseJwt(credential);
    
    if (!payload || !payload.email) {
        return { success: false, message: 'Invalid Google Token' };
    }

    const users = authService.getUsers();
    // Check if user exists by email, to link accounts if they signed up via email previously
    let user = users.find(u => u.email === payload.email);

    if (!user) {
        // Create new Google User
        const newUser: StoredUser = {
            id: 'g-' + payload.sub, // Google unique Subject ID
            name: payload.name || payload.email.split('@')[0],
            email: payload.email,
            role: 'customer',
            provider: 'google',
            createdAt: new Date().toISOString(),
            avatar: payload.picture // Get the real profile picture
        };
        authService.saveUserToStorage(newUser);
        user = newUser;
    } else {
        // Update existing user with latest Google info (e.g. new profile pic)
        // Only if it's not an 'email' provider account to avoid overwriting password logic? 
        // Actually, let's allow linking.
        if (user.provider === 'google' || user.provider === 'email') {
             const updatedUser = { 
                ...user, 
                avatar: payload.picture, 
                name: payload.name || user.name 
            };
            authService.saveUserToStorage(updatedUser);
            user = updatedUser;
        }
    }

    // Strip internal fields before returning session
    const { password: _, ...safeUser } = user;
    authService.setSession(safeUser);
    return { success: true, user: safeUser };
  },

  // TWITTER AUTH (Mock Implementation)
  // Note: Real Twitter OAuth requires backend proxy for tokens.
  twitterLoginMock: async (): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate getting data from Twitter redirect
    const mockEmail = `twitter_user_${Math.floor(Math.random()*1000)}@x.com`;
    const users = authService.getUsers();
    let user = users.find(u => u.email === mockEmail);

    if (!user) {
        const newUser: StoredUser = {
            id: 'tw-' + Math.random().toString(36).substr(2, 9),
            name: 'X User',
            email: mockEmail,
            role: 'customer',
            provider: 'twitter',
            createdAt: new Date().toISOString()
        };
        authService.saveUserToStorage(newUser);
        user = newUser;
    }
    
    const { password: _, ...safeUser } = user;
    authService.setSession(safeUser);
    return safeUser;
  },

  // UPDATE
  updateProfile: async (userId: string, updates: Partial<User>): Promise<User | null> => {
    const users = authService.getUsers();
    const index = users.findIndex(u => u.id === userId);
    
    if (index === -1) return null;

    users[index] = { ...users[index], ...updates };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // Update session if it's the current user
    const currentSession = authService.getSession();
    if (currentSession && currentSession.id === userId) {
        const { password: _, ...safeUser } = users[index];
        authService.setSession(safeUser);
        return safeUser;
    }
    
    const { password: _, ...safeUser } = users[index];
    return safeUser;
  },

  // DELETE
  deleteAccount: async (userId: string) => {
    let users = authService.getUsers();
    users = users.filter(u => u.id !== userId);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    authService.logout();
  },

  // SESSION MGMT
  setSession: (user: User) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  },

  getSession: (): User | null => {
    const sessionStr = localStorage.getItem(SESSION_KEY);
    return sessionStr ? JSON.parse(sessionStr) : null;
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  }
};