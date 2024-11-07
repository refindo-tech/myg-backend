const adminValidation = {
  adminRegistrationSchema: {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 3 },
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 6 },
      confirmPassword: { type: 'string', minLength: 6 },
      role: { 
        type: 'string', 
        enum: ['ADMIN', 'SUPER_ADMIN'],
        default: 'ADMIN'
      },
      userLabel: { 
        type: 'string', 
        enum: ['MYA', 'MY_ACADEMI', 'MY_BEAUTICA']
      }
    },
    required: ['name', 'email', 'password', 'confirmPassword'],
    additionalProperties: false
  },

  adminUpdateSchema: {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 3 },
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 6 },
      confirmPassword: { type: 'string', minLength: 6 },
      role: { type: 'string', enum: ['ADMIN', 'SUPER_ADMIN'] },
      userLabel: { type: 'string', enum: ['MYA', 'MY_ACADEMI', 'MY_BEAUTICA'] }
    },
    additionalProperties: false
  }
};

module.exports = adminValidation;