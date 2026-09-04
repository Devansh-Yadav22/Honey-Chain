import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Role, Organization } from '../types';
import { 
  auth, 
  signInWithEmailAndPassword, 
  firebaseSignOut, 
  sendPasswordResetEmail,
  onAuthStateChanged,
  FirebaseUser 
} from '../config/firebase';
import { 
  getAuthUsers, 
  getAuthOrganizations, 
  setApiAuth, 
  loginWithPassword 
} from '../services/api';

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  currentUser: User | null;
  applicationUser: User | null;
  currentRole: Role;
  currentOrg: Organization | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  availableUsers: User[];
  availableOrgs: Organization[];
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => void;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  refreshUserProfile: () => Promise<void>;
}

const DEFAULT_USERS: User[] = [
  {
    id: 'usr-admin-01',
    firebaseUid: 'fb-uid-admin-01',
    name: 'Dr. Rajesh Sharma (Authority Admin)',
    fullName: 'Dr. Rajesh Sharma (Authority Admin)',
    email: 'admin@honeychain.demo',
    role: 'ADMIN',
    organizationId: 'org-admin-01',
    orgId: 'org-admin-01',
    organizationName: 'Honey Chain National Authority',
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'usr-beekeeper-01',
    firebaseUid: 'fb-uid-beekeeper-01',
    name: 'Ramesh Singh (Master Beekeeper)',
    fullName: 'Ramesh Singh (Master Beekeeper)',
    email: 'beekeeper@honeychain.demo',
    role: 'BEEKEEPER',
    organizationId: 'org-apiary-01',
    orgId: 'org-apiary-01',
    organizationName: 'Himalayan Pure Apiaries',
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'usr-processor-01',
    firebaseUid: 'fb-uid-processor-01',
    name: 'Anita Verma (Chief Processor)',
    fullName: 'Anita Verma (Chief Processor)',
    email: 'processor@honeychain.demo',
    role: 'PROCESSOR',
    organizationId: 'org-proc-01',
    orgId: 'org-proc-01',
    organizationName: 'NectarPure Processing Facilities',
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'usr-transporter-01',
    firebaseUid: 'fb-uid-transporter-01',
    name: 'Vikram Malhotra (Lead Logistics Officer)',
    fullName: 'Vikram Malhotra (Lead Logistics Officer)',
    email: 'transporter@honeychain.demo',
    role: 'TRANSPORTER',
    organizationId: 'org-log-01',
    orgId: 'org-log-01',
    organizationName: 'ColdRoute Agro Logistics',
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'usr-packager-01',
    firebaseUid: 'fb-uid-packager-01',
    name: 'Suresh Patel (Packaging Lead)',
    fullName: 'Suresh Patel (Packaging Lead)',
    email: 'packager@honeychain.demo',
    role: 'PACKAGER',
    organizationId: 'org-pack-01',
    orgId: 'org-pack-01',
    organizationName: 'EcoPack Honey Packaging Ltd',
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'usr-lab-01',
    firebaseUid: 'fb-uid-lab-01',
    name: 'Dr. Priya Nair (Senior Quality Analyst)',
    fullName: 'Dr. Priya Nair (Senior Quality Analyst)',
    email: 'lab@honeychain.demo',
    role: 'QUALITY_LAB',
    organizationId: 'org-lab-01',
    orgId: 'org-lab-01',
    organizationName: 'FSSAI Certified Apex Quality Labs',
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00Z'
  }
];

