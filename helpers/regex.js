const PHONE_NUMBER_REGEX = {
  regex: /^(?:[+](?:[0-9]{12}|[0-9]{11})|[0-9]{8,10})$/,
};
const EMAIL_REGEX = {
  regex: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
};

module.exports = { PHONE_NUMBER_REGEX, EMAIL_REGEX };
