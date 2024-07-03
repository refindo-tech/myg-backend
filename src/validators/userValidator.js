const userRegistrationSchema = {
    type: 'object',
    properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 6 },
        confirmPassword: { type: 'string', minLength: 6 },
        userLabel: { type: 'string', enum: ['SAHABAT_MY_ACADEMI', 'RETAIL', 'AGENT', 'DISTRIBUTOR'] },
        role: { type: 'string', enum: ['VISITOR', 'MEMBER', 'ADMIN', 'SUPER_ADMIN'] }
    },
    required: ['email', 'password', 'confirmPassword', 'userLabel', 'role'],
    additionalProperties: false
};

module.exports = {
    userRegistrationSchema,
};
