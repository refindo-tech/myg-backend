const userValidationSchema = {
    type: 'object',
    properties: {
        full_name: { type: 'string', nullable: true },
        address: { type: 'string', nullable: true },
        phone_number: { type: 'string', nullable: true },
        profile_picture: { type: 'string', nullable: true },
        birthdate: { type: 'string', format: 'date-time', nullable: true },
        email: { type: 'string', format: 'email' },
        password: { type: 'string' },
        user_label: { type: 'string', enum: ['SahabatMyAcademi', 'Retail', 'Agent', 'Distributor'] },
        role: { type: 'string', enum: ['visitor', 'member', 'admin', 'super_admin'] },
    },
    required: ['email', 'password', 'user_label', 'role'],
    additionalProperties: false,
};

module.exports = {
    userValidationSchema,
};
