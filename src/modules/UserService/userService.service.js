require('console-stamp')(console, {
  format: ':date(yyyy/mm/dd HH:MM:ss.l) :label',
});

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');
const crypto = require('crypto');
const sendEmail = require('../mail/transporter');
const forgetPassHtml = require('./forgetPassHTML');
const axios = require('axios');

const login = async (req, res) => {
  let { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'You must provide a user credentials',
    });
  }

  const foundUser = await User.findOne({
    email: email,
  }).exec();

  if (!foundUser) {
    return res.status(401).json({
      success: false,
      message: `User doesn't exist`,
    });
  }
  const result = await bcrypt.compareSync(password, foundUser.password);
  if (result) {
    const accessToken = jwt.sign(
      {
        UserInfo: {
          email: foundUser.email,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '5m' }
    );
    const refreshToken = jwt.sign(
      { email: foundUser.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();

    // console.log(result);

    //Expire in one day in ms
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000,
    });

    delete foundUser.refreshToken;

    res.status(200).json({
      success: true,
      message: 'Successfully authenticated',
      foundUser,
      accessToken,
    });
  } else
    res.status(401).json({
      success: false,
      message: `Password Incorrect`,
    });
};

const recapcha = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'You must provide a user token score',
    });
  }

  const response = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify`,
    {
      params: {
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: token,
      },
    }
  );

  if (response.status === 200) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
};

const logout = async (req, res) => {
  const cookies = req.cookies;
  debugger;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    return res.status(204).json({
      success: true,
      message: 'Successfully logged out',
    });
  }

  foundUser.refreshToken = 'NO_TOKEN';
  const result = await foundUser.save();

  console.log(result);

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  res.status(204).json({
    success: true,
    message: 'Successfully logged out',
  });
};

const forgetPassword = async (req, res) => {
  let { email } = req.body;
  if (!email) {
    return res.status(404).json({
      success: false,
      message: 'You must provide a user email',
    });
  }

  const foundUser = await User.findOne({
    email: email,
  }).exec();

  if (!foundUser) {
    return res.status(404).json({
      success: false,
      message: `User doesn't exist`,
    });
  }

  const resetPass = jwt.sign(
    {
      UserInfo: {
        email: foundUser.email,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '5m' }
  );
  foundUser.password = crypto.randomBytes(32).toString('hex');
  foundUser.password = await bcrypt.hash(foundUser.password, 10);
  const result = await foundUser.save();

  console.log(result);

  const mailOptions = {
    from: {
      name: `Car-Management Service - Reset password`,
      address: process.env.SMTP_USERNAME,
    },
    to: email,
    subject: 'Reset Password',
    html: forgetPassHtml(resetPass),
  };

  await sendEmail(mailOptions);

  return res.sendStatus(200);
};

const resetPassword = async (req, res) => {
  const token = req.params.token;
  const { password } = req.body;

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err)
      return res.status(403).json({
        success: false,
        message: `Invalid Token`,
      }); //invalid token
    const email = decoded.UserInfo.email;
    const foundUser = await User.findOne({
      email: email,
    }).exec();

    if (!foundUser) {
      return res.status(404).json({
        success: false,
        message: `User doesn't exist`,
      });
    }

    foundUser.password = await bcrypt.hash(password, 10);
    const result = await foundUser.save();

    console.log(result);
    return res.sendStatus(200);
  });
};

const signup = async (req, res) => {
  const user = req.body;

  if (!user || Object.keys(user).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'You must provide a user',
    });
  }

  const isExist = await User.findOne({
    email: user.email,
  }).exec();

  if (isExist) {
    return res.status(409).json({
      success: false,
      message: 'User already exist',
    });
  }

  user.password = await bcrypt.hash(user.password, 10);

  try {
    const result = await User.create(user);
    return res.status(201).json({
      success: true,
      message: `A new user ${user.email} has been signed up`,
      result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Couldn't sign up new user`,
      user: user,
      error,
    });
  }
};

const contactUs = async (req, res) => {
  const contactInfo = req.body;
  if (!contactInfo) {
    return res.status(400).json({
      success: false,
      message: 'You must provide contact info',
    });
  }
  const email = contactInfo.email;

  const mailOptions = {
    from: {
      name: `Contact us - from ${email}`,
      address: process.env.SMTP_USERNAME,
    },
    to: process.env.SMTP_USERNAME,
    subject: `Contact us - from ${email} - ${contactInfo.name} - ${contactInfo?.subject}`,
    text: contactInfo?.body,
  };

  await sendEmail(mailOptions);

  return res.sendStatus(200);
};

const refreshToken = async (req, res) => {
  const cookies = req.cookies;
  console.log(`cookies: ${cookies}`);
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    return res.status(403).json({
      success: false,
      message: `User doesn't exist`,
    });
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.email !== decoded.email) {
      return res.status(403).json({
        success: false,
        message: `User doesn't exist`,
      });
    }
    const accessToken = jwt.sign(
      {
        UserInfo: {
          email: decoded.email,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '5m' }
    );
    res.json({ accessToken });
  });
};

module.exports = {
  signup,
  login,
  logout,
  forgetPassword,
  refreshToken,
  contactUs,
  resetPassword,
  recapcha,
};
