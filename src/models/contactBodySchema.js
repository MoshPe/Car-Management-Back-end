const userSchema = {
  type: 'object',
  required: ['name', 'email', 'subject', 'body'],
  properties: {
    name: {
      type: 'string',
      minLength: 1,
    },
    email: {
      type: 'string',
      minLength: 1,
    },
    subject: {
      type: 'string',
    },
    body: {
      type: 'string',
    },
  },
};

module.exports = userSchema;
