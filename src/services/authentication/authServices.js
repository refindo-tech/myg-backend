// authService.js
const { database } = require('../../helpers/config/db');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { AuthenticationError, ValidationError } = require('../../helpers/errors/customErrors');

class AuthService {
  constructor() {
    this.tokenExpiry = {
      access: '15m',
      refresh: '7d'
    };
  }

  async #generateTokens(account, type = 'user') {
    const payload = {
      id: type === 'user' ? account.userId : account.adminId,
      email: account.email,
      role: account.role,
      type
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { 
      expiresIn: this.tokenExpiry.access 
    });
    
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { 
      expiresIn: this.tokenExpiry.refresh 
    });

    // Tambahkan family ID untuk mengelompokkan refresh tokens
    const familyId = crypto.randomUUID();

    // Menyimpan refresh token dengan family ID
    await this.#storeRefreshToken(refreshToken, payload.id, type, familyId);

    return { accessToken, refreshToken };
  }

  async #storeRefreshToken(token, id, type, familyId) {
    try {
      // Cek dan hapus token yang sama jika ada
      await database.refreshToken.deleteMany({
        where: {
          token: token
        }
      });
      
      // Kemudian buat token baru
      return await database.refreshToken.create({
        data: {
          token,
          familyId,
          isUsed: false,
          ...(type === 'user' ? { userId: id } : { adminId: id }),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
    } catch (error) {
      console.error('Error storing refresh token:', error);
      throw new AuthenticationError(
        'Gagal menyimpan refresh token',
        'STORE_TOKEN_ERROR'
      );
    }
  }

  
  // Tambahkan juga cleanup untuk token lama
  async cleanupOldTokens(userId, type = 'user') {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    await database.refreshToken.deleteMany({
      where: {
        ...(type === 'user' ? { userId } : { adminId: userId }),
        OR: [
          { isUsed: true },
          { createdAt: { lt: oneWeekAgo } }
        ]
      }
    });
  }
  
  async login(email, password, type = 'user') {
    let account;
    let accountFound = false;
    
    try {
      // Cari di tabel admin terlebih dahulu
      if (type === 'user') {
        // Cek di tabel admin dulu
        account = await database.admin.findUnique({ 
          where: { email }
        });

        // Jika tidak ditemukan di admin, cari di tabel user
        if (!account) {
          account = await database.user.findUnique({ 
            where: { email },
            include: {
              userProfiles: {
                select: {
                  fullName: true,
                  profilePicture: true
                }
              }
            }
          });
          
          if (account) {
            accountFound = true;
            type = 'user';
          }
        } else {
          accountFound = true;
          type = 'admin';
        }
      } else {
        // Jika type explicitly 'admin', hanya cari di tabel admin
        account = await database.admin.findUnique({ 
          where: { email }
        });
        if (account) accountFound = true;
      }

      if (!accountFound) {
        throw new AuthenticationError(
          'Email tidak terdaftar. Silakan periksa kembali email Anda atau daftar jika belum memiliki akun.',
          'EMAIL_NOT_FOUND'
        );
      }

      try {
        await this.#validatePassword(password, account.password);
      } catch (error) {
        throw new AuthenticationError(
          'Password yang Anda masukkan salah. Silakan coba lagi.',
          'INVALID_PASSWORD'
        );
      }

      const tokens = await this.#generateTokens(account, type);

      const formattedAccount = type === 'user' ? 
        this.#formatUserResponse(account) : 
        this.#formatAdminResponse(account);

      return { 
        ...tokens, 
        account: formattedAccount,
        accountType: type 
      };
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error;
      }
      throw new AuthenticationError(
        'Terjadi kesalahan saat proses login. Silakan coba lagi.',
        'LOGIN_FAILED'
      );
    }
  }

  async #validatePassword(password, hashedPassword) {
    const isValid = await argon2.verify(hashedPassword, password);
    if (!isValid) {
      throw new AuthenticationError(
        'Password yang Anda masukkan salah. Silakan coba lagi.',
        'INVALID_PASSWORD'
      );
    }
  }

  #formatUserResponse(user) {
    return {
      id: user.userId,
      email: user.email,
      role: user.role,
      userLabel: user.userLabel,
      profile: user.userProfiles[0] ? {
        fullName: user.userProfiles[0].fullName,
        profilePicture: user.userProfiles[0].profilePicture
      } : null
    };
  }

  #formatAdminResponse(admin) {
    return {
      id: admin.adminId,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      userLabel: admin.userLabel,
      profilePicture: admin.profilePicture
    };
  }



  async refreshAccessToken(oldRefreshToken) {
    let decoded;
    let currentToken;
    
    try {
      // Step 1: Validasi token format
      if (!oldRefreshToken) {
        throw new AuthenticationError(
          'Refresh token tidak ditemukan',
          'REFRESH_TOKEN_MISSING'
        );
      }

      // Step 2: Decode dan verifikasi token
      try {
        decoded = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET);
        console.log('Decoded token:', { ...decoded, exp: new Date(decoded.exp * 1000) });
      } catch (error) {
        console.error('JWT Verification error:', error);
        
        if (error instanceof jwt.TokenExpiredError) {
          throw new AuthenticationError(
            'Refresh token telah kadaluarsa. Silakan login kembali.',
            'REFRESH_TOKEN_EXPIRED'
          );
        }
        throw new AuthenticationError(
          'Refresh token tidak valid. Silakan login kembali.',
          'INVALID_REFRESH_TOKEN'
        );
      }

      // Step 3: Cari token di database
      try {
        currentToken = await database.refreshToken.findUnique({ 
          where: { token: oldRefreshToken },
          include: {
            user: {
              select: {
                userId: true,
                email: true,
                role: true,
                userLabel: true
              }
            },
            admin: {
              select: {
                adminId: true,
                email: true,
                role: true,
                userLabel: true
              }
            }
          }
        });
        
        console.log('Database token found:', {
          tokenId: currentToken?.id,
          userId: currentToken?.userId,
          adminId: currentToken?.adminId,
          isUsed: currentToken?.isUsed
        });
      } catch (error) {
        console.error('Database query error:', error);
        throw new AuthenticationError(
          'Kesalahan saat memverifikasi token di database',
          'DATABASE_ERROR'
        );
      }

      // Step 4: Validasi token dari database
      if (!currentToken) {
        throw new AuthenticationError(
          'Refresh token tidak ditemukan di database. Silakan login kembali.',
          'REFRESH_TOKEN_NOT_FOUND'
        );
      }

      // Step 5: Cek token reuse
      if (currentToken.isUsed) {
        await this.revokeTokenFamily(currentToken.familyId);
        throw new AuthenticationError(
          'Terdeteksi masalah keamanan. Silakan login kembali untuk keamanan akun Anda.',
          'TOKEN_REUSE_DETECTED'
        );
      }

      // Step 6: Validasi data user/admin
      const account = decoded.type === 'user' ? currentToken.user : currentToken.admin;
      
      if (!account) {
        console.error('Account not found:', { 
          type: decoded.type, 
          userId: currentToken.userId, 
          adminId: currentToken.adminId 
        });
        throw new AuthenticationError(
          'Akun tidak ditemukan. Silakan login kembali.',
          'ACCOUNT_NOT_FOUND'
        );
      }

      // Step 7: Tandai token lama sebagai used
      try {
        await database.refreshToken.update({
          where: { id: currentToken.id },
          data: { isUsed: true }
        });
      } catch (error) {
        console.error('Error updating token status:', error);
        throw new AuthenticationError(
          'Kesalahan saat memperbarui status token',
          'TOKEN_UPDATE_ERROR'
        );
      }

      try {
        // Sebelum generate token baru, bersihkan token lama
        await this.cleanupOldTokens(decoded.id, decoded.type);
        
        // Generate token baru
        const tokens = await this.#generateTokens(account, decoded.type);
        return { 
          accessToken: tokens.accessToken, 
          refreshToken: tokens.refreshToken,
          tokenType: 'Bearer'
        };
      } catch (error) {
        console.error('Token generation error:', error);
        throw new AuthenticationError(
          'Kesalahan saat membuat token baru',
          'TOKEN_GENERATION_ERROR'
        );
      }

    } catch (error) {
      // Log semua informasi yang relevan untuk debugging
      console.error('Refresh token complete error:', {
        error: error.message,
        type: error.type,
        stack: error.stack,
        decodedToken: decoded,
        currentToken: currentToken ? {
          id: currentToken.id,
          userId: currentToken.userId,
          adminId: currentToken.adminId,
          isUsed: currentToken.isUsed
        } : null
      });

      // Re-throw error dengan informasi yang lebih spesifik
      if (error instanceof AuthenticationError) {
        throw error;
      }
      
      throw new AuthenticationError(
        'Terjadi kesalahan saat memperbarui token. Silakan login kembali.',
        'REFRESH_TOKEN_FAILED'
      );
    }
  }
  
  async revokeTokenFamily(familyId) {
    await database.refreshToken.updateMany({
      where: { familyId },
      data: { isUsed: true }
    });
  }

  async registerUser(email, password = '', userProfile, role = 'MEMBER', userLabel = 'MYA') {
    try {
      const hashedPassword = password ? await argon2.hash(password) : '';
      
      return await database.user.create({
        data: {
          email,
          password: hashedPassword,
          userLabel,
          role,
          createdAt: new Date(),
          updatedAt: new Date(),
          userProfiles: {
            create: {
              ...userProfile,
              birthdate: new Date(userProfile.birthdate),
              profilePicture: userProfile.profilePicture || null,
              studioName: userProfile.studioName || null,
              ktpPicture: userProfile.ktpPicture || null,
              studioLogo: userProfile.studioLogo || null,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          }
        },
        include: {
          userProfiles: true
        }
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ValidationError('Email already exists');
      }
      throw error;
    }
  }

  async logout(refreshToken) {
    try {
      const token = await database.refreshToken.findUnique({
        where: { token: refreshToken }
      });

      if (!token) {
        throw new AuthenticationError('Invalid refresh token');
      }

      await this.revokeTokenFamily(token.familyId);
    } catch (error) {
      // Lebih spesifik dalam handling error
      if (error.name === 'PrismaClientKnownRequestError') {
        throw new Error('Database error occurred during logout');
      }
      throw error; // Throw error asli untuk kasus lain
    }
  }

  async getUserProfile(userId) {
    // Validasi input
    if (!userId || isNaN(parseInt(userId))) {
      throw new ValidationError('Invalid user ID', null, 'INVALID_USER_ID');
    }

    try {
      const user = await database.user.findUnique({
        where: { 
          userId: parseInt(userId) // Menggunakan userId sesuai schema
        },
        include: {
          userProfiles: {
            select: {
              profilePicture: true,
              fullName: true,
              phoneNumber: true,
              address: true,
              birthdate: true,
              studioName: true,
              ktpPicture: true,
              studioLogo: true
            }
          }
        }
      });

      if (!user) {
        throw new AuthenticationError(
          'User tidak ditemukan',
          'USER_NOT_FOUND'
        );
      }

      return user;
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error;
      }
      
      console.error('Get user profile error:', error);
      throw new Error('Gagal mengambil profil pengguna');
    }
  }
  
  async deleteExpiredRefreshTokens() {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() - 7);

    await database.refreshToken.deleteMany({
      where: {
        createdAt: {
          lt: expiryDate
        }
      }
    });
  }
}

module.exports = new AuthService();