const passwordValidator = (password) => {
  const minLength = 8;
  const maxLength = 64;
  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!password || password.length < minLength || password.length > maxLength) {
    return { valid: false, message: "Password must be between 8 and 64 characters long." };
  }

  if (!regex.test(password)) {
    return { valid: false, message: "Password must include at least one letter, one number, and one special character." };
  }

  return { valid: true };
};

module.exports = passwordValidator;
