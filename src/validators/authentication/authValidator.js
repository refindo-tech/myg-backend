// validators/authentication/authValidator.js
const userRegistrationValidation = {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        format: 'email',
        minLength: 5,
        maxLength: 255
      },
      password: {
        type: 'string',
        minLength: 8,
        maxLength: 255
      },
      confirmPassword: {
        type: 'string',
        minLength: 8,
        maxLength: 255
      },
      userProfile: {
        type: 'object',
        properties: {
          fullName: {
            type: 'string',
            minLength: 2,
            maxLength: 255
          },
          phoneNumber: {
            type: 'string',
            minLength: 6,
            maxLength: 20
          },
          birthdate: {
            type: 'string',
            format: 'date'
          },
          socialMedia: {
            type: 'string',
            nullable: true
          },
          address: {
            type: 'string',
            nullable: true
          },
          profilePicture: {
            type: 'string',
            nullable: true
          },
          studioName: {
            type: 'string',
            nullable: true
          },
          ktpPicture: {
            type: 'string',
            nullable: true
          },
          studioLogo: {
            type: 'string',
            nullable: true
          }
        },
        required: ['fullName', 'phoneNumber', 'birthdate', 'socialMedia']
      },
      role: {
        type: 'string',
        enum: ['MEMBER', 'ADMIN'],
        default: 'MEMBER'
      }
    },
    required: ['email', 'password', 'confirmPassword', 'userProfile'],
    additionalProperties: false
  };

  const loginValidation = {
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 6 },
      type: { type: 'string', enum: ['user', 'admin'] }
    },
    required: ['email', 'password'],
    additionalProperties: false
  };
  
  module.exports = {
    userRegistrationValidation,
    loginValidation
  };