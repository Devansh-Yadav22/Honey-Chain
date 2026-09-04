import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role, Organization } from '../types';
import { getAuthUsers, getAuthOrganizations } from '../services/api';

interface AuthContextType {
  currentUser: User | null;
  currentRole: Role;
  currentOrg: Organization | null;
  availableUsers: User[];
  availableOrgs: Organization[];
  switchRole: (role: Role) => void;
  switchUser: (userId: string) => void;
}

const DEFAULT_USERS: User[] = [
  {
    id: 'USR-ADMIN-01',
    username: 'admin',
    fullName: 'Vikramaditya Sharma',
    email: 'admin@honeychain.gov.in',
    role: 'ADMIN',
    organizationId: 'ORG-ADMIN',
    organizationName: 'Honey Chain Central Operations',
    status: 'ACTIVE',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'USR-BEE-01',
    username: 'beekeeper_rajesh',
    fullName: 'Rajesh Kumar Verma',
    email: 'rajesh@himalayanbees.coop',
    role: 'BEEKEEPER',
    organizationId: 'ORG-BEE-01',
    organizationName: 'Himalayan Apiary Cooperative',
    status: 'ACTIVE',
    createdAt: '2025-01-10T00:00:00Z'
  },
  {
    id: 'USR-PROC-01',
    username: 'processor_anita',
    fullName: 'Anita Desai',
    email: 'anita@nilgirihoney.in',
    role: 'PROCESSOR',
    organizationId: 'ORG-PROC-01',
    organizationName: 'Nilgiri Pure Extraction Ltd',
    status: 'ACTIVE',
    createdAt: '2025-02-01T00:00:00Z'
  },
  {
    id: 'USR-LOG-01',
    username: 'transporter_gurdeep',
    fullName: 'Gurdeep Singh',
    email: 'gurdeep@bharatcoldchain.com',
    role: 'TRANSPORTER',
    organizationId: 'ORG-LOG-01',
    organizationName: 'Bharat Cold-Chain Logistics',
    status: 'ACTIVE',
    createdAt: '2025-02-15T00:00:00Z'
  },
  {
    id: 'USR-PACK-01',
    username: 'packager_priya',
    fullName: 'Priya Sundaram',
    email: 'priya@pureflora.in',
    role: 'PACKAGER',
    organizationId: 'ORG-PACK-01',
    organizationName: 'PureFlora Packaging Hub',
    status: 'ACTIVE',
    createdAt: '2025-03-01T00:00:00Z'
  },
  {
    id: 'USR-LAB-01',
    username: 'analyst_mehta',
    fullName: 'Dr. Arishta Mehta',
    email: 'dr.mehta@apexlabs.res.in',
    role: 'QUALITY_LAB',
    organizationId: 'ORG-LAB-01',
    organizationName: 'Apex Food Safety Labs (NABL)',
    status: 'ACTIVE',
    createdAt: '2025-03-10T00:00:00Z'
  }
];

const DEFAULT_ORGS: Organization[] = [
  { id: 'ORG-ADMIN', name: 'Honey Chain Central Operations', type: 'PLATFORM_ADMIN', location: 'New Delhi, India', contactEmail: 'ops@honeychain.gov.in', status: 'ACTIVE', createdAt: '2025-01-01T00:00:00Z' },
  { id: 'ORG-BEE-01', name: 'Himalayan Apiary Cooperative', type: 'APIARY_COOPERATIVE', location: 'Kangra & Shimla, HP', contactEmail: 'contact@himalayanbees.coop', status: 'ACTIVE', createdAt: '2025-01-10T00:00:00Z' },
  { id: 'ORG-PROC-01', name: 'Nilgiri Pure Extraction Ltd', type: 'PROCESSING_FACILITY', location: 'Coimbatore, TN', contactEmail: 'qa@nilgirihoney.in', status: 'ACTIVE', createdAt: '2025-02-01T00:00:00Z' },
  { id: 'ORG-LOG-01', name: 'Bharat Cold-Chain Logistics', type: 'LOGISTICS_FLEET', location: 'New Delhi & Chandigarh', contactEmail: 'dispatch@bharatcoldchain.com', status: 'ACTIVE', createdAt: '2025-02-15T00:00:00Z' },
  { id: 'ORG-PACK-01', name: 'PureFlora Packaging Hub', type: 'PACKAGING_PLANT', location: 'Okhla, New Delhi', contactEmail: 'bottling@pureflora.in', status: 'ACTIVE', createdAt: '2025-03-01T00:00:00Z' },
  { id: 'ORG-LAB-01', name: 'Apex Food Safety Labs (NABL)', type: 'QUALITY_LABORATORY', location: 'Gurugram, Haryana', contactEmail: 'certificates@apexlabs.res.in', status: 'ACTIVE', createdAt: '2025-03-10T00:00:00Z' }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [availableUsers, setAvailableUsers] = useState<User[]>(DEFAULT_USERS);
  const [availableOrgs, setAvailableOrgs] = useState<Organization[]>(DEFAULT_ORGS);
  const [currentUser, setCurrentUser] = useState<User | null>(DEFAULT_USERS[0]);

  useEffect(() => {
    getAuthUsers().then(users => {
      if (users && users.length > 0) setAvailableUsers(users);
    });
    getAuthOrganizations().then(orgs => {
      if (orgs && orgs.length > 0) setAvailableOrgs(orgs);
    });
  }, []);

  const switchRole = (role: Role) => {
    if (role === 'CONSUMER') {
      setCurrentUser(null);
      return;
    }
    const user = availableUsers.find(u => u.role === role) || DEFAULT_USERS.find(u => u.role === role);
    if (user) {
      setCurrentUser(user);
    }
  };

  const switchUser = (userId: string) => {
    const user = availableUsers.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const currentRole: Role = currentUser ? currentUser.role : 'CONSUMER';
  const currentOrg = currentUser ? (availableOrgs.find(o => o.id === currentUser.organizationId) || null) : null;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        currentOrg,
        availableUsers,
        availableOrgs,
        switchRole,
        switchUser
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
