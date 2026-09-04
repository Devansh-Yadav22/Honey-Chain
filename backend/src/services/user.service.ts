import { pool } from '../config/database';
import { User, Role } from '../types';
import { DEMO_USERS, DEMO_PASSWORD } from '../db/seed';
import bcrypt from 'bcryptjs';

// Pre-hashed default for in-memory fallback
const DEFAULT_HASH = bcrypt.hashSync(DEMO_PASSWORD, 10);

let memoryUsers: (User & { passwordHash: string })[] = DEMO_USERS.map(u => ({
  ...u,
  passwordHash: DEFAULT_HASH,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}));

export class UserService {
  static async getAll(role?: string, orgId?: string, status?: string): Promise<User[]> {
    try {
      let query = `SELECT id, firebase_uid as "firebaseUid", email, name, role, org_id as "orgId", status, phone, created_at as "createdAt", updated_at as "updatedAt"
                   FROM users WHERE 1=1`;
      const params: any[] = [];
      if (role) {
        params.push(role);
        query += ` AND role = $${params.length}`;
      }
      if (orgId) {
        params.push(orgId);
        query += ` AND org_id = $${params.length}`;
      }
      if (status) {
        params.push(status);
        query += ` AND status = $${params.length}`;
      }
      query += ` ORDER BY created_at DESC`;
      const result = await pool.query(query, params);
      if (result.rows && result.rows.length > 0) {
        return result.rows;
      }
    } catch (err) {
      // Memory fallback
    }

    return memoryUsers
      .filter(u => {
        if (role && u.role !== role) return false;
        if (orgId && u.orgId !== orgId) return false;
        if (status && u.status !== status) return false;
        return true;
      })
      .map(({ passwordHash, ...user }) => user);
  }

  static async getById(id: string): Promise<User | null> {
    try {
      const result = await pool.query(
        `SELECT id, firebase_uid as "firebaseUid", email, name, role, org_id as "orgId", status, phone, created_at as "createdAt", updated_at as "updatedAt"
         FROM users WHERE id = $1`,
        [id]
      );
      if (result.rows && result.rows[0]) {
        return result.rows[0];
      }
    } catch (err) {
      // Memory fallback
    }

    const found = memoryUsers.find(u => u.id === id);
    if (!found) return null;
    const { passwordHash, ...user } = found;
    return user;
  }

  static async getByFirebaseUid(firebaseUid: string): Promise<User | null> {
    try {
      const result = await pool.query(
        `SELECT id, firebase_uid as "firebaseUid", email, name, role, org_id as "orgId", status, phone, created_at as "createdAt", updated_at as "updatedAt"
         FROM users WHERE firebase_uid = $1`,
        [firebaseUid]
      );
      if (result.rows && result.rows[0]) {
        return result.rows[0];
      }
    } catch (err) {
      // Memory fallback
    }

    const found = memoryUsers.find(u => u.firebaseUid === firebaseUid);
    if (!found) return null;
    const { passwordHash, ...user } = found;
    return user;
  }

  static async getByEmail(email: string): Promise<User | null> {
    try {
      const result = await pool.query(
        `SELECT id, firebase_uid as "firebaseUid", email, name, role, org_id as "orgId", status, phone, created_at as "createdAt", updated_at as "updatedAt"
         FROM users WHERE LOWER(email) = LOWER($1)`,
        [email]
      );
      if (result.rows && result.rows[0]) {
        return result.rows[0];
      }
    } catch (err) {
      // Memory fallback
    }

    const found = memoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!found) return null;
    const { passwordHash, ...user } = found;
    return user;
  }

  static async getByEmailWithPassword(email: string): Promise<(User & { passwordHash: string }) | null> {
    try {
      const result = await pool.query(
        `SELECT id, firebase_uid as "firebaseUid", email, name, password_hash as "passwordHash", role, org_id as "orgId", status, phone, created_at as "createdAt", updated_at as "updatedAt"
         FROM users WHERE LOWER(email) = LOWER($1)`,
        [email]
      );
      if (result.rows && result.rows[0]) {
        return result.rows[0];
      }
    } catch (err) {
      // Memory fallback
    }

    const found = memoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    return found || null;
  }

  static async create(data: {
    firebaseUid?: string;
    email: string;
    name: string;
    passwordHash?: string;
    role: User['role'];
    orgId?: string;
    status?: User['status'];
    phone?: string;
  }): Promise<User> {
    const id = `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const firebaseUid = data.firebaseUid || `fb-uid-${Date.now()}`;
    const status = data.status || 'ACTIVE';
    const passwordHash = data.passwordHash || DEFAULT_HASH;

    const newUser: User & { passwordHash: string } = {
      id,
      firebaseUid,
      email: data.email,
      name: data.name,
      passwordHash,
      role: data.role,
      orgId: data.orgId || '',
      status,
      phone: data.phone || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    memoryUsers.push(newUser);

    try {
      await pool.query(
        `INSERT INTO users (id, firebase_uid, email, name, password_hash, role, org_id, status, phone)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [id, firebaseUid, newUser.email, newUser.name, passwordHash, newUser.role, newUser.orgId || null, newUser.status, newUser.phone]
      );
    } catch (err) {
      // Memory fallback
    }

    const { passwordHash: _, ...user } = newUser;
    return user;
  }

  static async updateStatus(id: string, status: User['status']): Promise<User | null> {
    try {
      const result = await pool.query(
        `UPDATE users 
         SET status = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2 
         RETURNING id, firebase_uid as "firebaseUid", email, name, role, org_id as "orgId", status, phone, created_at as "createdAt", updated_at as "updatedAt"`,
        [status, id]
      );
      if (result.rows && result.rows[0]) {
        return result.rows[0];
      }
    } catch (err) {
      // Memory fallback
    }

    const u = memoryUsers.find(usr => usr.id === id);
    if (u) {
      u.status = status;
      u.updatedAt = new Date().toISOString();
      const { passwordHash, ...user } = u;
      return user;
    }
    return null;
  }

  static async updateRole(id: string, role: Role): Promise<User | null> {
    try {
      const result = await pool.query(
        `UPDATE users 
         SET role = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2 
         RETURNING id, firebase_uid as "firebaseUid", email, name, role, org_id as "orgId", status, phone, created_at as "createdAt", updated_at as "updatedAt"`,
        [role, id]
      );
      if (result.rows && result.rows[0]) {
        return result.rows[0];
      }
    } catch (err) {
      // Memory fallback
    }

    const u = memoryUsers.find(usr => usr.id === id);
    if (u) {
      u.role = role;
      u.updatedAt = new Date().toISOString();
      const { passwordHash, ...user } = u;
      return user;
    }
    return null;
  }

  static async linkFirebaseUid(id: string, firebaseUid: string): Promise<User | null> {
    try {
      const result = await pool.query(
        `UPDATE users 
         SET firebase_uid = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2 
         RETURNING id, firebase_uid as "firebaseUid", email, name, role, org_id as "orgId", status, phone, created_at as "createdAt", updated_at as "updatedAt"`,
        [firebaseUid, id]
      );
      if (result.rows && result.rows[0]) {
        return result.rows[0];
      }
    } catch (err) {
      // Memory fallback
    }

    const u = memoryUsers.find(usr => usr.id === id);
    if (u) {
      u.firebaseUid = firebaseUid;
      u.updatedAt = new Date().toISOString();
      const { passwordHash, ...user } = u;
      return user;
    }
    return null;
  }
}
