//adminService.js
const { database } = require('../../helpers/config/db');
const argon2 = require('argon2');
const { ValidationError } = require('../../helpers/errors/customErrors');
const { deleteFile } = require('../../middlewares/uploadMiddleware');
const fs = require('fs');

class AdminService {
  // Private methods
  async #validateAdminData(adminData, isUpdate = false) {
    const { email, password, name } = adminData;
    
    if (!isUpdate) {
      if (!email || !password || !name) {
        throw new ValidationError('Email, password, and name are required');
      }
    }

    if (email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      throw new ValidationError('Invalid email format');
    }

    if (password && password.length < 8) {
      throw new ValidationError('Password must be at least 8 characters long');
    }
  }

  // Public methods
  async registerAdmin(adminData, profilePicture = null) {
    try {
      await this.#validateAdminData(adminData);
      
      const { name, email, password, role = 'ADMIN', userLabel } = adminData;
      const hashedPassword = await argon2.hash(password);
      
      const admin = await database.admin.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role,
          userLabel,
          profilePicture: profilePicture?.path || null
        }
      });

      return this.#sanitizeAdminData(admin);
      
    } catch (error) {
      if (profilePicture?.path) {
        await deleteFile(profilePicture.path);
      }
      
      if (error.code === 'P2002') {
        throw new ValidationError('Email already exists');
      }
      throw error;
    }
  }

  async getAllAdmins(page = 1, limit = 10, search = '') {
    try {
      const skip = (page - 1) * limit;
      const where = search ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      } : {};

      const [admins, total] = await Promise.all([
        database.admin.findMany({
          where,
          select: this.#getAdminSelectFields(),
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' }
        }),
        database.admin.count({ where })
      ]);

      return {
        admins: admins.map(this.#sanitizeAdminData),
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new ValidationError('Failed to fetch admin list');
    }
  }

  async getAdminById(adminId) {
    try {
      const admin = await this.#checkAdminExists(adminId);
      if (!admin) {
        throw new ValidationError(`Admin with ID ${adminId} not found`);
      }
      return this.#sanitizeAdminData(admin);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new ValidationError(`Admin with ID ${adminId} not found`);
      }
      throw error;
    }
  }
  
  #checkAdminExists(adminId) {
    return database.admin.findUnique({
      where: { adminId },
      select: { adminId: true, name: true, email: true, profilePicture: true, userLabel: true, role: true, createdAt: true, updatedAt: true }
    });
  }

  async updateAdmin(adminId, updateData, profilePicture = null) {
    try {
      const existingAdmin = await this.#checkAdminExists(adminId);
      await this.#validateAdminData(updateData, true);
  
      const { password, ...otherData } = updateData;
      const data = { ...otherData };
  
      if (password) {
        data.password = await argon2.hash(password);
      }
  
      if (profilePicture) {
        data.profilePicture = profilePicture.path;
      } else if (existingAdmin.profilePicture) {
        // Remove the existing profile picture if a new one is not provided
        data.profilePicture = null;
      }
  
      const updatedAdmin = await database.admin.update({
        where: { adminId },
        data,
        select: this.#getAdminSelectFields(),
      });
  
      return this.#sanitizeAdminData(updatedAdmin);
    } catch (error) {
      if (profilePicture?.path) {
        // Here, you can add the logic to delete the uploaded file
        // For example, if you're using the `fs` module:
        await fs.unlink(profilePicture.path, (err) => {
          if (err) {
            console.error('Error deleting file:', err);
          }
        });
      }
  
      if (error.code === 'P2025') {
        throw new ValidationError('Admin not found');
      }
      throw error;
    }
  }

  async deleteAdmin(adminId) {
    try {
      const admin = await this.#checkAdminExists(adminId);
  
      if (admin && admin.profilePicture) {
        // Here, you can add the logic to delete the uploaded file
        // For example, if you're using the `fs` module:
        await fs.unlink(admin.profilePicture, (err) => {
          if (err) {
            console.error('Error deleting file:', err);
          }
        });
      }
  
      await database.admin.delete({
        where: { adminId },
      });
  
      return { message: 'Admin deleted successfully' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new ValidationError('Admin not found');
      }
      throw error;
    }
  }

  // Private helper methods
  #getAdminSelectFields() {
    return {
      adminId: true,
      name: true,
      email: true,
      role: true,
      profilePicture: true,
      userLabel: true,
      createdAt: true,
      updatedAt: true,
    };
  }

  #sanitizeAdminData(admin) {
    const { password, ...sanitizedAdmin } = admin;
    return sanitizedAdmin;
  }
}

module.exports = new AdminService();