const DEFAULT_ORGS: Organization[] = [
  { id: 'org-admin-01', name: 'Honey Chain National Authority', type: 'ADMIN', location: 'New Delhi, India', contactEmail: 'admin@honeychain.demo', status: 'ACTIVE', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'org-apiary-01', name: 'Himalayan Pure Apiaries', type: 'APIARY', location: 'Nainital, Uttarakhand', contactEmail: 'beekeeper@honeychain.demo', status: 'ACTIVE', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'org-proc-01', name: 'NectarPure Processing Facilities', type: 'PROCESSOR', location: 'Haridwar, Uttarakhand', contactEmail: 'processor@honeychain.demo', status: 'ACTIVE', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'org-log-01', name: 'ColdRoute Agro Logistics', type: 'LOGISTICS', location: 'Gurugram, Haryana', contactEmail: 'transporter@honeychain.demo', status: 'ACTIVE', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'org-pack-01', name: 'EcoPack Honey Packaging Ltd', type: 'PACKAGING_FACILITY', location: 'Noida, Uttar Pradesh', contactEmail: 'packager@honeychain.demo', status: 'ACTIVE', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'org-lab-01', name: 'FSSAI Certified Apex Quality Labs', type: 'QUALITY_LAB', location: 'New Delhi', contactEmail: 'lab@honeychain.demo', status: 'ACTIVE', createdAt: '2026-01-01T00:00:00Z' }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('honeychain_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });
  const [token, setToken] = useState<string | null>(localStorage.getItem('honeychain_token'));
  const [loading, setLoading] = useState<boolean>(true);
  const [availableUsers, setAvailableUsers] = useState<User[]>(DEFAULT_USERS);
  const [availableOrgs, setAvailableOrgs] = useState<Organization[]>(DEFAULT_ORGS);

  // Sync auth headers with API client
  useEffect(() => {
    setApiAuth(currentUser, token || undefined);
  }, [currentUser, token]);

  // Initial fetch of users and organizations for admin/directory views
  const refreshUserProfile = useCallback(async () => {
    try {
      const [users, orgs] = await Promise.all([
        getAuthUsers(),
        getAuthOrganizations()
      ]);
      if (users && users.length > 0) setAvailableUsers(users);
      if (orgs && orgs.length > 0) setAvailableOrgs(orgs);
    } catch (err) {
      console.warn('Could not refresh directory data:', err);
    }
  }, []);

  useEffect(() => {
    refreshUserProfile();
  }, [refreshUserProfile]);

  // Firebase Auth State Listener across page reloads
  useEffect(() => {
    let isMounted = true;
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (!isMounted) return;
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          const idToken = await fbUser.getIdToken();
          setToken(idToken);
          localStorage.setItem('honeychain_token', idToken);

          // Resolve PostgreSQL user profile
          const matchedUser = availableUsers.find(u => 
            (fbUser.email && u.email.toLowerCase() === fbUser.email.toLowerCase()) ||
            u.firebaseUid === fbUser.uid ||
            u.id === fbUser.uid
          );

          if (matchedUser) {
            setCurrentUser(matchedUser);
            localStorage.setItem('honeychain_user', JSON.stringify(matchedUser));
            setApiAuth(matchedUser, idToken);
          }
        } catch (err) {
          console.warn('Error fetching ID token from Firebase user:', err);
        }
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [availableUsers]);

  const login = async (email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    setLoading(true);
    try {
      let resolvedToken: string | null = null;
      let appUser: User | null = null;

      // 1. Try Firebase Web SDK Email/Password sign in
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (userCredential && userCredential.user) {
          setFirebaseUser(userCredential.user);
          resolvedToken = await userCredential.user.getIdToken();
        }
      } catch (fbErr: any) {
        // Fallback to backend authentication if Firebase Client is operating in mock / test environment
        console.info('Firebase Client login returned:', fbErr.message, 'Verifying with Backend Auth service...');
      }

      // 2. Authenticate against Backend API (verifies password & fetches PostgreSQL user profile)
      const res = await loginWithPassword(email, password);
      if (res && res.user) {
        appUser = res.user;
        const finalToken = resolvedToken || res.token || `test-token-${res.user.firebaseUid || res.user.id}`;

        setToken(finalToken);
        localStorage.setItem('honeychain_token', finalToken);
        setCurrentUser(appUser);
        localStorage.setItem('honeychain_user', JSON.stringify(appUser));
        setApiAuth(appUser, finalToken);

        setLoading(false);
        return { success: true, user: appUser };
      }

      setLoading(false);
      return { success: false, error: 'Invalid email or password' };
    } catch (err: any) {
      setLoading(false);
      return { success: false, error: err.message || 'Authentication failed' };
    }
  };

  const logout = () => {
    try {
      firebaseSignOut(auth);
    } catch (e) {}
    setFirebaseUser(null);
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem('honeychain_token');
    localStorage.removeItem('honeychain_user');
    setApiAuth(null);
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (err: any) {
      // Return clear error if email not found or client error
      return { success: false, error: err.message || 'Failed to send password reset email' };
    }
  };

  const currentRole: Role = currentUser ? currentUser.role : 'CONSUMER';
  const currentOrg = currentUser 
    ? (availableOrgs.find(o => o.id === (currentUser.organizationId || currentUser.orgId)) || null) 
    : null;
  const isAuthenticated = currentUser !== null && currentUser.role !== 'CONSUMER';

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        currentUser,
        applicationUser: currentUser,
        currentRole,
        currentOrg,
        token,
        loading,
        isAuthenticated,
        availableUsers,
        availableOrgs,
        login,
        logout,
        resetPassword,
        refreshUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
