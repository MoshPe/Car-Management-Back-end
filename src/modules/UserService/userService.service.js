require('console-stamp')(console, {
  format: ':date(yyyy/mm/dd HH:MM:ss.l) :label',
});

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');
const crypto = require('crypto');
const transporter = require('../mail/transporter');

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
      { expiresIn: '1h' }
    );
    const refreshToken = jwt.sign(
      { email: foundUser.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();

    console.log(result);

    //Expire in one day in ms
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      success: true,
      message: 'Successfully authenticated',
      accessToken,
    });
  } else res.status(401).send('Password incorrect');
};

const logout = async (req, res) => {
  const cookies = req.cookies;
  // if (!cookies?.jwt) return res.sendStatus(204); //No content
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
  foundUser.password = crypto.randomBytes(32).toString('hex');
  const result = await foundUser.save();

  console.log(result);

  const mailOptions = {
    from: 'moshe.peretz318@gmail.com',
    to: email,
    subject: 'test Email',
    text: 'For clients with plaintext support only',
    html: `
    <!DOCTYPE html>
    <html>
      <head>
        <!-- HTML Codes by Quackit.com -->
        <title>
        </title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
        body {background-color:#ffffff;background-repeat:no-repeat;background-position:top left;background-attachment:fixed;}
        h1{font-family:Arial, sans-serif;color:#000000;background-color:#ffffff;}
        p {font-family:Georgia, serif;font-size:14px;font-style:normal;font-weight:normal;color:#000000;background-color:#ffffff;}
        .button {
          border: none;
          color: white;
          padding: 16px 32px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 16px;
          margin: 4px 2px;
          transition-duration: 0.4s;
          cursor: pointer;
        }
        
        .button1 {
          background-color: white; 
          color: black; 
          border: 2px solid #4CAF50;
        }
        
        .button1:hover {
          background-color: #4CAF50;
          color: white;
        }
        </style>
      </head>
      <body>
        <h1>Reset Password - Car Management Service</h1>
        <p></p>
        <p>Hey there,</p>
        <p></p>
        <p>Someone requested a new password for your [customer portal] account.</p>
        <p></p>
        <button class="button button1">reset password</button>
        <p></p>
        <p>If you didn’t make this request, then you can ignore this email 🙂</p>
      </body>
    </html>
  `,
  };

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      // do something useful
    }
  });

  return res.sendStatus(200);
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
  const hashedPwd = await bcrypt.hash(user.password, 10);
  user.password = hashedPwd;

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

const refreshToken = async (req, res) => {
  const cookies = req.cookies;
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
      { expiresIn: '10s' }
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
};
