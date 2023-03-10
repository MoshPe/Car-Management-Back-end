# Car-Management-Service Backend
The car management backend service allows car owners to manage their vehicles' maintenance, repairs, and other related activities. It is built using Node.js, Express, and MongoDB and deployed on Vercel. The backend is integrated with Atlas MongoDB, which is a fully managed cloud database service, to ensure secure and scalable data storage.

The system incorporates a comprehensive authentication and authorization mechanism that enables users to sign up, log in, and securely access the app's functionalities. It uses JSON Web Tokens (JWT) to authenticate users and ensure that only authorized users can access the app's resources. The JWT tokens are encrypted, ensuring that sensitive user information remains secure.

Finally, the backend service is deployed on Vercel, which is a serverless cloud platform. Vercel's global edge network ensures that the app is fast and responsive, even during periods of high traffic. Additionally, Vercel's security features, including DDoS protection and HTTPS encryption, ensure that the app and user data remain secure at all times.

## First Use:
1. Run `npm install` to install all the dependencies.
2. create a `.env` file with the following keys:
   - `ACCESS_TOKEN_SECRET`
   - `REFRESH_TOKEN_SECRET`
   - `DATABASE_URI`
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_USERNAME`
   - `SMTP_PASSWORD`
   - `RECAPTCHA_SECRET_KEY`
3. Run `npm run dev`.

## Frontend
The frontend repo can be found here [TalChenBE/Car-Managment](https://github.com/TalChenBE/Car-Managment)

## Deployment
This git repo is connected to a vercel account that associated with MoshPe/Car-Management-Back-end github repo.
Vercel domain: [Car-Management-Service-Back-end](https://car-management-back-end.vercel.app/api/).

# *NOTE!*
**!!!The backend requires authentication using JWT so in order to use the service, login is required.!!!**

## Swagger
swagger will be up and running on:
- Local: http://localhost:4000/api-swagger
- vercel domain: https://car-management-back-end.vercel.app/api-swagger


# Enjoy! :smiley:
