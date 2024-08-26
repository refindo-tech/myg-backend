const webResponses = require('../../helpers/web/webResponses');
const authService = require('../../services/authentication/authServices');
const { userRegistrationValidation } = require('../../validators/authentication/authValidator');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const ajv = new Ajv();
addFormats(ajv);

async function registerUser(req, res) {
  console.log('Request Body:', req.body);

  const validate = ajv.compile(userRegistrationValidation);
  const valid = validate(req.body);

  if (!valid) {
      return res.status(400).json({
          status: 'error',
          message: 'Invalid input',
          errorType: 'VALIDATION_ERROR',
          errors: validate.errors
      });
  }

  const { email, password, confirmPassword, userProfile, role = 'MEMBER' } = req.body;

  if (password !== confirmPassword) {
      return res.status(400).json({
          status: 'error',
          message: 'Passwords do not match',
          errorType: 'PASSWORD_MISMATCH'
      });
  }

  try {
      const newUser = await authService.registerUser(email, password, userProfile, role);
      res.status(201).json({
          status: 'success',
          message: 'User registered successfully',
          data: newUser
      });
  } catch (error) {
      console.error(error);

      if (error.code === 'P2002' && error.meta && error.meta.target === 'User_email_key') {
          return res.status(400).json({
              status: 'error',
              message: 'Email is already in use',
              errorType: 'EMAIL_DUPLICATE'
          });
      }

      res.status(500).json({
          status: 'error',
          message: 'Failed to register user',
          errorType: 'INTERNAL_ERROR',
          error: error.message
      });
  }
}

async function loginUser(req, res) {
    const { email, password } = req.body;
    try {
        const { accessToken, refreshToken, user } = await authService.loginUser(email, password);

        // Hapus token refresh kadalwarsa setelah login berhasil
        await authService.deleteExpiredRefreshTokens();

        // Send refresh token as HTTP-only cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json(webResponses.successResponse('User logged in successfully', { accessToken, user }));
    } catch (error) {
        console.error(error);
        let statusCode = 400;

        if (error.message === 'User not found') {
            statusCode = 404;
        } else if (error.message === 'Invalid password') {
          statusCode = 401;
        }

        res.status(statusCode).json({
            status: 'error',
            message: error.message
        });
    }
}

async function refreshAccessToken(req, res) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json(webResponses.errorResponse('No refresh token provided'));
    }

    try {
        const newAccessToken = await authService.refreshAccessToken(refreshToken);

        //hapus token refresh yang sudah kadaluwarsa setelah refresh token berhasil di perbarui
        await authService.deleteExpiredRefreshTokens();

        res.status(200).json(webResponses.successResponse('Access token refreshed successfully', { accessToken: newAccessToken }));
    } catch (error) {
        console.error(error);
        res.status(401).json(webResponses.errorResponse('Invalid refresh token'));
    }
}

async function logoutUser(req, res) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json(webResponses.errorResponse('No refresh token provided'));
    }

    try {
        await authService.logoutUser(refreshToken);
        res.clearCookie('refreshToken');
        res.status(200).json(webResponses.successResponse('User logged out successfully'));
    } catch (error) {
        console.error(error);
        res.status(400).json(webResponses.errorResponse('Failed to logout user'));
    }
}

async function getProfile(req, res) {
    try {
        const userId = req.user.userId;
        const user = await authService.getUserProfile(userId);

        const result = {
            userId: user.userId,
            email: user.email,
            userLabel: user.userLabel,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            profilePicture: user.userProfiles[0]?.profilePicture || null,
            fullName: user.userProfiles[0]?.fullName || 'Unknown',
        };

        res.status(200).json(webResponses.successResponse('User profile fetched successfully', result));
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to fetch user profile'));
    }
}

module.exports = {
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser,
    getProfile
};