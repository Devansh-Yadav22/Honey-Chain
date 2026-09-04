import { pool } from '../config/database';
import { Organization } from '../types';
import { DEMO_ORGANIZATIONS } from '../db/seed';

let memoryOrgs: Organization[] = [...DEMO_ORGANIZATIONS];

export class OrganizationService {
  static async getAll(status?: string): Promise<Organization[]> {
    try {
      let query = `SELECT id, name, type, status, registration_no as "registrationNo", 
                          address, contact_email as "contactEmail", contact_phone as "contactPhone", 
                          created_at as "createdAt"
                   FROM organizations WHERE 1=1`;
      const params: any[] = [];
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
    return memoryOrgs.filter(o => !status || o.status === status);
  }

  static async getById(id: string): Promise<Organization | null> {
    try {
      const result = await pool.query(
        `SELECT id, name, type, status, registration_no as "registrationNo", 
                address, contact_email as "contactEmail", contact_phone as "contactPhone", 
                created_at as "createdAt"
         FROM organizations WHERE id = $1`,
        [id]
      );
      if (result.rows && result.rows[0]) {
        return result.rows[0];
      }
    } catch (err) {
      // Memory fallback
    }
    return memoryOrgs.find(o => o.id === id) || null;
  }

  static async create(data: {
    name: string;
    type: Organization['type'];
    registrationNo?: string;
    address?: string;
    contactEmail?: string;
    contactPhone?: string;
    status?: Organization['status'];
  }): Promise<Organization> {
    const id = `org-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const status = data.status || 'PENDING';
    const newOrg: Organization = {
      id,
      name: data.name,
      type: data.type,
      status,
      registrationNo: data.registrationNo || '',
      address: data.address || '',
      contactEmail: data.contactEmail || '',
      contactPhone: data.contactPhone || '',
      createdAt: new Date().toISOString()
    };

    memoryOrgs.push(newOrg);

    try {
      await pool.query(
        `INSERT INTO organizations (id, name, type, status, registration_no, address, contact_email, contact_phone)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [id, newOrg.name, newOrg.type, newOrg.status, newOrg.registrationNo, newOrg.address, newOrg.contactEmail, newOrg.contactPhone]
      );
    } catch (err) {
      // Memory fallback
    }

    return newOrg;
  }

  static async updateStatus(id: string, status: Organization['status']): Promise<Organization | null> {
    try {
      const result = await pool.query(
        `UPDATE organizations 
         SET status = $1 
         WHERE id = $2 
         RETURNING id, name, type, status, registration_no as "registrationNo", 
                   address, contact_email as "contactEmail", contact_phone as "contactPhone", 
                   created_at as "createdAt"`,
        [status, id]
      );
      if (result.rows && result.rows[0]) {
        return result.rows[0];
      }
    } catch (err) {
      // Memory fallback
    }

    const org = memoryOrgs.find(o => o.id === id);
    if (org) {
      org.status = status;
      return org;
    }
    return null;
  }
}
