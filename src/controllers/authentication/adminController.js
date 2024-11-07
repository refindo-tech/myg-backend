// adminController.js
const webResponses = require('../../helpers/web/webResponses');
const adminService = require('../../services/authentication/adminServices');
const { ValidationError } = require('../../helpers/errors/customErrors');
const { adminUpload } = require('../../middlewares/uploadMiddleware');
const multer = require('multer');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const adminValidation = require('../../validators/authentication/adminValidator');

class AdminController {
  constructor() {
    this.ajv = new Ajv({ 
      allErrors: true,
      removeAdditional: true,
      useDefaults: true,
      coerceTypes: true
    });
    addFormats(this.ajv);

    // Compile all validation schemas
    this.validateAdmin = this.ajv.compile(adminValidation.adminRegistrationSchema);
    this.validateUpdate = this.ajv.compile(adminValidation.adminUpdateSchema);
  }

  registerAdmin = async (req, res) => {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        throw new ValidationError('Request body cannot be empty');
      }

      if (req.user?.role !== 'SUPER_ADMIN') {
        throw new ValidationError('Only SUPER_ADMIN can register new admins');
      }

      const isValid = this.validateAdmin(req.body);
      if (!isValid) {
        const errors = this.validateAdmin.errors.map(err => ({
          field: err.instancePath.substring(1) || err.params.missingProperty,
          message: err.message
        }));
        throw new ValidationError('Validation failed', errors);
      }

      if (req.body.password !== req.body.confirmPassword) {
        throw new ValidationError('Passwords do not match');
      }

      const { confirmPassword, ...adminData } = req.body;
      const newAdmin = await adminService.registerAdmin(adminData, req.file);

      return res.status(201).json(
        webResponses.successResponse('Admin registered successfully', newAdmin)
      );

    } catch (error) {
      return this.handleError(error, res);
    }
  };

  getAllAdmins = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';

      const result = await adminService.getAllAdmins(page, limit, search);

      return res.json(
        webResponses.successResponse('Admins retrieved successfully', result)
      );
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  getAdminById = async (req, res) => {
    try {
      const { adminId } = req.params;
      if (!adminId || isNaN(parseInt(adminId)) || parseInt(adminId) <= 0) {
        return res.status(400).json({
          meta: {
            success: false,
            message: 'ID admin tidak valid',
            errors: [{ field: 'id', message: 'ID admin harus berupa bilangan bulat positif' }]
          }
        });
      }
  
      const admin = await adminService.getAdminById(parseInt(adminId));
      if (!admin) {
        return res.status(404).json({
          meta: {
            success: false,
            message: 'Admin tidak ditemukan',
            errors: [{ field: 'id', message: 'Admin dengan ID yang diberikan tidak ada' }]
          }
        });
      }
  
      return res.json(
        webResponses.successResponse('Admin berhasil diambil', admin)
      );
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  updateAdmin = async (req, res) => {
    try {
      const { adminId } = req.params;
      if (!adminId || isNaN(parseInt(adminId)) || parseInt(adminId) <= 0) {
        throw new ValidationError('ID admin tidak valid', [
          { field: 'id', message: 'ID admin harus berupa bilangan bulat positif' },
        ]);
      }
  
      if (!req.body || Object.keys(req.body).length === 0) {
        throw new ValidationError('Request body tidak boleh kosong');
      }
  
      const isValid = this.validateUpdate(req.body);
      if (!isValid) {
        const errors = this.validateUpdate.errors.map((err) => ({
          field: err.instancePath.substring(1) || err.params.missingProperty,
          message: err.message,
        }));
        throw new ValidationError('Validasi gagal', errors);
      }
  
      if (req.body.password && req.body.password !== req.body.confirmPassword) {
        throw new ValidationError('Password tidak cocok');
      }
  
      const { confirmPassword, ...updateData } = req.body;
      const updatedAdmin = await adminService.updateAdmin(
        parseInt(adminId),
        updateData,
        req.file
      );
  
      return res.json(
        webResponses.successResponse('Admin berhasil diperbarui', updatedAdmin)
      );
    } catch (error) {
      return this.handleError(error, res);
    }
  };


  updateProfilePicture = async (req, res) => {
    try {
      if (!req.file) {
        throw new ValidationError('Tidak ada foto profil yang diunggah');
      }
  
      const { adminId } = req.params;
      if (!adminId || isNaN(parseInt(adminId)) || parseInt(adminId) <= 0) {
        throw new ValidationError('ID admin tidak valid', [
          { field: 'id', message: 'ID admin harus berupa bilangan bulat positif' },
        ]);
      }
  
      const updatedAdmin = await adminService.updateAdmin(
        parseInt(adminId),
        {},
        req.file
      );
  
      return res.json(
        webResponses.successResponse('Foto profil berhasil diperbarui', updatedAdmin)
      );
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  deleteAdmin = async (req, res) => {
    try {
      const { adminId } = req.params;
      if (!adminId || isNaN(parseInt(adminId)) || parseInt(adminId) <= 0) {
        throw new ValidationError('ID admin tidak valid', [
          { field: 'id', message: 'ID admin harus berupa bilangan bulat positif' },
        ]);
      }
  
      if (req.user?.role !== 'SUPER_ADMIN') {
        throw new ValidationError('Hanya SUPER_ADMIN yang dapat menghapus admin');
      }
  
      await adminService.deleteAdmin(parseInt(adminId));
  
      return res.json(
        webResponses.successResponse('Admin berhasil dihapus')
      );
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  
  handleError(error, res) {
    console.error('Error details:', error);

    if (error instanceof ValidationError) {
      return res.status(400).json({
        meta: {
          success: false,
          message: error.message,
          errors: error.details || []
        }
      });
    }

    if (error.message.includes('SUPER_ADMIN')) {
      return res.status(403).json({
        meta: {
          success: false,
          message: error.message
        }
      });
    }

    if (error instanceof multer.MulterError) {
      return res.status(400).json({
        meta: {
          success: false,
          message: 'File upload error: ' + error.message
        }
      });
    }

    return res.status(500).json({
      meta: {
        success: false,
        message: 'Internal server error'
      }
    });
  }
}

module.exports = new AdminController();