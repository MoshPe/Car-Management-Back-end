require('console-stamp')(console, {
  format: ':date(yyyy/mm/dd HH:MM:ss.l) :label',
});

const dbs = require('../database/mongodb');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const login = async (req, res) => {
  const { authenticated } = req.session;
  let { email, password } = req.body;
  if (!email || !password) {
    return res.status(404).json({
      success: false,
      message: 'You must provide a user credentials',
    });
  }

  if (!authenticated) {
    req.session.authenticated = true;

    const isExist = await dbs.usersCollection.findOne({
      email: email,
    });

    if (!isExist) {
      return res.status(404).json({
        success: false,
        message: `User doesn't exist`,
      });
    }

    bcrypt.compare(password, isExist.password, function (err, result) {
      if (result) res.send('Successfully authenticated');
      else res.send('Password incorrect');
    });
  } else {
    res.send('Already authenticated');
  }
};

const logout = (req, res) => {
  req.session.destroy(() => {
    res.send('Successfully logged out');
  });
};

const forgetPassword = async (req, res) => {};

const signup = async (req, res) => {
  const user = req.body;

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'You must provide a treatment',
    });
  }
  await bcrypt.hash(user.password, saltRounds, function (hash) {
    user.password = hash;
  });

  const isExist = await dbs.usersCollection.findOne({
    email: user.email,
  });

  if (isExist) {
    return res.status(404).json({
      success: false,
      message: 'User already exist',
    });
  }

  dbs.usersCollection
    .insertOne(user)
    .then((result) => {
      return res.status(201).json({
        success: true,
        message: 'A new treatment has been registered',
        result,
      });
    })
    .catch((e) => {
      return res.status(201).json({
        success: false,
        message: `Couldn't insert new treatment`,
        user: user,
        e,
      });
    });
};

module.exports = {
  signup,
  login,
  logout,
  forgetPassword,
};
