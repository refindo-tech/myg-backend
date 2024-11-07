// authController.js
const webResponses = require('../../helpers/web/webResponses');
const authService = require('../../services/authentication/authServices');
const { userRegistrationValidation, loginValidation } = require('../../validators/authentication/authValidator');
const { ValidationError, AuthenticationError } = require('../../helpers/errors/customErrors');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

class AuthController {
  constructor() {
    this.ajv = new Ajv();
    addFormats(this.ajv);
  }

  login = async (req, res) => {
    try {
      const { email, password, type = 'user' } = req.body;

      // Validate input
      if (!email || !password) {
        throw new ValidationError(
          'Email dan password harus diisi',
          null,
          'MISSING_CREDENTIALS'
        );
      }

      // Validate type
      if (!['user', 'admin'].includes(type)) {
        throw new ValidationError(
          'Tipe akun tidak valid',
          null,
          'INVALID_ACCOUNT_TYPE'
        );
      }

      const { accessToken, refreshToken, account, accountType } = 
        await authService.login(email, password, type);

      await authService.deleteExpiredRefreshTokens();

      this.#setRefreshTokenCookie(res, refreshToken);

      return res.status(200).json(
        webResponses.successResponse(
          'Login berhasil', 
          { 
            accessToken, 
            account,
            accountType
          }
        )
      );
    } catch (error) {
      this.#handleError(res, error);
    }
  };


  registerUser = async (req, res) => {
    try {
      const validate = this.ajv.compile(userRegistrationValidation);
      if (!validate(req.body)) {
        throw new ValidationError('Invalid input', validate.errors);
      }

      const { email, password, confirmPassword, userProfile, role = 'MEMBER' } = req.body;

      if (password !== confirmPassword) {
        throw new ValidationError('Passwords do not match');
      }

      const newUser = await authService.registerUser(email, password, userProfile, role);
      return res.status(201).json(webResponses.successResponse('User registered successfully', newUser));
    } catch (error) {
      this.#handleError(res, error);
    }
  };

  refreshAccessToken = async (req, res) => {
    try {
      const oldRefreshToken = req.cookies.refreshToken;
      
      // Tambahkan logging
      console.log('Cookies received:', req.cookies);
      console.log('Refresh token from cookies:', oldRefreshToken);
      
      if (!oldRefreshToken) {
        throw new AuthenticationError(
          'Refresh token tidak ditemukan dalam cookies',
          'REFRESH_TOKEN_MISSING'
        );
      }
  
      const { accessToken, refreshToken, tokenType } = 
        await authService.refreshAccessToken(oldRefreshToken);
      
      this.#setRefreshTokenCookie(res, refreshToken);
  
      return res.status(200).json(
        webResponses.successResponse(
          'Token berhasil diperbarui', 
          { 
            accessToken,
            tokenType
          }
        )
      );
    } catch (error) {
      // Log error untuk debugging
      console.error('Refresh token error:', {
        error: error.message,
        type: error.type,
        stack: error.stack
      });

      // Clear refresh token cookie jika terjadi error
      res.clearCookie('refreshToken');
      
      this.#handleError(res, error);
    }
  };
  
  logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        console.log('Refresh Token:', refreshToken); // Tambahkan logging
        
        if (!refreshToken) {
            throw new AuthenticationError('No refresh token provided');
        }

        await authService.logout(refreshToken);
        res.clearCookie('refreshToken');
        return res.status(200).json(webResponses.successResponse('User logged out successfully'));
    } catch (error) {
        console.error('Logout error:', error); // Tambahkan logging
        this.#handleError(res, error);
    }
  };

  getProfile = async (req, res) => {
    try {
      // Ambil userId dari token yang sudah di-decode oleh middleware
      const userId = req.user?.id;
      
      if (!userId) {
        throw new AuthenticationError(
          'User ID tidak ditemukan',
          'USER_ID_MISSING'
        );
      }

      const user = await authService.getUserProfile(userId);
      const profileData = this.#formatUserProfile(user);
      
      return res.status(200).json(
        webResponses.successResponse(
          'Profil user berhasil diambil', 
          profileData
        )
      );
    } catch (error) {
      this.#handleError(res, error);
    }
  };

  // Perbaikan method formatUserProfile
  #formatUserProfile(user) {
    if (!user) return null;

    const profile = user.userProfiles[0] || {};
    
    return {
      userId: user.userId,
      email: user.email,
      userLabel: user.userLabel,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      profile: {
        fullName: profile.fullName || null,
        profilePicture: profile.profilePicture || null,
        phoneNumber: profile.phoneNumber || null,
        address: profile.address || null,
        birthdate: profile.birthdate || null,
        studioName: profile.studioName || null,
        ktpPicture: profile.ktpPicture || null,
        studioLogo: profile.studioLogo || null
      }
    };
  }

  #setRefreshTokenCookie(res, refreshToken) {
    const isProduction = process.env.NODE_ENV === 'production';
    
    // Tambahkan logging
    console.log('Setting cookie with config:', {
      isProduction,
      secure: isProduction || process.env.NODE_ENV === 'development',
      sameSite: isProduction ? 'none' : 'lax'
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction || process.env.NODE_ENV === 'development',
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/' // Tambahkan ini
    });
  }


  #handleError(res, error) {
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      type: error.type,
      details: error.details
    });
    
    if (error instanceof ValidationError) {
      return res.status(400).json(
        webResponses.errorResponse(
          error.message,
          {
            type: error.type || 'VALIDATION_ERROR',
            details: error.details
          }
        )
      );
    }
    
    if (error instanceof AuthenticationError) {
      const statusCode = [
        'REFRESH_TOKEN_EXPIRED',
        'INVALID_REFRESH_TOKEN',
        'TOKEN_REUSE_DETECTED'
      ].includes(error.type) ? 403 : 401;

      return res.status(statusCode).json(
        webResponses.errorResponse(
          error.message,
          {
            type: error.type || 'AUTHENTICATION_ERROR'
          }
        )
      );
    }
    
    return res.status(500).json(
      webResponses.errorResponse(
        'Terjadi kesalahan pada server. Silakan coba lagi nanti.',
        {
          type: 'INTERNAL_SERVER_ERROR'
        }
      )
    );
  }
}

module.exports = new AuthController();