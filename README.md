# Car-Management-Service Backend
This is a backend service for Car-Management-Service web app.
Express runs on port `4000`.

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

## Deployment
This git repo is connected to a vercel account that associated with MoshPe/Car-Management-Back-end github repo.
Vercel domain: [Car-Management-Service-Back-end](https://car-management-back-end.vercel.app/api/).

#*NOTE!*
**!!!The backend requires authentication using JWT so in order to use the service, login is required.!!!**

##Swagger
swagger will be up and running on:
- Local: http://localhost:4000/api-swagger
- vercel domain: https://car-management-back-end.vercel.app/api-swagger


# Enjoy! :smiley: