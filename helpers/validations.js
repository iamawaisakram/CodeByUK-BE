const { EMAIL_REGEX } = require('./regex')

const registerFormValidation = ({
  firstName,
  lastName,
  email,
  password,
  address,
  town,
  postcode
}) => {
  if (!firstName) {
    return 'First Name is Required!'
  }
  if (!lastName) {
    return 'Last Name  is Required!'
  }
  if (!email) {
    return 'Email is Required!'
  }
  if (email) {
    let valid = EMAIL_REGEX.regex.test(email)
    if (!valid) return 'Invalid Email!'
  }
  if (!password) {
    return 'Password is Required!'
  }
  if (password && password.length < 6) {
    return 'Password can not be lesser then 6 characters!'
  }
  if (!address) {
    return 'Address is Required!'
  }
  if (!town) {
    return 'Town is Required!'
  }
  if (!postcode) {
    return 'Postal Code is Required!'
  }
}

const loginFormValidation = ({ email, password }) => {
  if (!email) {
    return 'Email is Required!'
  }
  if (email) {
    let valid = EMAIL_REGEX.regex.test(email)
    if (!valid) return 'Invalid Email!'
  }
  if (!password) {
    return 'Password is Required!'
  }
  if (password && password.length < 6) {
    return 'Password can not be lesser then 6 characters!'
  }
}

const logbookFormValidation = ({ value, logbookEntry }) => {
  if (!value) {
    return 'Value is Required!'
  }

  if (!logbookEntry) {
    return 'Log Book Entry is Required!'
  }
}

const reminderFormValidation = ({ time, routine, description }) => {
  if (!time) {
    return 'Time is Required!'
  }

  if (!routine) {
    return 'Routine/Date is Required!'
  }

  if (!description) {
    return 'Description is Required!'
  }
}

module.exports = {
  registerFormValidation,
  loginFormValidation,
  logbookFormValidation,
  reminderFormValidation
}
