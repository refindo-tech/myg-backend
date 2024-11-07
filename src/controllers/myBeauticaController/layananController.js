const layananService = require('../../services/myBeauticaServices/layananServices');
const webResponses = require('../../helpers/web/webResponses');
const { ValidationError } = require('../../helpers/errors/customErrors');
const { createLayananSchema, updateLayananSchema } = require('../../validators/myBeauticaValidator/layananValidator');
const { layananUpload } = require('../../middlewares/uploadMiddleware');
const Ajv = require('ajv');
const multer = require('multer');

class LayananController {
  constructor() {
    this.ajv = new Ajv({
      allErrors: true,
      removeAdditional: true,
      useDefaults: true,
      coerceTypes: true
    });

    // Kompilasi schema untuk validasi
    this.validateCreate = this.ajv.compile(createLayananSchema);
    this.validateUpdate = this.ajv.compile(updateLayananSchema);
  }

  getAllLayanan = async (req, res) => {
    try {
      const layanan = await layananService.getAllLayanan();
      return res.status(200).json(
        webResponses.successResponse('Layanan retrieved successfully', layanan)
      );
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  getLayananById = async (req, res) => {
    try {
      const { id } = req.params;
      const layanan = await layananService.getLayananById(Number(id));
      
      if (!layanan) {
        throw new ValidationError('Layanan tidak ditemukan');
      }

      return res.status(200).json(
        webResponses.successResponse('Layanan retrieved successfully', layanan)
      );
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  createLayanan = async (req, res) => {
    try {
      console.log('Request body:', req.body);
      console.log('Uploaded file:', req.file);

      // Validate request body
      const data = {
        ...req.body,
        price: Number(req.body.price),
        viewCount: Number(req.body.viewCount) || 0
      };

      const isValid = this.validateCreate(data);
      if (!isValid) {
        const errors = this.validateCreate.errors.map(err => ({
          field: err.instancePath.substring(1) || err.params.missingProperty,
          message: err.message
        }));
        throw new ValidationError('Validation failed', errors);
      }

      // Add image path if file was uploaded
      if (req.file) {
        data.imageUrl = req.file.path;
      }

      const layanan = await layananService.createLayanan(data);

      return res.status(201).json(
        webResponses.successResponse('Layanan created successfully', layanan)
      );
    } catch (error) {
      // Clean up uploaded file if there's an error
      if (req.file) {
        await layananUpload.deleteFile(req.file.path);
      }
      return this.handleError(error, res);
    }
  };

  updateLayanan = async (req, res) => {
    try {
      const { id } = req.params;
      console.log('Updating layanan:', id);
      console.log('Request body:', req.body);
      console.log('Uploaded file:', req.file);

      // Get existing layanan
      const existingLayanan = await layananService.getLayananById(Number(id));
      if (!existingLayanan) {
        throw new ValidationError('Layanan tidak ditemukan');
      }

      // Prepare update data
      const data = {
        ...req.body,
        price: req.body.price ? Number(req.body.price) : undefined,
        viewCount: req.body.viewCount ? Number(req.body.viewCount) : undefined
      };

      // Validate update data
      const isValid = this.validateUpdate(data);
      if (!isValid) {
        const errors = this.validateUpdate.errors.map(err => ({
          field: err.instancePath.substring(1) || err.params.missingProperty,
          message: err.message
        }));
        throw new ValidationError('Validation failed', errors);
      }

      // Handle file update
      if (req.file) {
        // Delete old image if exists
        if (existingLayanan.imageUrl) {
          await layananUpload.deleteFile(existingLayanan.imageUrl);
        }
        data.imageUrl = req.file.path;
      }

      const updatedLayanan = await layananService.updateLayanan(Number(id), data);

      return res.status(200).json(
        webResponses.successResponse('Layanan updated successfully', updatedLayanan)
      );
    } catch (error) {
      // Clean up uploaded file if there's an error
      if (req.file) {
        await layananUpload.deleteFile(req.file.path);
      }
      return this.handleError(error, res);
    }
  };

  deleteLayanan = async (req, res) => {
    try {
      const { id } = req.params;
      
      // Get layanan first to get image path
      const layanan = await layananService.getLayananById(Number(id));
      if (!layanan) {
        throw new ValidationError('Layanan tidak ditemukan');
      }

      // Delete the layanan
      await layananService.deleteLayanan(Number(id));

      // Delete associated image if exists
      if (layanan.imageUrl) {
        await layananUpload.deleteFile(layanan.imageUrl);
      }

      return res.status(200).json(
        webResponses.successResponse('Layanan deleted successfully', { id })
      );
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  handleError(error, res) {
    console.error('Error details:', error);

    if (error instanceof ValidationError) {
      return res.status(400).json(
        webResponses.errorResponse(error.message, error.details)
      );
    }

    if (error instanceof multer.MulterError) {
      return res.status(400).json(
        webResponses.errorResponse('File upload error: ' + error.message)
      );
    }

    return res.status(500).json(
      webResponses.errorResponse('Internal server error')
    );
  }
}

// Export instance of controller
module.exports = new LayananController();