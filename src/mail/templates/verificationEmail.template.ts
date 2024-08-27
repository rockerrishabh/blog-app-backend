export const verificationEmailTemplate = (
  name: string,
  email: string,
  token: string
) => {
  const subject = "Verify your Email Address";
  const verificationLink = `http://localhost:3000/auth/verify?token=${token}`;
  const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Verify Your Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            padding: 20px;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
        }

        header {
            text-align: center;
            margin-bottom: 20px;
        }

        footer {
            text-align: center;
            margin-top: 20px;
        }

        h1 {
            text-align: center;
            color: #333;
            font-size: 24px;
            margin-bottom: 20px;
        }

        p {
            text-align: center;
            margin-bottom: 20px;
            color: #666;
        }

        a {
         text-decoration: none;
        }

        span {
            display: block;
            text-align: center;
            padding: 15px 30px;
            background-color: #007bff;
            color: #fff;
            border-radius: 5px;
            font-size: 18px;
            transition: background-color 0.3s ease;
        }

        span:hover {
            background-color: #0062cc;
        }
    </style>
</head>
<body>
    <header>
        <h1>Verify your Email Address</h1>
    </header>
    <div class="container">
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationLink}"><span>Verify Email</span></a>
    </div>
    <footer>
        Copyright © 2024 Rishabh Kumar. All rights reserved.
    </footer>
</body>
</html>`;
  return {
    to: email,
    subject,
    html,
  };
};
