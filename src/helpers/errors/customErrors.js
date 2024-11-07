// helpers/errors/customErrors.js
class ValidationError extends Error {
    constructor(message, details = null) {
      super(message);
      this.name = 'ValidationError';
      this.details = details;
    }
  }
  
  class AuthenticationError extends Error {
    constructor(message) {
      super(message);
      this.name = 'AuthenticationError';
    }
  }
  
  module.exports = {
    ValidationError,
    AuthenticationError
  };