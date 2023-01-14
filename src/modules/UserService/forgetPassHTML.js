const forgetPass = (path) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Password</title>
  <style>
      body {
          font-family: Arial, Helvetica, sans-serif;
          direction: ltr;
          margin: 20px;
      }
      h2 {
          padding: 0px 20px;
      }
      div {
          margin: 20px;
      }
      .button {
          text-decoration: none;
          border: none;
          background: #65abfc;
          font-size: 17px;
          padding: 10px;
          margin: 10px 10px 10px 30px;
          border-radius: 10px;
          cursor: pointer;
      }
      button:hover {
          background: #4496f5;
      }
  </style>
</head>
<body dir="ltr">
<h1>Car Managment</h1>
<h2>Reset Password</h2>
<div>
  <p style="font-weight: bold">
    Hi, <br />
    Someone requested that the password be reset for the following account:
  </p>

  <p>To reset your password, visit the following address:</p>

  <a type="button" class="button" href='https://localhost:3000/${path}'>Click here to reset your password</a>
<!--  <button>Click here to reset your password</button>-->

  <p>
    If you didn't request a password reset, you can ignore this email. Your
    password will not be changed.
  </p>
</div>
<p>
  Thank you,<br />
  The Car-Managment Team.
</p>
</body>
</html>
`;
};

module.exports = forgetPass;
