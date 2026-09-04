import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserService } from './user.service';
import { OrganizationService } from './organization.service';
import { AuditService } from './audit.service';
import { User, Organization } from '../types';

export const JWT_SECRET = process.env.JWT_SECRET || 'honeychain_jwt_secret_key_production_grade';
export const JWT_EXPIRES_IN = '24h';

export interface AuthResponse {
  token: string;
  user: User;
  organization?: Organization;
}

export class AuthService {
  static generateToken(user: User): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        orgId: user.orgId,
        status: user.status
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }

  static async login(email: string, password: string, ipAddress?: string): Promise<AuthResponse> {
    const userWithPassword = await UserService.getByEmailWithPassword(email);
    if (!userWithPassword) {
      await AuditService.log('LOGIN_FAILED', 'USER', undefined, undefined, ipAddress, { email, reason: 'USER_NOT_FOUND' });
      throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, userWithPassword.passwordHash);
    if (!isMatch) {
      await AuditService.log('LOGIN_FAILED', 'USER', userWithPassword.id, userWithPassword.id, ipAddress, { email, reason: 'INVALID_CREDENTIALS' });
      throw new Error('Invalid email or password');
    }

    if (userWithPassword.status !== 'ACTIVE') {
      await AuditService.log('LOGIN_REJECTED', 'USER', userWithPassword.id, userWithPassword.id, ipAddress, { email, status: userWithPassword.status });
      throw new Error(`Account is currently ${userWithPassword.status.toLowerCase()}. Please contact administrator.`);
    }

    let organization: Organization | undefined;
    if (userWithPassword.orgId) {
      const org = await OrganizationService.getById(userWithPassword.orgId);
      if (org) {
        if (org.status !== 'ACTIVE' && userWithPassword.role !== 'ADMIN') {
          await AuditService.log('LOGIN_REJECTED_ORG', 'ORGANIZATION', org.id, userWithPassword.id, ipAddress, { orgStatus: org.status });
          throw new Error(`Organization is currently ${org.status.toLowerCase()}. Awaiting administrator approval.`);
        }
        organization = org;
      }
    }

    const { passwordHash, ...user } = userWithPassword;
    const token = this.generateToken(user);

    await AuditService.log('LOGIN_SUCCESS', 'USER', user.id, user.id, ipAddress, { role: user.role });

    return {
      token,
      user,
      organization
    };
  }

  static async signup(data: {
    email: string;
    password: string;
    name: string;
    role: User['role'];
    orgName: string;
    orgType: Organization['type'];
    phone?: string;
    registrationNo?: string;
    address?: string;
  }, ipAddress?: string): Promise<AuthResponse> {
    const existing = await UserService.getByEmailWithPassword(data.email);
    if (existing) {
      throw new Error('A user with this email address already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    // Create organization
    // If it's ADMIN or pre-approved type, ACTIVE, otherwise PENDING
    const orgStatus: Organization['status'] = data.role === 'ADMIN' ? 'ACTIVE' : 'PENDING';
    const userStatus: User['status'] = data.role === 'ADMIN' ? 'ACTIVE' : 'PENDING';

    const org = await OrganizationService.create({
      name: data.orgName,
      type: data.orgType,
      status: orgStatus,
      registrationNo: data.registrationNo,
      address: data.address,
      contactEmail: data.email,
      contactPhone: data.phone
    });

    const user = await UserService.create({
      email: data.email,
      name: data.name,
      passwordHash,
      role: data.role,
      orgId: org.id,
      status: userStatus,
      phone: data.phone
    });

    await AuditService.log('SIGNUP_REGISTERED', 'USER', user.id, user.id, ipAddress, {
      role: user.role,
      orgId: org.id,
      status: userStatus
    });

    const token = this.generateToken(user);

    return {
      token,
      user,
      organization: org
    };
  }

  static async getMe(userId: string): Promise<{ user: User; organization?: Organization }> {
    const user = await UserService.getById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    let organization: Organization | undefined;
    if (user.orgId) {
      organization = (await OrganizationService.getById(user.orgId)) || undefined;
    }
    return { user, organization };
  }

  static verifyToken(token: string): any {
    return jwt.verify(token, JWT_SECRET);
  }
}
