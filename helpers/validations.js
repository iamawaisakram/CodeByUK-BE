const { EMAIL_REGEX } = require('./regex');

const registerFormValidation = ({ firstName, lastName, email, password }) => {
  if (!firstName) {
    return 'First Name is Required!';
  }
  if (!lastName) {
    return 'Last Name  is Required!';
  }
  if (!email) {
    return 'Email is Required!';
  }
  if (email) {
    let valid = EMAIL_REGEX.regex.test(email);
    if (!valid) return 'Invalid Email!';
  }
  if (!password) {
    return 'Password is Required!';
  }
  if (password && password.length < 6) {
    return 'Password can not be lesser then 6 characters!';
  }
};

const loginFormValidation = ({ email, password }) => {
  if (!email) {
    return 'Email is Required!';
  }
  if (email) {
    let valid = EMAIL_REGEX.regex.test(email);
    if (!valid) return 'Invalid Email!';
  }
  if (!password) {
    return 'Password is Required!';
  }
  if (password && password.length < 6) {
    return 'Password can not be lesser then 6 characters!';
  }
};

const logbookFormValidation = ({ value, logbookEntry }) => {
  if (!value) {
    return 'Value is Required!';
  }

  if (!logbookEntry) {
    return 'Log Book Entry is Required!';
  }
};

const reminderFormValidation = ({ time, routine, description }) => {
  if (!time) {
    return 'Time is Required!';
  }

  if (!routine) {
    return 'Routine/Date is Required!';
  }

  if (!description) {
    return 'Description is Required!';
  }
};

module.exports = {
  registerFormValidation,
  loginFormValidation,
  logbookFormValidation,
  reminderFormValidation,
};
