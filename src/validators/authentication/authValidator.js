const userRegistrationValidation = {
    type: 'object',
    properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 6 },
        confirmPassword: { type: 'string', minLength: 6 },
        role: { type: 'string', enum: ['VISITOR', 'MEMBER', 'ADMIN', 'SUPER_ADMIN'], default: 'MEMBER' },
        userProfile: {
            type: 'object',
            properties: {
                fullName: { type: 'string' },
                phoneNumber: { type: 'string' },
                birthdate: { type: 'string', format: 'date-time' },
                socialMedia: { type: 'string' },
                address: { type: 'string' }
            },
            required: ['fullName', 'phoneNumber', 'birthdate', 'socialMedia', 'address']
        }
    },
    required: ['email', 'password', 'confirmPassword', 'userProfile'],
    additionalProperties: false
};

module.exports = {
    userRegistrationValidation
};
